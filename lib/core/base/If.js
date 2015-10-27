var If, TransformComponent, funcString, intersect, maybeIf, mergeThenElseValue, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

_ref = require('../../util'), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

renew = require('../../flow').renew;

mergeThenElseValue = function(test, thenValue, elseValue) {
  if (typeof thenValue === 'function') {
    if (typeof elseValue === 'function') {
      return function() {
        if (test()) {
          return thenValue();
        } else {
          return elseValue();
        }
      };
    } else {
      return function() {
        if (test()) {
          return thenValue();
        } else {
          return elseValue;
        }
      };
    }
  } else {
    if (typeof elseValue === 'function') {
      return function() {
        if (test()) {
          return thenValue;
        } else {
          return elseValue();
        }
      };
    } else {
      return function() {
        if (test()) {
          return thenValue;
        } else {
          return elseValue;
        }
      };
    }
  }
};

maybeIf = function(test, then_, else_) {
  var attrs, elseAttrs, key, thenAttrs;
  if (then_ === else_) {
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
    } else if (then_.type === 'Text' && else_.type === 'Text') {
      return new Text(mergeThenElseValue(test, then_.text, else_.text));
    } else if (then_.type === 'Comment' && else_.type === 'Comment') {
      return new Comment(mergeThenElseValue(test, then_.text, else_.text));
    } else if (then_.type === 'Html' && else_.type === 'Html') {
      return new Html(mergeThenElseValue(test, then_.text, else_.text));
    }
  } else if (test) {
    return then_;
  } else {
    return else_;
  }
};

module.exports = If = (function(_super) {
  __extends(If, _super);

  function If(test, then_, else_) {
    var family;
    then_ = toComponent(then_);
    else_ = toComponent(else_);
    if (typeof test !== 'function') {
      if (test) {
        return then_;
      } else {
        return else_;
      }
    } else if (then_ === else_) {
      return then_;
    }
    If.__super__.constructor.call(this);
    this.family = family = intersect([then_.family, else_.family]);
    family[this.dcid] = true;
    if (!test.invalidate) {
      test = renew(test);
    }
    test.onInvalidate(this.invalidateTransform.bind(this));
    this.getContentComponent = function() {
      if (test()) {
        return then_;
      } else {
        return else_;
      }
    };
    this.clone = function() {
      return (new If(test, then_.clone(), else_clone())).copyEventListeners(this);
    };
    this.toString = function(indent, addNewLine) {
      if (indent == null) {
        indent = 0;
      }
      if (addNewLine == null) {
        addNewLine = '';
      }
      return newLine('', indent, addNewLine) + '<if ' + funcString(test) + '>' + then_.toString(indent + 2, true) + else_.toString(indent + 2, true) + newLine('</if>', indent, true);
    };
    this;
  }

  return If;

})(TransformComponent);
