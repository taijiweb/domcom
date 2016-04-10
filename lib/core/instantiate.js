var Case, Comment, Component, Defer, Func, Html, If, List, Nothing, Pick, Tag, Text, attrsChildren, defaultItemFunction, each, every, getEachArgs, isArray, isAttrs, isComponent, isEachObjectSystemKey, isEven, isObject, list, renew, tag, toComponent, toTagChildren, watchItems, _each, _ref, _ref1, _ref2,
  __slice = [].slice;

_ref = require('./base'), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, Html = _ref.Html, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Pick = _ref.Pick, Nothing = _ref.Nothing, Defer = _ref.Defer;

isEven = require('dc-util').isEven;

exports.isAttrs = isAttrs = function(item) {
  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
};

_ref1 = require('dc-util'), isArray = _ref1.isArray, isObject = _ref1.isObject;

_ref2 = require('dc-watch-list'), watchItems = _ref2.watchItems, isEachObjectSystemKey = _ref2.isEachObjectSystemKey;

renew = require('lazy-flow').renew;

attrsChildren = function(args) {
  var attrs;
  attrs = args[0];
  if (!args.length) {
    return [{}, []];
  } else if (attrs==null) {
    return [{}, args.slice(1)];
  } else if (attrs instanceof Array) {
    return [{}, args];
  } else if (typeof attrs === 'function') {
    return [{}, args];
  } else if (typeof attrs === 'object') {
    if (isComponent(attrs)) {
      return [{}, args];
    } else {
      return [attrs, args.slice(1)];
    }
  } else {
    return [{}, args];
  }
};

toTagChildren = function(args) {
  if (!(args instanceof Array)) {
    return [args];
  } else if (!args.length) {
    return [];
  } else if (args.length === 1) {
    return toTagChildren(args[0]);
  } else {
    return args;
  }
};

tag = exports.tag = function() {
  var args, attrs, children, tagName, _ref3;
  tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  _ref3 = attrsChildren(args), attrs = _ref3[0], children = _ref3[1];
  return new Tag(tagName, attrs, toTagChildren(children));
};

exports.nstag = function() {
  var args, attrs, children, namespace, tagName, _ref3;
  tagName = arguments[0], namespace = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  _ref3 = attrsChildren(args), attrs = _ref3[0], children = _ref3[1];
  return new Tag(tagName, attrs, toTagChildren(children), namespace);
};

exports.txt = function(attrs, text) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Text(text)]);
  } else {
    return new Text(attrs);
  }
};

exports.comment = function(attrs, text) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Comment(text)]);
  } else {
    return new Comment(attrs);
  }
};

exports.html = function(attrs, text, transform) {
  return new Html(attrs, text, transform);
};

exports.if_ = function(attrs, test, then_, else_, merge, recursive) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new If(test, then_, else_, merge, recursive)]);
  } else {
    return new If(attrs, test, then_, merge, recursive);
  }
};

exports.forceIf = function(attrs, test, then_, else_) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new If(test, then_, else_, true, false, true)]);
  } else {
    return new If(attrs, test, then_, true, false, true);
  }
};

exports.mergeIf = function(attrs, test, then_, else_, recursive) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new If(test, then_, else_, true, recursive)]);
  } else {
    return new If(attrs, test, then_, true, recursive);
  }
};

exports.recursiveIf = function(attrs, test, then_, else_) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new If(test, then_, else_, true, true)]);
  } else {
    return new If(attrs, test, then_, true, true);
  }
};

exports.case_ = function(attrs, test, map, else_) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Case(test, map, else_)]);
  } else {
    return new Case(attrs, test, map);
  }
};

exports.forceCase = function(attrs, test, map, else_) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Case(test, map, else_, true)]);
  } else {
    return new Case(attrs, test, map, true);
  }
};

exports.cond = function() {
  var attrs, condComponents, else_, _i;
  attrs = arguments[0], condComponents = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), else_ = arguments[_i++];
  if (isAttrs(attrs)) {
    if (!isEven(condComponents)) {
      condComponents.push(else_);
      else_ = null;
    }
    return new Tag('div', attrs, [new Cond(condComponents, else_)]);
  } else {
    condComponents.unshift(attrs);
    if (!isEven(condComponents)) {
      condComponents.push(else_);
      else_ = null;
    }
    return new Cond(condComponents, else_);
  }
};

exports.func = function(attrs, fn) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Func(fn)]);
  } else {
    return new Func(attrs);
  }
};

exports.pick = function(host, field, initialContent) {
  return new Pick(host, field, initialContent);
};

exports.list = list = function() {
  var attrs, lst;
  attrs = arguments[0], lst = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new List(lst)]);
  } else {
    lst.unshift(attrs);
    if (lst.length === 1) {
      return toComponent(lst[0]);
    } else {
      return new List(lst);
    }
  }
};

defaultItemFunction = function(item) {
  return item;
};

_each = function(attrs, items, options) {
  var children, getItemComponent, i, item, key, keyChildMap, listComponent, tagName, _i, _len;
  if (attrs) {
    if (attrs.tagName) {
      tagName = attrs.tagName;
      delete attrs.tagName;
    } else {
      tagName = 'div';
    }
    listComponent = new Tag(tagName, attrs, []);
  } else {
    listComponent = new List([]);
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
  children = listComponent.children;
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
  return listComponent;
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
  var items;
  if (typeof attrs === 'function') {
    options = listFunc;
    listFunc = attrs;
    attrs = null;
  }
  if (!listFunc.invalidate) {
    listFunc = renew(listFunc);
  }
  items = null;
  listFunc.onInvalidate(function() {
    return dc.once('willUpdate', function() {
      var newItems;
      newItems = listFunc();
      return items.replaceAll(newItems);
    });
  });
  items = listFunc();
  if (isArray(items)) {
    items = items.slice(0);
  } else {
    items = extend({}, items);
  }
  return each(attrs, items, options);
};

exports.defer = function(attrs, promise, fulfill, reject, init) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Defer(promise, fulfill, reject, init)]);
  } else {
    return new Defer(attrs, promise, fulfill, reject);
  }
};
