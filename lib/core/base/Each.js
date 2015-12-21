var Each, Func, List, Text, TransformComponent, flow, funcString, isArray, newLine, react, renew, toComponent, watchEachList, watchEachObject, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

List = require('./List');

Func = require('./Func');

Text = require('./Text');

_ref = require('dc-util'), isArray = _ref.isArray, funcString = _ref.funcString, newLine = _ref.newLine;

_ref1 = require('lazy-flow'), react = _ref1.react, renew = _ref1.renew, flow = _ref1.flow;

_ref2 = require('dc-watch-list'), watchEachList = _ref2.watchEachList, watchEachObject = _ref2.watchEachObject;

module.exports = Each = (function(_super) {
  __extends(Each, _super);

  function Each(items, itemFn, options) {
    var key, me;
    this.itemFn = itemFn;
    if (options == null) {
      options = {};
    }
    Each.__super__.constructor.call(this);
    this.family = {};
    me = this;
    if (typeof items === 'function') {
      this.isFunction = true;
      !items.invalidate && (items = renew(items));
      items.onInvalidate(this.invalidateTransform.bind(this));
    }
    this.items = items;
    if (options.sort) {
      this.needSort = true;
      if (typeof options.sort === 'function') {
        this.sortFunction = options.sort;
      } else {
        this.sortFunction = null;
      }
    }
    key = options.key;
    this.keyFunction = typeof key === 'function' ? key : key != null ? function(item, i) {
      return item[key];
    } : void 0;
    this.childReactives = [];
    this.memoComponents = {};
    this.memoChildMap = {};
    this.cacheChildren = [];
    this.listComponent = new List([]);
    this.listComponent.holder = this;
    return;
  }

  Each.prototype.getItems = function() {};

  Each.prototype.getContentComponent = function() {
    var isFunction, items, key, length, listComponent, needSort, value, watchingMe, _items;
    listComponent = this.listComponent, items = this.items, isFunction = this.isFunction, needSort = this.needSort;
    if (!items) {
      return this.emptyPlaceHolder || (this.emptyPlaceHolder = new Text(''));
    }
    if (isFunction) {
      items = items();
      if (!items) {
        return this.emptyPlaceHolder || (this.emptyPlaceHolder = new Text(''));
      }
      if (typeof items !== 'object') {
        throw new Error('Each Component need an array or object');
      }
    }
    if (!(this.isArrayItems = items instanceof Array)) {
      items = (function() {
        var _results;
        _results = [];
        for (key in items) {
          value = items[key];
          _results.push([key, value]);
        }
        return _results;
      })();
    }
    if (needSort) {
      items.sort(this.sortFunction);
    } else {
      _items = this._items;
      _items && _items.watchingComponents && delete _items.watchingComponents[this.dcid];
      watchingMe = items && items.watchingComponents && items.watchingComponents[this.dcid];
      if (!this.notWatch && !watchingMe) {
        if (this.isArrayItems) {
          watchEachList(items, this);
        } else {
          watchEachObject(items, this);
        }
      }
    }
    this._items = items;
    length = items.length;
    if (length < listComponent.children.length) {
      this._setLength(length);
      if (isFunction || needSort || !this.isArrayItems) {
        this.invalidateChildren(0, length);
      }
    } else {
      this.invalidateChildren(0, length);
    }
    return listComponent;
  };

  Each.prototype.getChild = function(index) {
    var cacheChildren, child, childReactives, children, itemFn, keyFunction, listComponent, me, memoKey;
    me = this;
    if (keyFunction) {
      memoKey = this.isArrayItems ? keyFunction(_items[index], index) : keyFunction(_items[index][0], _items[index][1], index);
    }
    listComponent = this.listComponent, cacheChildren = this.cacheChildren, children = this.children, childReactives = this.childReactives, keyFunction = this.keyFunction, itemFn = this.itemFn;
    children = listComponent.children;
    if (keyFunction) {
      if (this.memoChildMap[memoKey]) {
        throw new Error('duplicated memo key in Each Component');
      }
      if (child = this.memoComponents[memoKey]) {
        child.valid = false;
        child.transformValid = false;
        children[index] = cacheChildren[index] = child;
        this.memoChildMap[memoKey] = child;
        return child;
      }
    }
    if (index < children.length) {
      child = children[index];
      child.valid = false;
      child.transformValid = false;
    } else if (index < cacheChildren.length) {
      child = children[index] = cacheChildren[index];
      child.valid = false;
      child.transformValid = false;
    } else {
      childReactives[index] = react(function() {
        var item, items, key, result, value;
        items = me._items;
        item = items[index];
        if (itemFn.pouring) {
          child.invalidateTransform();
        }
        return result = me.isArrayItems ? itemFn(item, index, items, me) : ((key = item[0], value = item[1], item), itemFn(value, key, index, items, me));
      });
      children[index] = cacheChildren[index] = child = new Func(childReactives[index]);
      child.holder = listComponent;
      listComponent.dcidIndexMap[child.dcid] = index;
    }
    return child;
  };

  Each.prototype.invalidateChildren = function(start, stop) {
    var children, i, listComponent, oldChildrenLength;
    if (stop == null) {
      stop = start + 1;
    }
    i = start;
    listComponent = this.listComponent;
    children = listComponent.children;
    oldChildrenLength = children.length;
    while (i < stop) {
      this.getChild(i);
      i++;
    }
    if (stop > oldChildrenLength) {
      children[stop - 1].nextNode = this.nextNode;
    }
    listComponent.invalidChildren(start, stop);
    return this;
  };

  Each.prototype._setLength = function(length) {
    var index, listComponent, oldLength;
    listComponent = this.listComponent;
    oldLength = listComponent.children.length;
    if (length >= oldLength) {
      return this;
    } else {
      if (this.keyFunction) {
        index = length;
        while (index < oldLength) {
          delete memoChildMap[children[index].memoKey];
          index++;
        }
      }
      listComponent.setLength(length);
      return this;
    }
  };

  Each.prototype.clone = function(options) {
    return (new Each(this.items, this.itemFn, options || this.options)).copyEventListeners(this);
  };

  Each.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 0;
    }
    return newLine("<Each " + (funcString(this.items)) + " " + (funcString(this.itemFn)) + "/>", indent, addNewLine);
  };

  return Each;

})(TransformComponent);
