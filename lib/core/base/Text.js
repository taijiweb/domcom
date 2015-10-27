var BaseComponent, Text, domValue, dynamic, funcString, newLine, value, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

_ref = require('../../util'), funcString = _ref.funcString, newLine = _ref.newLine, value = _ref.value, dynamic = _ref.dynamic;

domValue = require('../../dom-util').domValue;

module.exports = Text = (function(_super) {
  __extends(Text, _super);

  function Text(text) {
    var me;
    Text.__super__.constructor.call(this);
    me = this;
    this.text = text = domValue(text);
    if (typeof text === 'function') {
      text.onInvalidate(function() {
        return me.invalidate();
      });
    }
    this.family = {};
    this.family[this.dcid] = true;
    this;
  }

  Text.prototype.processText = function() {
    if (typeof this.text === 'function') {
      return domValue(this.text());
    } else {
      return this.text;
    }
  };

  Text.prototype.createDom = function() {
    this.textValid = true;
    this.firstNode = this.node = document.createTextNode(this.processText());
    return this.node;
  };

  Text.prototype.updateDom = function() {
    var text;
    if (!this.textValid) {
      return this.node;
    }
    this.textValid = true;
    if ((text = this.processText()) !== this.node.textContent) {
      this.node.textContent = text;
    }
    return this.node;
  };

  Text.prototype.removeDom = function() {
    this.removeNode();
    this.emit('afterRemoveDom');
    return this;
  };

  Text.prototype.attachNode = function() {
    var node;
    node = this.node;
    if (this.parentNode === node.parentNode) {
      return node;
    }
    this.parentNode.insertBefore(node, this.nextNode);
    return node;
  };

  Text.prototype.removeNode = function() {
    return this.node.parentNode.removeChild(this.node);
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
