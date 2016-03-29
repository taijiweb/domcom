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

  function Text(text) {
    var get, me, set;
    Text.__super__.constructor.call(this);
    this.setText(text);
    this.isText = true;
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

  Text.prototype.invalidateOffspring = function(offspring) {
    var holder;
    holder = this.holder;
    if (!holder) {
      this;
    } else {
      if (holder === dc) {
        dc.invalidateOffspring(offspring);
      } else {
        if (holder.isBaseComponent) {
          holder.invalidateOffspring(offspring);
        } else {
          holder.invalidate();
        }
      }
    }
    return this;
  };

  Text.prototype.createDom = function() {
    var node, text;
    this.textValid = true;
    text = domValue(this.text, this);
    node = document.createTextNode(text);
    node.component = this;
    this.node = node;
    this.firstNode = node;
    this.cacheText = text;
    return node;
  };

  Text.prototype.refreshDom = function() {
    var node, text;
    this.valid = true;
    node = this.node;
    if (this.textValid) {
      return node;
    } else {
      this.textValid = true;
      text = domValue(this.text, this);
      if (text !== this.cacheText) {
        if (hasTextContent) {
          node.textContent = text;
        } else {
          node.innerText = text;
        }
        this.cacheText = text;
      }
      return node;
    }
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
