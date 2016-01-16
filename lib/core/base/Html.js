var Html, ListMixin, Tag, domField, domValue, funcString, method, newLine, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tag = require('./Tag');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine;

_ref1 = require('../../dom-util'), domValue = _ref1.domValue, domField = _ref1.domField;

module.exports = Html = (function(_super) {
  __extends(Html, _super);

  function Html(attrs, text, transform) {
    var me, set;
    if (typeof attrs === 'string' || typeof attrs === 'function') {
      this.transform = text;
      text = attrs;
      attrs = {};
    } else {
      attrs = attrs || {};
      this.transform = transform;
    }
    this._text = text = domField(text);
    me = this;
    if (typeof text === 'function') {
      text.onInvalidate(function() {
        me.textValid = false;
        return me.invalidate();
      });
    }
    Html.__super__.constructor.call(this, 'div', attrs, []);
    if (Object.defineProperty) {
      ({
        get: function() {
          return me._text;
        }
      });
      set = function(text) {
        me.setText(text);
        return text;
      };
      Object.defineProperty(this, 'text', {
        set: set
      });
    }
    this;
  }

  Html.prototype.createDom = function() {
    var node;
    this.textValid = true;
    this.node = this.firstNode = node = document.createElement('div');
    node.component = this;
    this.updateProperties();
    this.cacheText = node.innerHTML = this.transform && this.transform(domValue(this._text)) || domValue(this._text);
    return this;
  };

  Html.prototype.updateDom = function() {
    var node, text;
    if (this.textValid) {
      return this;
    }
    this.textValid = true;
    text = this.transform && this.transform(domValue(this._text)) || domValue(this._text);
    node = this.node;
    if (text !== this.cacheText) {
      if (node.childNodes.length >= 2) {
        if (node.parentNode) {
          this.removeNode();
        }
        this.node = this.firstNode = node = node.cloneNode(false);
        node.component = this;
      }
      node.innerHTML = text;
      this.cacheText = text;
    }
    this.updateProperties();
    return this;
  };

  Html.prototype.setText = function(text) {
    var me;
    text = domField(text);
    if (this._text === text) {
      return this;
    }
    this.textValid = false;
    this._text = text;
    me = this;
    if (typeof text === 'function') {
      text.onInvalidate(function() {
        me.textValid = false;
        return me.invalidate();
      });
    }
    this.invalidate();
    return this;
  };

  Html.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Html " + (funcString(this._text)) + "/>", indent, addNewLine);
  };

  return Html;

})(Tag);

ListMixin = require('./ListMixin');

for (method in ListMixin) {
  Html.prototype[method] = function() {
    return dc.error('Html component has no children components, do not call ListMixin method on it');
  };
}

Html.prototype.initChildren = function() {};
