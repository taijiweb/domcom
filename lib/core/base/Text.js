var BaseComponent, Text, constructTextLikeComponent, domField, domValue, dynamic, exports, funcString, newLine, value, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine, value = _ref.value, dynamic = _ref.dynamic;

_ref1 = require('../../dom-util'), domField = _ref1.domField, domValue = _ref1.domValue;

exports = module.exports = Text = (function(_super) {
  __extends(Text, _super);

  function Text(text) {
    Text.__super__.constructor.call(this);
    constructTextLikeComponent.call(this, text);
  }

  Text.prototype.createDom = function() {
    this.textValid = true;
    this.firstNode = this.node = document.createTextNode(domValue(this.text));
    return this.node;
  };

  Text.prototype.updateDom = function() {
    var text;
    if (!this.textValid) {
      return this.node;
    }
    this.textValid = true;
    text = domValue(this.text);
    if (text !== this.cacheText) {
      if (this.node.parentNode) {
        this.removeNode();
      }
      this.node = document.createTextNode(text);
      this.firstNode = this.node;
      this.cacheText = text;
    }
    return this.node;
  };

  Text.prototype.clone = function() {
    return (new this.constructor(this.text)).copyEventListeners(this);
  };

  Text.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine(funcString(this.text), indent, addNewLine);
  };

  return Text;

})(BaseComponent);

exports.constructTextLikeComponent = constructTextLikeComponent = function(text) {
  var me;
  me = this;
  this.text = text = domField(text);
  if (typeof text === 'function') {
    text.onInvalidate(function() {
      return me.invalidate();
    });
  }
  this.family = {};
  this.family[this.dcid] = true;
  return this;
};
