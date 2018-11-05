var List, Tag, _each, defaultItemFunction, each, every, getEachArgs, isArray, isEachObjectSystemKey, isObject, toComponent, watchItems;

({List, Tag, toComponent} = require('./component'));

({isArray, isObject} = require('dc-util'));

({watchItems, isEachObjectSystemKey} = require('dc-watch-list'));

defaultItemFunction = function(item) {
  return item;
};

// itemFunc:
// (item, index, items, component) -> List component
// (value, key, object, component) -> List component
_each = function(attrs, items, options) {
  var EachClass, children, getItemComponent, i, item, j, key, keyChildMap, len, listComponent;
  if (attrs) {
    EachClass = attrs.EachClass || Tag;
    delete attrs.EachClass;
    listComponent = new EachClass(null, attrs, []);
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
      itemComponent = toComponent(listComponent.itemFunc(value, key, itemIndex, items, listComponent));
      if (listComponent.separatorFunc && itemIndex) {
        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, value, key, items, listComponent));
        itemComponent = new List([separatorComponent, itemComponent]);
      }
      itemComponent.$watchingKey = key;
      itemComponent.itemIndex = itemIndex;
      return itemComponent;
    };
  }
  children = [];
  if (isArray(items)) {
    for (i = j = 0, len = items.length; j < len; i = ++j) {
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
  [attrs, items, options] = args;
  if (args.length === 1) {
    return [null, attrs, {}];
  } else if (args.length === 3) {
    return [attrs, items, options];
  } else {
    if (typeof items === 'function') {
      return [
        null,
        attrs,
        {
          itemFunc: items
        }
      ];
    } else if (isArray(items)) {
      return [attrs, items, {}];
    } else if (isArray(attrs)) {
      return [null, attrs, items];
    } else if (!items) {
      // options = items; items = attrs
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

exports.every = every = function(...args) {
  var attrs, items, options;
  [attrs, items, options] = getEachArgs(args);
  return _each(attrs, items, options);
};

exports.each = each = function(...args) {
  var attrs, items, listComponent, options;
  [attrs, items, options] = getEachArgs(args);
  listComponent = every(attrs, items, options);
  return watchItems(items, listComponent);
};

exports.funcEach = function(attrs, itemsFunc, options) {
  var EachClass, component, items, updateItemsCallback;
  if (typeof attrs === 'function') {
    options = itemsFunc;
    itemsFunc = attrs;
    attrs = null;
    EachClass = itemsFunc.EachClass;
  }
  items = itemsFunc();
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
    newItems = itemsFunc();
    return items.replaceAll(newItems);
  };
  if (itemsFunc.onInvalidate) {
    itemsFunc.onInvalidate(updateItemsCallback);
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
