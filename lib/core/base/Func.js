var Func, TransformComponent, funcString, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

_ref = require('../../util'), funcString = _ref.funcString, newLine = _ref.newLine;

renew = require('../../flow').renew;

module.exports = Func = (function(_super) {
  __extends(Func, _super);

  function Func(func) {
    Func.__super__.constructor.call(this);
    if (!func.invalidate) {
      func = renew(func);
    }
    func.onInvalidate(this.invalidateTransform.bind(this));
    this.getContentComponent = function() {
      return toComponent(func());
    };
    this.clone = function() {
      return (new Func((function() {
        return toComponent(func()).clone();
      }))).copyEventListeners(this);
    };
    this.toString = function(indent, addNewLine) {
      if (indent == null) {
        indent = 2;
      }
      return newLine("<Func " + (funcString(func)) + "/>", indent, addNewLine);
    };
    this;
  }

  return Func;

})(TransformComponent);
