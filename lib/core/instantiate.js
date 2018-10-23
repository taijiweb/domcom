var Case, Comment, Component, Defer, Func, Html, If, List, Nothing, Pick, Tag, Text, attrsChildren, extend, isArray, isAttrs, isComponent, isEven, isObject, list, renew, tag, toComponent, toTagChildren,
  splice = [].splice;

({Component, toComponent, isComponent, Tag, Text, Comment, Html, If, Case, Func, List, Pick, Nothing, Defer} = require('./components'));

({isEven} = require('dc-util'));

extend = require('extend');

exports.isAttrs = isAttrs = function(item) {
  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
};

({isArray, isObject} = require('dc-util'));

({renew} = require('lazy-flow'));

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

tag = exports.tag = function(tagName, ...args) {
  var attrs, children;
  [attrs, children] = attrsChildren(args);
  return new Tag(tagName, attrs, toTagChildren(children));
};

exports.nstag = function(tagName, namespace, ...args) {
  var attrs, children;
  [attrs, children] = attrsChildren(args);
  return new Tag(tagName, attrs, toTagChildren(children), namespace);
};

exports.txt = function(attrs, text) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new Text(text)]);
  } else {
    return new Text(attrs);
  }
};

exports.comment = function(attrs, text) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new Comment(text)]);
  } else {
    return new Comment(attrs);
  }
};

exports.cdata = function(attrs, text) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new Cdata(text)]);
  } else {
    return new Cdata(attrs);
  }
};

// this is for Html Component, which takes some text as innerHTML
// for <html> ... </html>, please use tagHtml instead
exports.html = function(attrs, text, transform) {
  return new Html(attrs, text, transform);
};

exports.if_ = function(attrs, test, then_, else_, merge, recursive) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new If(test, then_, else_, merge, recursive)]);
  } else {
    return new If(attrs, test, then_, merge, recursive);
  }
};

exports.forceIf = function(attrs, test, then_, else_) {
  // always should NOT merge forced if
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new If(test, then_, else_, true, false, true)]);
  } else {
    return new If(attrs, test, then_, true, false, true);
  }
};

exports.mergeIf = function(attrs, test, then_, else_, recursive) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new If(test, then_, else_, true, recursive)]);
  } else {
    return new If(attrs, test, then_, true, recursive);
  }
};

exports.recursiveIf = function(attrs, test, then_, else_) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new If(test, then_, else_, true, true)]);
  } else {
    return new If(attrs, test, then_, true, true);
  }
};

exports.case_ = function(attrs, test, map, else_) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new Case(test, map, else_)]);
  } else {
    return new Case(attrs, test, map);
  }
};

exports.forceCase = function(attrs, test, map, else_) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new Case(test, map, else_, true)]);
  } else {
    return new Case(attrs, test, map, true);
  }
};

exports.cond = function(attrs, ...condComponents) {
  var else_, ref;
  ref = condComponents, [...condComponents] = ref, [else_] = splice.call(condComponents, -1);
  if (isAttrs(attrs)) {
    if (!isEven(condComponents)) {
      condComponents.push(else_);
      else_ = null;
    }
    return new Tag(null, attrs, [new Cond(condComponents, else_)]);
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
    return new Tag(null, attrs, [new Func(fn)]);
  } else {
    return new Func(attrs); // attrs become fn
  }
};


// pick can NOT wrapped with attrs
// because host must be an object!!!
exports.pick = function(host, field, initialContent) {
  return new Pick(host, field, initialContent);
};

exports.list = list = function(attrs, ...lst) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new List(lst)]);
  } else {
    lst.unshift(attrs);
    if (lst.length === 1) {
      return toComponent(lst[0]);
    } else {
      return new List(lst);
    }
  }
};

// promise is a Promise instance which have .then and .catch the two method
// fulfill: (value, promise, component) ->
// reject: (reason, promise, component) ->
// init: will be converted to component by toComponent
exports.defer = function(attrs, promise, fulfill, reject, init) {
  if (isAttrs(attrs)) {
    return new Tag(null, attrs, [new Defer(promise, fulfill, reject, init)]);
  } else {
    return new Defer(attrs, promise, fulfill, reject);
  }
};
