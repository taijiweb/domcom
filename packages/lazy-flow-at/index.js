var atMethod, bind, duplex, flow, funcString, invalidateBindPath, newLine, react, _ref, _ref1;

_ref = require('dc-util'), newLine = _ref.newLine, funcString = _ref.funcString;

_ref1 = flow = require("lazy-flow"), bind = _ref1.bind, duplex = _ref1.duplex, react = _ref1.react;

module.exports = flow;

atMethod = function(method) {
  return function(root, path) {
    var len, reactive;
    if (arguments.length === 1) {
      path = root;
      if (typeof window !== 'undefined') {
        root = window;
      } else {
        root = global;
      }
    }
    if (typeof path === 'string') {
      path = path.split(/\.\s*/);
    }
    if (!path.length) {
      return root;
    }
    if (typeof root !== 'object') {
      throw new Error('expect an object as the root of flow.at');
    }
    len = path.length;
    if (len === 0) {
      return root;
    }
    reactive = react(function(value) {
      var i, item, parent;
      if (arguments.length) {
        i = 0;
        parent = root;
        while (i < len - 1) {
          item = parent[path[i]];
          if (item == null) {
            item = parent[path[i]] = {};
          } else if (typeof parent !== 'object') {
            throw new Error('expect an object');
          }
          parent = item;
          i++;
        }
        parent[path[i]] = value;
        if (reactive.cacheValue !== value) {
          reactive.cacheValue = value;
          reactive.invalidate();
          reactive.valid = false;
        }
        return value;
      } else {
        reactive.valid = true;
        i = 0;
        item = root;
        while (i < len) {
          if (!item) {
            return;
          }
          item = item[path[i]];
          i++;
        }
        return reactive.cacheValue = item;
      }
    });
    if (method === duplex) {
      reactive.isDuplex = true;
    }
    return invalidateBindPath(root, path, reactive, method);
  };
};

invalidateBindPath = function(root, path, atFunc, method) {
  var attr, bound, i, len, parent;
  len = path.length;
  if (!len) {
    return atFunc;
  }
  parent = root;
  i = 0;
  while (i < len) {
    if (!parent) {
      return;
    }
    attr = path[i];
    bound = method(parent, attr);
    bound.onInvalidate(function() {
      invalidateBindPath(parent[attr], path.slice(i + 1), atFunc);
      return atFunc.invalidate();
    });
    i++;
  }
  return atFunc;
};

flow.at = atMethod(bind);

flow.at2 = atMethod(duplex);

flow.paths = function(obj, pathPattern) {
  var flowPaths, head, item, itemList, length, pathList, pathList2, paths, x, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref2;
  itemList = pathPattern.split(/\s*\.\s*/);
  paths = [];
  for (_i = 0, _len = itemList.length; _i < _len; _i++) {
    item = itemList[_i];
    if (item[0] === '[') {
      length = item.length;
      if (item[item.length - 1] !== ']') {
        throw new Error("wrong format of pathPattern for flow.paths, expect string like 'x.y, '[x, y].z', 'x.[y,z]' ...");
      }
      item = item.slice(1, length - 1);
      paths.push(item.split(/\s*\.\s*|\s+/));
    } else {
      paths.push([item]);
    }
  }
  pathList = paths[0];
  _ref2 = paths.slice(1);
  for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
    item = _ref2[_j];
    pathList2 = [];
    for (_k = 0, _len2 = pathList.length; _k < _len2; _k++) {
      head = pathList[_k];
      for (_l = 0, _len3 = path.length; _l < _len3; _l++) {
        x = path[_l];
        pathList2.push(head.concat([x]));
      }
    }
    pathList = pathList2;
  }
  flowPaths = [];
  for (_m = 0, _len4 = pathList.length; _m < _len4; _m++) {
    item = pathList[_m];
    flowPaths.push(at(obj, item));
  }
  return flowPaths;
};
