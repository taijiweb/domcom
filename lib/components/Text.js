var BaseComponent, Text, domField, domValue, dynamic, exports, funcString, hasTextContent, newLine, setText, value;

BaseComponent = require('./BaseComponent');

({funcString, newLine, value, dynamic} = require('dc-util'));

({domField, domValue} = require('../dom-util'));

({setText} = require('../property/attrs'));

if ('textContent' in document.documentElement) {
  hasTextContent = true;
} else {
  hasTextContent = false;
}

exports = module.exports = Text = (function() {
  class Text extends BaseComponent {
    constructor(text) {
      var get, me, set;
      super();
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
        Object.defineProperty(this, 'text', {get, set});
      }
      this.family = {};
      this.family[this.dcid] = true;
      this;
    }

    createDom() {
      var node, text;
      this.valid = true;
      text = domValue(this.text, this);
      node = document.createTextNode(text);
      node.component = this;
      this.node = node;
      this.firstNode = node;
      return node;
    }

    updateDom() {
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
    }

    clone() {
      var result;
      result = new this.constructor(this.text);
      return result.copyEventListeners(this);
    }

    toString(indent = 2, addNewLine) {
      return newLine(funcString(this.text), indent, addNewLine);
    }

  };

  Text.prototype.isText = true;

  Text.prototype.setText = setText;

  return Text;

}).call(this);
