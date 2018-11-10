var ListWatchMixin, ObjectWatchMixin, extend, flow, isArray, isEachObjectSystemKey, react, slice, watchList, watchObject,
  __slice = [].slice;

react = (flow = require('lazy-flow')).react;

isArray = require('dc-util').isArray;

extend = require('extend');

module.exports = flow;

slice = Array.prototype.slice;

flow.watchList = watchList = function(listItems, listComponent) {
  var watchingListComponents;
  watchingListComponents = listItems.watchingListComponents || (listItems.watchingListComponents = {});
  watchingListComponents[listComponent.dcid] = listComponent;
  if (listItems.eachWatching) {
    return;
  }
  listItems.eachWatching = true;
  listItems._shift = listItems.shift;
  listItems._pop = listItems.pop;
  listItems._push = listItems.push;
  listItems._reverse = listItems.reverse;
  listItems._sort = listItems.sort;
  listItems._splice = listItems.splice;
  listItems._unshift = listItems.unshift;
  listItems.shift = ListWatchMixin.shift;
  listItems.pop = ListWatchMixin.pop;
  listItems.push = ListWatchMixin.push;
  listItems.reverse = ListWatchMixin.reverse;
  listItems.sort = ListWatchMixin.sort;
  listItems.splice = ListWatchMixin.splice;
  listItems.unshift = ListWatchMixin.unshift;
  listItems.setItem = ListWatchMixin.setItem;
  listItems.setLength = ListWatchMixin.setLength;
  listItems.updateComponents = ListWatchMixin.updateComponents;
  listItems.updateComponent = ListWatchMixin.updateComponent;
  listItems.getListChildren = ListWatchMixin.getListChildren;
  return listItems.replaceAll = ListWatchMixin.replaceAll;
};

ListWatchMixin = {};

ListWatchMixin.getListChildren = function(listComponent, start, stop) {
  var children, i, itemComponent;
  children = [];
  i = start;
  while (i < stop) {
    itemComponent = listComponent.getItemComponent(this[i], i);
    itemComponent.valid = true;
    children.push(itemComponent);
    i++;
  }
  return children;
};

ListWatchMixin.updateComponent = function(listComponent, start, stop) {
  var children;
  children = this.getListChildren(listComponent, start, stop);
  listComponent.setChildren(start, children);
  return this;
};

ListWatchMixin.updateComponents = function(start, stop) {
  var listComponent, watchingListComponents, _;
  watchingListComponents = this.watchingListComponents;
  for (_ in watchingListComponents) {
    listComponent = watchingListComponents[_];
    this.updateComponent(listComponent, start, stop);
  }
  return this;
};

ListWatchMixin.setItem = function() {
  var i, start, value, values, _i, _len;
  start = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  start = start >>> 0;
  if (start < 0) {
    start = 0;
  }
  for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
    value = values[i];
    this[start + i] = values[i];
  }
  this.updateComponents(start, start + values.length);
  return this;
};

ListWatchMixin.pop = function() {
  var listComponent, result, watchingListComponents, _;
  if (!this.length) {

  } else {
    watchingListComponents = this.watchingListComponents;
    result = this._pop();
    for (_ in watchingListComponents) {
      listComponent = watchingListComponents[_];
      listComponent.popChild();
    }
    return result;
  }
};

ListWatchMixin.push = function() {
  var args, child, length, listComponent, result, watchingListComponents, _;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  watchingListComponents = this.watchingListComponents;
  length = this.length;
  result = this._push.apply(this, arguments);
  for (_ in watchingListComponents) {
    listComponent = watchingListComponents[_];
    child = listComponent.getItemComponent(this[length], length);
    listComponent.pushChild(child);
  }
  return result;
};

ListWatchMixin.unshift = function() {
  var args, length, listComponent, watchingListComponents, _;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (!this.length) {
    return this;
  } else {
    watchingListComponents = this.watchingListComponents;
    this._shift();
    length = this.length;
    for (_ in watchingListComponents) {
      listComponent = watchingListComponents[_];
      if (!listComponent.updateSuccChild) {
        listComponent.shiftChild();
      } else {
        this.updateComponent(listComponent, length);
      }
    }
    return this;
  }
};

ListWatchMixin.unshift = function(child) {
  var listComponent, watchingListComponents, _, _results;
  this._unshift(child);
  watchingListComponents = this.watchingListComponents;
  _results = [];
  for (_ in watchingListComponents) {
    listComponent = watchingListComponents[_];
    if (!listComponent.updateSuccChild) {
      child = listComponent.getItemComponent(this[0], 0);
      _results.push(listComponent.unshiftChild(child));
    } else {
      _results.push(this.updateComponent(listComponent, this.length));
    }
  }
  return _results;
};

ListWatchMixin.reverse = function() {
  var listLength;
  listLength = this.length;
  if (listLength <= 1) {
    return this;
  } else {
    this._reverse();
    return this.updateComponents(0, listLength);
  }
};

ListWatchMixin.sort = function() {
  var listLength;
  listLength = this.length;
  if (listLength <= 1) {
    return this;
  } else {
    this._sort();
    return this.updateComponents(0, listLength);
  }
};

ListWatchMixin.splice = function(start, deleteCount) {
  var child, i, inserted, insertedLength, j, listComponent, newLength, oldListLength, result, watchingListComponents, _;
  inserted = slice.call(arguments, 2);
  insertedLength = inserted.length;
  if (deleteCount === 0 && insertedLength === 0) {
    return this;
  } else {
    oldListLength = this.length;
    start = start >>> 0;
    if (start < 0) {
      start = 0;
    } else if (start > oldListLength) {
      start = oldListLength;
    }
    result = this._splice.apply(this, [start, deleteCount].concat(inserted));
    newLength = this.length;
    if (newLength === oldListLength) {
      this.updateComponents(start, start + insertedLength);
    } else {
      watchingListComponents = this.watchingListComponents;
      for (_ in watchingListComponents) {
        listComponent = watchingListComponents[_];
        if (!listComponent.updateSuccChild) {
          if (insertedLength > deleteCount) {
            i = start;
            j = 0;
            while (j < deleteCount) {
              child = listComponent.getItemComponent(this[i], i);
              listComponent.replaceChild(i, child);
              i++;
              j++;
            }
            while (j < insertedLength) {
              child = listComponent.getItemComponent(this[i], i);
              listComponent.insertChild(i, child);
              i++;
              j++;
            }
          } else {
            i = start;
            j = 0;
            while (j < insertedLength) {
              child = listComponent.getItemComponent(this[i], i);
              listComponent.replaceChild(i, child);
              i++;
              j++;
            }
            while (j < deleteCount) {
              listComponent.removeChild(i);
              j++;
            }
          }
        } else {
          this.updateComponent(listComponent, start, newLength);
        }
      }
    }
    return this;
  }
};

ListWatchMixin.setLength = function(length) {
  var listComponent, oldListLength, watchingListComponents, _;
  oldListLength = this.length;
  if (length === oldListLength) {
    return this;
  } else if (length <= oldListLength) {
    watchingListComponents = this.watchingListComponents;
    this.length = length;
    for (_ in watchingListComponents) {
      listComponent = watchingListComponents[_];
      listComponent.setLength(length);
    }
    return this;
  } else {
    this.updateComponents(oldListLength, length);
    return this;
  }
};

ListWatchMixin.replaceAll = function(newItems) {
  this.setItem.apply(this, [0].concat(__slice.call(newItems)));
  this.setLength(newItems.length);
  return this;
};

flow.watchObject = watchObject = function(objectItems, listComponent, itemFn) {
  var watchingListComponents;
  watchingListComponents = objectItems.watchingListComponents || (objectItems.watchingListComponents = {});
  watchingListComponents[listComponent.dcid] = listComponent;
  if (objectItems.eachWatching) {
    return;
  }
  objectItems.eachWatching = true;
  return extend(objectItems, ObjectWatchMixin);
};

ObjectWatchMixin = {};

ObjectWatchMixin.deleteItem = function() {
  var children, i, index, key, keyChildMap, keys, length, listComponent, newChild, oldChild, watchingListComponents, _, _i, _len;
  keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  watchingListComponents = this.watchingListComponents;
  if (!watchingListComponents.length) {
    return this;
  }
  for (_i = 0, _len = keys.length; _i < _len; _i++) {
    key = keys[_i];
    if (this.hasOwnProperty(key)) {
      if (key.slice(0, 3) === '$dc') {
        throw new Error('do not remove the key: ' + key + ', which is used by "each component" of dc');
      }
      delete this[key];
      for (_ in watchingListComponents) {
        listComponent = watchingListComponents[_];
        keyChildMap = listComponent.keyChildMap;
        index = keyChildMap[key];
        children = listComponent.children;
        length = children.length;
        break;
      }
      for (_ in watchingListComponents) {
        listComponent = watchingListComponents[_];
        if (!listComponent.updateSuccChild) {
          listComponent.removeChild(index);
        } else {
          i = index + 1;
          children = listComponent.children;
          while (i < length) {
            oldChild = children[i];
            newChild = listComponent.getItemComponent(oldChild.$watchingKey, i, this, listComponent);
            listComponent.replaceChild(oldChild, newChild);
            i++;
          }
          listComponent.removeChild(index);
        }
        delete keyChildMap[key];
      }
    }
  }
  return this;
};

ObjectWatchMixin.setItem = function(key, value) {
  var length, listComponent, newChild, oldChildIndex, watchingListComponents, _;
  if (isEachObjectSystemKey(key)) {
    throw new Error('do not use the key: ' + key + ', which is used by "each component" of dc');
  }
  watchingListComponents = this.watchingListComponents;
  if (this.hasOwnProperty(key)) {
    this[key] = value;
    for (_ in watchingListComponents) {
      listComponent = watchingListComponents[_];
      oldChildIndex = listComponent.keyChildMap[key];
      newChild = listComponent.getItemComponent(key, oldChildIndex, this, listComponent);
      listComponent.replaceChild(oldChild, newChild);
    }
  } else {
    length = listComponent.children.length;
    for (_ in watchingListComponents) {
      listComponent = watchingListComponents[_];
      newChild = listComponent.getItemComponent(key, length, this, listComponent);
      listComponent.pushChild(newChild);
    }
  }
  return this;
};

ObjectWatchMixin.extendItems = function(obj) {
  var key, value;
  for (key in obj) {
    value = obj[key];
    this.setItem(key, value);
  }
  return this;
};

ObjectWatchMixin.replaceAll = function(obj) {
  var key, keys, _i, _len;
  keys = Object.keys(this);
  for (_i = 0, _len = keys.length; _i < _len; _i++) {
    key = keys[_i];
    if (!obj.hasOwnProperty(key)) {
      this.deleteItem(key);
    }
  }
  this.extendItems(obj);
  return this;
};

flow.isEachObjectSystemKey = isEachObjectSystemKey = function(key) {
  return /setItem|deleteItem|extendItems|watchingListComponents|eachWatching/.test(key);
};

flow.watchItems = function(items, listComponent) {
  if (!items) {
    throw new Error('items to be watched should be an array or object.');
  }
  if (isArray(items)) {
    watchList(items, listComponent);
  } else {
    watchObject(items, listComponent);
  }
  return listComponent;
};
