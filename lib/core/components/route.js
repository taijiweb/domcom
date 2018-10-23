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
var Route, TransformComponent, _route, getRoutePattern, isComponent, isEven, matchCurvedString, matchRoute, navigate, navigateTo, processPiecePatterns, processRouteItem, route, toComponent,
  splice = [].splice;

TransformComponent = require('./TransformComponent');

isComponent = require('./isComponent');

toComponent = require('./toComponent');

({isEven, matchCurvedString} = require('dc-util'));

module.exports = route = function(...routeList) {
  var baseIndex, otherwise, ref;
  ref = routeList, [...routeList] = ref, [otherwise, baseIndex] = splice.call(routeList, -2);
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
  return new Route(routeList2, otherwise, baseIndex);
};

route._navigateTo = navigateTo = function(oldPath, path, baseIndex = 0) {
  var base, upCount;
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
    return path = path.slice(1); // clear start '/'
  }
};

navigate = function(baseIndex) {
  return function(path) {
    var match, oldPath;
    oldPath = window.history && window.history.pushState ? decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '') : (match = location.href.match(/#(.*)$/)) ? match[1] : ''; // remove GET params
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

route.Route = Route = class Route extends TransformComponent {
  constructor(routeList1, otherwise1, baseIndex1) {
    var j, len1, patternRoute;
    super();
    this.routeList = routeList1;
    this.otherwise = otherwise1;
    this.baseIndex = baseIndex1;
    for (j = 0, len1 = routeList.length; j < len1; j++) {
      patternRoute = routeList[j];
      patternRoute[0] = getRoutePattern(patternRoute[0]);
    }
    this.otherwise = toComponent(otherwise);
    return;
  }

  getContentComponent() {
    var component, j, len1, path, patternRoute, ref;
    path = this.getPath();
    ref = this.routeList;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      patternRoute = ref[j];
      if (component = processRouteItem(patternRoute, path, this.baseIndex)) {
        return component;
      }
    }
    return this.otherwise;
  }

  getPath() {
    var match;
    if (window.history && window.history.pushState) {
      return decodeURI(location.pathname + location.search).replace(/\?(.*)$/, ''); // remove GET params
    } else if (match = location.href.match(/#(.*)$/)) {
      return match[1];
    } else {
      return '';
    }
  }

};

route._processRouteItem = processRouteItem = function(patternRoute, path, baseIndex) {
  var childRoute, handler, match, pattern, test;
  [pattern, handler] = patternRoute;
  if (pattern instanceof Array) {
    [pattern, test] = pattern;
  }
  match = matchRoute(pattern, path, baseIndex);
  if (!match || (test && !(match = test(match, path, baseIndex)))) {
    return;
  }
  childRoute = function(...routeList) {
    var baseIndex, otherwise, ref;
    ref = routeList, [...routeList] = ref, [otherwise, baseIndex] = splice.call(routeList, -2);
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
        throw new Error(`route pattern error: expect a parameter identifier ${segmentPattern}`);
      }
      ch = segmentPattern[++i];
      while (ch && ch.match(/[$\w]/)) {
        ch = segmentPattern[++i];
      }
      if (i === start + 1) {
        throw new Error(`route pattern error: expect a parameter identifier ${segmentPattern}`);
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
            key,
            pattern: new RegExp(segmentPattern.slice(start + 1, i - 1))
          });
          ch = segmentPattern[i];
        } else {
          throw new Error('route pattern error: missing ) for regexp');
        }
      } else {
        pieces.push({
          key,
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
  var absolute, atHead, endSlash, i, len, moreComing, nonameRegExpIndex, params, pieces, segment, segmentPatterns, segments, upCount;
  pattern = '' + pattern;
  if (pattern.match(/\\\//)) {
    new Error('should not include /\\\// in pattern');
  }
  if (pattern === '') {
    segments = [];
  } else {
    segments = pattern.split('/'); // '' at head or end will be processed in the loop
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
      [pieces, nonameRegExpIndex] = processPiecePatterns(segment, params, nonameRegExpIndex);
      segmentPatterns.push(pieces);
    }
    atHead = false;
  }
  return {segmentPatterns, absolute, upCount, endSlash, moreComing};
};

route._matchRoute = matchRoute = function(pattern, path, baseIndex) {
  var base, basePath, i, items, j, k, leftPath, len, len1, len2, m, matchIndex, pathSegment, pathSegments, piece, piecePattern, ref, segmentPattern, segmentStr, segments;
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
  ref = pattern.segmentPatterns;
  for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
    segmentPattern = ref[i];
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
    for (k = 0, len2 = segmentPattern.length; k < len2; k++) {
      piece = segmentPattern[k];
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
  return {items, basePath, segments, leftPath, base};
};
