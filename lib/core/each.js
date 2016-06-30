var List, Tag, defaultItemFunction, each, every, getEachArgs, isArray, isEachObjectSystemKey, isObject, toComponent, watchItems, _each, _ref, _ref1, _ref2,
  __slice = [].slice;

_ref = require('./base'), List = _ref.List, Tag = _ref.Tag, toComponent = _ref.toComponent;

_ref1 = require('dc-util'), isArray = _ref1.isArray, isObject = _ref1.isObject;

_ref2 = require('dc-watch-list'), watchItems = _ref2.watchItems, isEachObjectSystemKey = _ref2.isEachObjectSystemKey;

defaultItemFunction = function(item) {
  return item;
};

_each = function(attrs, items, options) {
  var EachClass, children, getItemComponent, i, item, key, keyChildMap, listComponent, tagName, _i, _len;
  if (attrs) {
    if (attrs.tagName) {
      tagName = attrs.tagName;
      delete attrs.tagName;
    } else {
      tagName = 'div';
    }
    if (attrs.EachClass) {
      EachClass = attrs.EachClass;
      delete attrs.EachClass;
    } else {
      EachClass = Tag;
    }
    listComponent = new EachClass(tagName, attrs, []);
  } else {
    EachClass = items.EachClass || List;
    listComponent = new EachClass([]);
  }
  listComponent.items = items;
  if (typeof options === 'function') {
    listComponent.itemFunc = options;
    options = {};
  } else {
    options = options || {};
    listComponent.itemFunc = options.itemFunc || defaultItemFunction;
  }
  listComponent.separatorFunc = options.separatorFunc;
  listComponent.updateSuccChild = options.updateSuccChild;
  listComponent.updateSuccIndex = options.updateSuccIndex;
  listComponent.keyChildMap = keyChildMap = {};
  if (isArray(items)) {
    listComponent.getItemComponent = getItemComponent = function(item, itemIndex) {
      var itemComponent, separatorComponent;
      itemComponent = toComponent(listComponent.itemFunc(item, itemIndex, items, listComponent));
      if (listComponent.separatorFunc && itemIndex) {
        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, item, items, listComponent));
        itemComponent = new List([separatorComponent, itemComponent]);
      }
      itemComponent.itemIndex = itemIndex;
      return itemComponent;
    };
  } else {
    listComponent.getItemComponent = getItemComponent = function(key, itemIndex) {
      var itemComponent, separatorComponent, value;
      value = items[key];
      keyChildMap[key] = itemIndex;
      itemComponent = toComponent(listComponent.itemFunc(value, key, itemIndex, listComponent));
      if (listComponent.separatorFunc && itemIndex) {
        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, value, key, listComponent));
        itemComponent = new List([separatorComponent, itemComponent]);
      }
      itemComponent.$watchingKey = key;
      itemComponent.itemIndex = itemIndex;
      return itemComponent;
    };
  }
  children = [];
  if (isArray(items)) {
    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
      item = items[i];
      children.push(getItemComponent(item, i));
    }
  } else {
    i = 0;
    for (key in items) {
      children.push(getItemComponent(key, i));
      i++;
    }
  }
  return listComponent.setChildren(0, children);
};

getEachArgs = function(args) {
  var attrs, items, key, options;
  attrs = args[0], items = args[1], options = args[2];
  if (args.length === 1) {
    return [null, attrs, {}];
  } else if (args.length === 3) {
    return [attrs, items, options];
  } else {
    if (typeof items === 'function') {
      return [
        null, attrs, {
          itemFunc: items
        }
      ];
    } else if (isArray(items)) {
      return [attrs, items, {}];
    } else if (isArray(attrs)) {
      return [null, attrs, items];
    } else if (!items) {
      return [null, attrs, {}];
    } else if (!isObject(items)) {
      throw new Error('wrong parameter');
    } else {
      for (key in items) {
        if (items.hasOwnProperty(key)) {
          continue;
        } else if (key.test(/itemFunc|separatorFunc|updateSuccChild|updateSuccIndex/)) {
          return [null, attrs, items];
        }
      }
      return [attrs, items, {}];
    }
  }
};

exports.every = every = function() {
  var args, attrs, items, options, _ref3;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _ref3 = getEachArgs(args), attrs = _ref3[0], items = _ref3[1], options = _ref3[2];
  return _each(attrs, items, options);
};

exports.each = each = function() {
  var args, attrs, items, listComponent, options, _ref3;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _ref3 = getEachArgs(args), attrs = _ref3[0], items = _ref3[1], options = _ref3[2];
  listComponent = every(attrs, items, options);
  return watchItems(items, listComponent);
};

exports.funcEach = function(attrs, listFunc, options) {
  var EachClass, component, items, updateItemsCallback;
  if (typeof attrs === 'function') {
    options = listFunc;
    listFunc = attrs;
    attrs = null;
    EachClass = listFunc.EachClass;
  }
  items = listFunc();
  if (isArray(items)) {
    items = items.slice(0);
  } else {
    items = extend({}, items);
  }
  if (EachClass) {
    items.EachClass = EachClass;
  }
  component = each(attrs, items, options);
  updateItemsCallback = function() {
    var newItems;
    newItems = listFunc();
    return items.replaceAll(newItems);
  };
  if (listFunc.onInvalidate) {
    listFunc.onInvalidate(updateItemsCallback);
  } else {
    component.on('willRenderDom', function() {
      if (component.node) {
        return updateItemsCallback();
      }
    });
    component.on('didRenderDom', function() {
      return component.invalidate();
    });
  }
  return component;
};
