var Comment, Func, Html, Text, if_, isComponent, mergeThenElseValue, toComponent, _ref;

_ref = require('./base'), isComponent = _ref.isComponent, toComponent = _ref.toComponent;

Func = require("./base/Func");

Text = require("./base/Text");

Html = require("./base/Html");

Comment = require("./base/Comment");

if_ = require("../flow/addon").if_;

exports.isAttrs = function(item) {
  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
};

mergeThenElseValue = function(test, thenValue, elseValue) {
  return if_(test, thenValue, elseValue);
};

exports._maybeIf = function(test, then_, else_) {
  var attrs, elseAttrs, key, thenAttrs;
  then_ = toComponent(then_);
  else_ = toComponent(else_);
  if (then_ === else_) {
    return then_;
  }
  if (then_ instanceof Nothing && else_ instanceof Nothing) {
    return then_;
  }
  if (typeof test === 'function') {
    if (then_.isTag && else_.isTag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
      attrs = {};
      thenAttrs = then_.attrs;
      elseAttrs = else_.attrs;
      for (key in bothKeys(thenAttrs, elseAttrs)) {
        attrs[key] = mergeThenElseValue(test, thenAttrs[key], elseAttrs[key]);
      }
      attrs.namespace = then_.namespace;
      return new Tag(then_.tagName, attrs, children);
    } else if (then_ instanceof Text && else_ instanceof Text) {
      return new Text(mergeThenElseValue(test, then_.text, else_.text));
    } else if (then_ instanceof Comment && else_ instanceof Comment) {
      return new Comment(mergeThenElseValue(test, then_.text, else_.text));
    } else if (then_ instanceof Html && else_ instanceof Html) {
      return new Html(mergeThenElseValue(test, then_.text, else_.text));
    } else if (then_ instanceof Func && else_ instanceof Func) {
      return new Func(flow.if_(test, then_.func, else_.func));
    } else {
      return new If(test, then_, else_);
    }
  } else if (test) {
    return then_;
  } else {
    return else_;
  }
};
