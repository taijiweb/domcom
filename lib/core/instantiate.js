var Case, Comment, Component, Defer, Func, Html, If, List, Nothing, Pick, Tag, Text, attrsChildren, extend, isArray, isAttrs, isComponent, isEven, isObject, list, renew, tag, toComponent, toTagChildren, _ref, _ref1,
  __slice = [].slice;

_ref = require('./base'), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, Html = _ref.Html, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Pick = _ref.Pick, Nothing = _ref.Nothing, Defer = _ref.Defer;

isEven = require('dc-util').isEven;

extend = require('extend');

exports.isAttrs = isAttrs = function(item) {
  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
};

_ref1 = require('dc-util'), isArray = _ref1.isArray, isObject = _ref1.isObject;

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

exports.defer = function(attrs, promise, fulfill, reject, init) {
  if (isAttrs(attrs)) {
    return new Tag('div', attrs, [new Defer(promise, fulfill, reject, init)]);
  } else {
    return new Defer(attrs, promise, fulfill, reject);
  }
};
