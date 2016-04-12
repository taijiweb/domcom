var BaseComponent, Nothing, newLine,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

newLine = require('dc-util').newLine;

module.exports = Nothing = (function(_super) {
  __extends(Nothing, _super);

  function Nothing() {
    Nothing.__super__.constructor.apply(this, arguments);
    this.firstNode = null;
    this.family = {};
    this.baseComponent = this;
  }

  Nothing.prototype.invalidate = function() {
    return this;
  };

  Nothing.prototype.renderDom = function(oldBaseComponent) {
    if (oldBaseComponent && oldBaseComponent !== this) {
      oldBaseComponent.markRemovingDom(true);
    }
    this.valid = true;
    if (!this.node) {
      this.node = [];
    }
    this.attachNode();
    return this;
  };

  Nothing.prototype.createDom = function() {
    return this.node = [];
  };

  Nothing.prototype.attachNode = function() {
    return this.node;
  };

  Nothing.prototype.markRemovingDom = function(removing) {
    if (removing) {
      this.holder = null;
    }
    this.removing = removing;
    return this;
  };

  Nothing.prototype.removeDom = function() {
    return this;
  };

  Nothing.prototype.clone = function() {
    return new Nothing();
  };

  Nothing.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Nothing/>", indent, addNewLine);
  };

  return Nothing;

})(BaseComponent);
