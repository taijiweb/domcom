
/*
  route '...', ((match, route) ->
          ...
          route ...),
      ...
      otherwise
      baseIndex

   * match: {items, basePath, segment, leftPath, childBase}
  handler = (match, route) ->
  otherwiseHandler = (route) ->

  :user # yes: .../xxx  no: .../xxx/
  :user/  # yes .../xxx/ no /xxx
  :user:\w+/ # yes: .../xyz
  :user:(a\d*)/**
  :user**
  :user/name=:name
  **
  *
 */
var Router, TransformComponent, getRoutePattern, isComponent, isEven, matchCurvedString, matchRoute, navigate, navigateTo, processPiecePatterns, processRouteItem, route, toComponent, _ref, _route,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TransformComponent = require('./TransformComponent');

isComponent = require('./isComponent');

toComponent = require('./toComponent');

_ref = require('../../util'), isEven = _ref.isEven, matchCurvedString = _ref.matchCurvedString;

module.exports = route = function() {
  var baseIndex, otherwise, routeList, _i;
  routeList = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), otherwise = arguments[_i++], baseIndex = arguments[_i++];
  return _route(routeList, otherwise, baseIndex, 0);
};

_route = function(routeList, otherwise, baseIndex, defaultBaseIndex) {
  var i, len, routeList2;
  if (typeof baseIndex === 'function') {
    routeList.push(otherwise);
    routeList.push(baseIndex);
    otherwise = null;
    baseIndex = defaultBaseIndex;
  } else if (isComponent(baseIndex)) {
    routeList.push(otherwise);
    otherwise = baseIndex;
    baseIndex = defaultBaseIndex;
  } else if (baseIndex && !isComponent(baseIndex) && baseIndex.otherwise) {
    routeList.push(otherwise);
    otherwise = baseIndex.otherwise;
    baseIndex = defaultBaseIndex;
  } else {
    baseIndex = baseIndex >>> 0;
    if (otherwise && !isComponent(otherwise) && otherwise.otherwise) {
      otherwise = otherwise.otherwise;
    }
  }
  len = routeList.length;
  if (!isEven(len)) {
    throw new Error('route parameter error: missing matched handler');
  }
  if (len < 2 || typeof routeList[len - 1] !== 'function') {
    throw new Error('route parameter error:\n  expect route(pattern, handler, pattern, handler, ..., otherwise, baseIndex)');
  }
  routeList2 = [];
  i = 0;
  while (i < len) {
    routeList2.push([routeList[i], routeList[i + 1]]);
    i += 2;
  }
  return new Router(routeList2, otherwise, baseIndex);
};

route._navigateTo = navigateTo = function(oldPath, path, baseIndex) {
  var base, upCount;
  if (baseIndex == null) {
    baseIndex = 0;
  }
  path = '' + path;
  if (path[0] !== '/') {
    upCount = 0;
    while (path) {
      if (path.slice(0, 2) === './') {
        path = path.slice(2);
      } else if (path.slice(0, 3) === '../') {
        path = path.slice(3);
        upCount++;
      } else {
        break;
      }
    }
    baseIndex -= upCount;
    if (baseIndex < 0) {
      baseIndex = 0;
    }
    base = oldPath.split('/').slice(0, baseIndex).join('/') + '/';
    if (base === '/') {
      base = '';
    }
    return path = base + path;
  } else {
    return path = path.slice(1);
  }
};

navigate = function(baseIndex) {
  return function(path) {
    var match, oldPath;
    oldPath = window.history && window.history.pushState ? decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '') : (match = location.href.match(/#(.*)$/)) ? match[1] : '';
    navigateTo(oldPath, path, baseIndex);
    if (window.history && window.history.pushState) {
      history.pushState(null, null, path);
    } else {
      location.href = location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return path;
  };
};

route.to = navigate(0);

route.Router = Router = (function(_super) {
  __extends(Router, _super);

  function Router(routeList, otherwise, baseIndex) {
    var patternRoute, _i, _len;
    this.routeList = routeList;
    this.otherwise = otherwise;
    this.baseIndex = baseIndex;
    for (_i = 0, _len = routeList.length; _i < _len; _i++) {
      patternRoute = routeList[_i];
      patternRoute[0] = getRoutePattern(patternRoute[0]);
    }
    this.otherwise = toComponent(otherwise);
    return;
  }

  Router.prototype.getContentComponent = function() {
    var component, path, patternRoute, _i, _len, _ref1;
    path = this.getPath();
    _ref1 = this.routeList;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      patternRoute = _ref1[_i];
      if (component = processRouteItem(patternRoute, path, this.baseIndex)) {
        return component;
      }
    }
    return this.otherwise;
  };

  Router.prototype.getPath = function() {
    var match;
    if (window.history && window.history.pushState) {
      return decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '');
    } else if (match = location.href.match(/#(.*)$/)) {
      return match[1];
    } else {
      return '';
    }
  };

  return Router;

})(TransformComponent);

route._processRouteItem = processRouteItem = function(patternRoute, path, baseIndex) {
  var childRoute, handler, match, pattern, test, _ref1;
  pattern = patternRoute[0], handler = patternRoute[1];
  if (pattern instanceof Array) {
    _ref1 = pattern, pattern = _ref1[0], test = _ref1[1];
  }
  match = matchRoute(pattern, path, baseIndex);
  if (!match || (test && !(match = test(match, path, baseIndex)))) {
    return;
  }
  childRoute = function() {
    var baseIndex, otherwise, routeList, _i;
    routeList = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), otherwise = arguments[_i++], baseIndex = arguments[_i++];
    return _route(routeList, otherwise, baseIndex, match.base);
  };
  childRoute.to = navigate(match.base);
  return toComponent(handler(match, childRoute));
};

route._processPiecePatterns = processPiecePatterns = function(segmentPattern, params, nonameRegExpIndex) {
  var ch, i, key, len, pieces, start;
  i = 0;
  len = segmentPattern.length;
  pieces = [];
  while (ch = segmentPattern[i]) {
    start = i;
    if (ch === ':') {
      ch = segmentPattern[++i];
      if (!ch.match(/[A-Za-z_$]/)) {
        throw new Error("route pattern error: expect a parameter identifier " + segmentPattern);
      }
      ch = segmentPattern[++i];
      while (ch && ch.match(/[$\w]/)) {
        ch = segmentPattern[++i];
      }
      if (i === start + 1) {
        throw new Error("route pattern error: expect a parameter identifier " + segmentPattern);
      }
      key = segmentPattern.slice(start + 1, i);
      if (params[key]) {
        throw new Error('route pattern error: repeated parameter name');
      } else {
        params[key] = true;
      }
      if (ch === '(') {
        start = i;
        if (i = matchCurvedString(segmentPattern, i)) {
          if (start + 1 === i - 1) {
            throw new Error('route pattern error: empty regexp: ()');
          }
          pieces.push({
            key: key,
            pattern: new RegExp(segmentPattern.slice(start + 1, i - 1))
          });
          ch = segmentPattern[i];
        } else {
          throw new Error('route pattern error: missing ) for regexp');
        }
      } else {
        pieces.push({
          key: key,
          pattern: new RegExp('\\w+')
        });
        ++i;
      }
    } else if (ch === '(') {
      if (i = matchCurvedString(segmentPattern, i)) {
        if (start + 1 === i - 1) {
          throw new Error('route pattern error: empty regexp: ()');
        }
        pieces.push({
          key: nonameRegExpIndex++,
          pattern: new RegExp(segmentPattern.slice(start + 1, i - 1))
        });
      } else {
        throw new Error('route pattern error: missing ) for regexp');
      }
    } else {
      ++i;
      while ((ch = segmentPattern[i]) && ch !== ':' && ch !== '(') {
        i++;
      }
      pieces.push({
        pattern: segmentPattern.slice(start, i)
      });
    }
  }
  return [pieces, nonameRegExpIndex];
};

route._getRoutePattern = getRoutePattern = function(pattern) {
  var absolute, atHead, endSlash, i, len, moreComing, nonameRegExpIndex, params, pieces, segment, segmentPatterns, segments, upCount, _ref1;
  pattern = '' + pattern;
  if (pattern.match(/\\\//)) {
    new Error('should not include /\\\// in pattern');
  }
  if (pattern === '') {
    segments = [];
  } else {
    segments = pattern.split('/');
  }
  upCount = 0;
  absolute = false;
  atHead = true;
  endSlash = false;
  moreComing = false;
  segmentPatterns = [];
  params = {};
  len = segments.length;
  i = 0;
  nonameRegExpIndex = 0;
  while (i < len) {
    segment = segments[i++];
    if (segment === '.') {
      if (atHead) {
        continue;
      } else {
        throw new Error('route pattern error: do not use ./ pattern except the start');
      }
    } else if (segment === '..') {
      if (atHead) {
        upCount++;
        continue;
      } else {
        throw new Error('route pattern error: do not use ../ except the start');
      }
    } else if (segment === '') {
      if (atHead) {
        absolute = true;
      } else if (i === len) {
        endSlash = true;
      } else {
        throw new Error('route pattern error: do not use ../ except the start');
      }
    } else if (segment === '*') {
      segmentPatterns.push('*');
    } else if (segment === '**') {
      if (i === len) {
        moreComing = true;
      } else {
        throw new Error('route pattern error: do not use ** except the last segment');
      }
    } else {
      _ref1 = processPiecePatterns(segment, params, nonameRegExpIndex), pieces = _ref1[0], nonameRegExpIndex = _ref1[1];
      segmentPatterns.push(pieces);
    }
    atHead = false;
  }
  return {
    segmentPatterns: segmentPatterns,
    absolute: absolute,
    upCount: upCount,
    endSlash: endSlash,
    moreComing: moreComing
  };
};

route._matchRoute = matchRoute = function(pattern, path, baseIndex) {
  var base, basePath, i, items, leftPath, len, m, matchIndex, pathSegment, pathSegments, piece, piecePattern, segmentPattern, segmentStr, segments, _i, _j, _len, _len1, _ref1;
  if (pattern.endSlash && path[path.length - 1] !== '/') {
    return;
  }
  if (pattern.absolute) {
    baseIndex = 0;
  } else {
    baseIndex -= pattern.upCount;
    if (baseIndex < 0) {
      baseIndex = 0;
    }
  }
  if (path === '/' || path === '') {
    pathSegments = [];
  } else {
    pathSegments = path.split('/');
    if (path[0] === '') {
      pathSegments.shift();
    }
  }
  len = pathSegments.length;
  base = baseIndex;
  items = {};
  segments = [];
  _ref1 = pattern.segmentPatterns;
  for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
    segmentPattern = _ref1[i];
    if (base >= len) {
      return;
    }
    if (segmentPattern === '*') {
      segments.push(pathSegments[base]);
      base++;
      continue;
    }
    matchIndex = 0;
    segmentStr = pathSegment = pathSegments[base];
    for (_j = 0, _len1 = segmentPattern.length; _j < _len1; _j++) {
      piece = segmentPattern[_j];
      piecePattern = piece.pattern;
      if (typeof piecePattern === 'string') {
        if (pathSegment.indexOf(piecePattern) === 0) {
          pathSegment = pathSegment.slice(piecePattern.length);
          matchIndex += piecePattern.length;
        } else {
          break;
        }
      } else {
        if (m = pathSegment.match(piecePattern)) {
          items[piece.key] = m;
          matchIndex += m[0].length;
        } else {
          break;
        }
      }
    }
    if (matchIndex !== segmentStr.length) {
      return;
    }
    segments.push(segmentStr);
    base++;
  }
  if (base !== len && !pattern.moreComing) {
    return;
  }
  basePath = '/' + pathSegments.slice(0, baseIndex + 1).join('/') + '/';
  leftPath = '/' + pathSegments.slice(base).join('/');
  return {
    items: items,
    basePath: basePath,
    segments: segments,
    leftPath: leftPath,
    base: base
  };
};
