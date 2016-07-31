var BaseComponent, Text, domField, domValue, dynamic, exports, funcString, hasTextContent, newLine, setText, value, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine, value = _ref.value, dynamic = _ref.dynamic;

_ref1 = require('../../dom-util'), domField = _ref1.domField, domValue = _ref1.domValue;

setText = require('../property/attrs').setText;

if ('textContent' in document.documentElement) {
  hasTextContent = true;
} else {
  hasTextContent = false;
}

exports = module.exports = Text = (function(_super) {
  __extends(Text, _super);

  Text.prototype.isText = true;

  function Text(text) {
    var get, me, set;
    Text.__super__.constructor.call(this);
    this.setText(text);
    if (Object.defineProperty) {
      me = this;
      get = function() {
        return me._text;
      };
      set = function(text) {
        me.setText(text);
        return text;
      };
      Object.defineProperty(this, 'text', {
        get: get,
        set: set
      });
    }
    this.family = {};
    this.family[this.dcid] = true;
    this;
  }

  Text.prototype.setText = setText;

  Text.prototype.createDom = function() {
    var node, text;
    this.valid = true;
    text = domValue(this.text, this);
    node = document.createTextNode(text);
    node.component = this;
    this.node = node;
    this.firstNode = node;
    return node;
  };

  Text.prototype.updateDom = function() {
    var node, text;
    node = this.node;
    this.valid = true;
    text = domValue(this.text, this);
    if (hasTextContent) {
      if (text !== node.textContent) {
        node.textContent = text;
      }
    } else {
      if (text !== node.innerText) {
        node.innerText = text;
      }
    }
    return node;
  };

  Text.prototype.clone = function() {
    var result;
    result = new this.constructor(this.text);
    return result.copyEventListeners(this);
  };

  Text.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine(funcString(this.text), indent, addNewLine);
  };

  return Text;

})(BaseComponent);
