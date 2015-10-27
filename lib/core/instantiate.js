var Case, Comment, Component, Defer, Each, Func, Html, If, List, Tag, Text, attrsChildren, every, isAttrs, isComponent, isEven, list, numbers, tag, toComponent, toTagChildren, _ref, _ref1,
  __slice = [].slice;

_ref = require('./base'), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, Html = _ref.Html, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Each = _ref.Each, Defer = _ref.Defer;

_ref1 = require('../util'), isEven = _ref1.isEven, numbers = _ref1.numbers;

isAttrs = function(item) {
  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
};

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
  var args, attrs, children, tagName, _ref2;
  tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  _ref2 = attrsChildren(args), attrs = _ref2[0], children = _ref2[1];
  return new Tag(tagName, attrs, toTagChildren(children));
};

exports.nstag = function() {
  var args, attrs, children, namespace, tagName, _ref2;
  tagName = arguments[0], namespace = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  _ref2 = attrsChildren(args), attrs = _ref2[0], children = _ref2[1];
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
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Html(text, transform)]);
  } else {
    return new Html(attrs, text);
  }
};

exports.if_ = function(attrs, test, then_, else_) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new If(test, then_, else_)]);
  } else {
    return new If(attrs, test, then_, else_);
  }
};

exports.case_ = function(attrs, test, map, else_) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Case(test, map, else_)]);
  } else {
    return new Case(attrs, test, map, else_);
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


/**
  @param
    itemFn - function (item, index, list, component) { ... }
    itemFn - function (value, key, index, hash, component) { ... }
 */

exports.each = function(attrs, list, itemFn) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Each(list, itemFn)]);
  } else {
    return new Each(attrs, list);
  }
};

exports.every = every = function(attrs, list, itemFn) {
  var children, i, item, _i, _j, _len, _len1;
  if (isAttrs(attrs)) {
    children = [];
    for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
      item = list[i];
      children.push(itemFn(item, i, list));
    }
    return new Tag('div', attrs, [new List(children)]);
  } else {
    children = [];
    for (i = _j = 0, _len1 = attrs.length; _j < _len1; i = ++_j) {
      item = attrs[i];
      children.push(list(item, i, attrs));
    }
    return new List(children);
  }
};

exports.all = function(attrs, hash, itemFn) {
  var children, i, key, value;
  if (isAttrs(attrs)) {
    children = [];
    i = 0;
    for (key in hash) {
      value = hash[key];
      if (!hash.hasOwnProperty(key)) {
        break;
      }
      children.push(itemFn(key, value, i, hash));
      i++;
    }
    return new Tag('div', attrs, [new List(children)]);
  } else {
    children = [];
    i = 0;
    for (key in attrs) {
      value = attrs[key];
      if (!attrs.hasOwnProperty(key)) {
        break;
      }
      children.push(itemFn(key, value, i, hash));
      i++;
    }
    return new List(children);
  }
};

exports.nItems = function(attrs, n, itemFn) {
  if (isAttrs) {
    if (typeof n === 'function') {
      return new Tag('div', attrs, [new Each(numbers(n), itemFn)]);
    } else {
      return new Tag('div', every(numbers(n), itemFn));
    }
  } else {
    if (typeof atrrs === 'function') {
      return new Each(numbers(atrrs), n);
    } else {
      return every(numbers(atrrs), n);
    }
  }
};

exports.defer = function(attrs, promise, fulfill, reject, init) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Defer(promise, fulfill, reject, init)]);
  } else {
    return new Defer(attrs, promise, fulfill, reject);
  }
};

exports.clone = function(attrs, src) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [toComponent(src).clone()]);
  } else {
    return toComponent(attrs).clone(src);
  }
};
