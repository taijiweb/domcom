var If, TransformComponent, funcString, intersect, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

_ref = require('../../util'), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

renew = require('../../flow').renew;

module.exports = If = (function(_super) {
  __extends(If, _super);

  function If(test, then_, else_) {
    var family;
    if (then_ === else_) {
      return toComponent(then_);
    }
    then_ = toComponent(then_);
    else_ = toComponent(else_);
    if (typeof test !== 'function') {
      if (test) {
        return then_;
      } else {
        return else_;
      }
    }
    If.__super__.constructor.call(this);
    this.then_ = then_;
    this.else_ = else_;
    this.family = family = intersect([then_.family, else_.family]);
    family[this.dcid] = true;
    if (!test.invalidate) {
      this.test = renew(test);
    } else {
      this.test = test;
    }
    this.test.onInvalidate(this.invalidateTransform.bind(this));
    this;
  }

  If.prototype.getContentComponent = function() {
    if (this.test()) {
      return this.then_;
    } else {
      return this.else_;
    }
  };

  If.prototype.clone = function() {
    return (new If(this.test, this.then_.clone(), this.else_.clone())).copyEventListeners(this);
  };

  If.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 0;
    }
    if (addNewLine == null) {
      addNewLine = '';
    }
    return newLine('', indent, addNewLine) + '<if ' + funcString(this.test) + '>' + this.then_.toString(indent + 2, true) + this.else_.toString(indent + 2, true) + newLine('</if>', indent, true);
  };

  return If;

})(TransformComponent);
