var flow, react, slice,
  __slice = [].slice;

react = (flow = require('./index')).react;

module.exports = flow;

slice = Array.prototype.slice;

flow.watchEachList = function(listItems, component) {
  var pop, push, reverse, shift, sort, splice, unshift, watchingComponents;
  watchingComponents = listItems.watchingComponents || (listItems.watchingComponents = {});
  watchingComponents[component.dcid] = component;
  if (listItems.$dcWatching) {
    return;
  }
  listItems.$dcWatching = true;
  shift = listItems.shift;
  pop = listItems.pop;
  push = listItems.push;
  reverse = listItems.reverse;
  sort = listItems.sort;
  splice = listItems.splice;
  unshift = listItems.unshift;
  listItems.setItem = function() {
    var dcid, i, j, listLength, startIndex, values, valuesLength;
    startIndex = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    startIndex = startIndex >>> 0;
    if (startIndex < 0) {
      throw new Error('array index is negative');
    }
    listLength = listItems.length;
    i = startIndex;
    j = 0;
    valuesLength = values.length;
    while (j < valuesLength) {
      listItems[i] = values[j];
      i++;
      j++;
    }
    if (startIndex < listLength) {
      for (dcid in watchingComponents) {
        component = watchingComponents[dcid];
        component.invalidateChildren(startIndex, i);
      }
    } else {
      for (dcid in watchingComponents) {
        component = watchingComponents[dcid];
        component.invalidateChildren(listLength, i);
      }
    }
  };
  listItems.pop = function() {
    var dcid, listLength, result;
    listLength = listItems.length;
    if (!listLength) {
      return;
    }
    result = pop.call(this);
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      component.invalidateChildren(listLength - 1, listLength);
    }
    return result;
  };
  listItems.push = function() {
    var dcid, listLength, oldLength, result;
    oldLength = listItems.length;
    result = push.apply(listItems, arguments);
    listLength = listItems.length;
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      component.invalidateChildren(oldLength, listLength);
    }
    return result;
  };
  listItems.shift = function() {
    var dcid, listLength, result;
    if (!listItems.length) {
      return;
    }
    result = shift.call(this);
    listLength = listItems.length;
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      component.invalidateChildren(0, listLength);
    }
    return result;
  };
  listItems.unshift = function() {
    var dcid, listLength, result;
    result = unshift.apply(listItems, arguments);
    listLength = listItems.length;
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      component.invalidateChildren(0, listLength);
    }
    return result;
  };
  listItems.reverse = function() {
    var dcid, listLength;
    listLength = listItems.length;
    if (listLength <= 1) {
      return listItems;
    }
    reverse.call(listItems);
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      component.invalidateChildren(0, listLength);
    }
    return listItems;
  };
  listItems.sort = function() {
    var dcid, listLength;
    listLength = listItems.length;
    if (listLength <= 1) {
      return listItems;
    }
    sort.call(listItems);
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      component.invalidateChildren(0, listLength);
    }
    return listItems;
  };
  listItems.splice = function(start, deleteCount) {
    var dcid, inserted, len, listLength, oldListLength, result;
    len = arguments.length;
    oldListLength = listItems.length;
    start = start >>> 0;
    if (start < 0) {
      start = 0;
    }
    if (start > oldListLength) {
      start = oldListLength;
    }
    inserted = slice.call(arguments, 2);
    result = splice.apply(this, [start, deleteCount].concat(inserted));
    listLength = listItems.length;
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      if (oldListLength === listLength) {
        component.invalidateChildren(start, start + deleteCount);
      } else {
        component.invalidateChildren(start, Math.max(oldListLength, listLength));
      }
    }
    return result;
  };
  return listItems.setLength = function(length) {
    var dcid, oldListLength;
    oldListLength = listItems.length;
    if (length === oldListLength) {
      return;
    }
    listItems.length = length;
    for (dcid in watchingComponents) {
      component = watchingComponents[dcid];
      if (length > oldListLength) {
        component.invalidateChildren(oldListLength, length);
      } else {
        component._setLength(length);
      }
    }
  };
};

flow.watchEachObject = function(objectItems, component) {
  var watchingComponents;
  watchingComponents = objectItems.watchingComponents || (objectItems.watchingComponents = {});
  watchingComponents[component.dcid] = component;
  if (objectItems.$dcWatching) {
    return;
  }
  objectItems.$dcWatching = true;
  objectItems.deleteItem = function() {
    var dcid, index, items, key, key1, keys, min, oldItemsLength, _, _i, _j, _len, _len1, _ref, _ref1, _results;
    keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    items = component._items;
    oldItemsLength = items.length;
    _results = [];
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      if (!objectItems.hasOwnProperty(key)) {
        continue;
      }
      delete objectItems[key];
      for (dcid in watchingComponents) {
        component = watchingComponents[dcid];
        min = oldItemsLength;
        _ref = component.items;
        for (index = _j = 0, _len1 = _ref.length; _j < _len1; index = ++_j) {
          _ref1 = _ref[index], key1 = _ref1[0], _ = _ref1[1];
          if (key1==key) {
            items.splice(index, 1);
            if (index < min) {
              min = index;
            }
            component.invalidateChildren(min, oldItemsLength);
            break;
          }
        }
      }
      _results.push(oldItemsLength--);
    }
    return _results;
  };
  objectItems.setItem = function(key, value) {
    var dcid, index, items, key1, length, _, _results, _results1;
    items = component._items;
    if (objectItems.hasOwnProperty(key)) {
      if (objectItems[key] !== value) {
        _results = [];
        for (dcid in watchingComponents) {
          component = watchingComponents[dcid];
          _results.push((function() {
            var _i, _len, _ref, _results1;
            _results1 = [];
            for (index = _i = 0, _len = items.length; _i < _len; index = ++_i) {
              _ref = items[index], key1 = _ref[0], _ = _ref[1];
              if (key1==key) {
                component.invalidateChildren(index, index + 1);
                break;
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        }
        return _results;
      }
    } else {
      length = _items.length;
      _results1 = [];
      for (dcid in watchingComponents) {
        component = watchingComponents[dcid];
        _items.push([key, value]);
        _results1.push(component.invalidateChildren(length, length + 1));
      }
      return _results1;
    }
  };
  return objectItems.extend = function(obj) {
    var key, value, _results;
    _results = [];
    for (key in obj) {
      value = obj[key];
      _results.push(objectItems.setItem(key, value));
    }
    return _results;
  };
};

flow.pour = function(itemFn) {
  itemFn.pouring = true;
  return itemFn;
};
