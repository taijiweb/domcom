var Html, HtmlMixin, ListMixin, Tag, createElement, domField, domValue, extend, funcString, method, mixin, newLine, setText, _fn, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tag = require('./Tag');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine, mixin = _ref.mixin;

_ref1 = require('../../dom-util'), domValue = _ref1.domValue, domField = _ref1.domField;

setText = require('../property/attrs').setText;

createElement = require('dc-util/element-pool').createElement;

module.exports = Html = (function(_super) {
  __extends(Html, _super);

  function Html(attrs, text, transform) {
    var tagName;
    if (typeof attrs === 'string' || typeof attrs === 'function') {
      transform = text;
      text = attrs;
      attrs = {};
    } else {
      attrs = attrs || {};
    }
    if (attrs.tagName) {
      tagName = attrs.tagName;
      delete attrs.tagName;
    } else {
      tagName = 'div';
    }
    this.initHtmlComponent(text, transform);
    Html.__super__.constructor.call(this, tagName, attrs, []);
  }

  Html.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Html " + (funcString(this._text)) + "/>", indent, addNewLine);
  };

  return Html;

})(Tag);

Html.HtmlMixin = HtmlMixin = {
  setText: setText,
  initHtmlComponent: function(text, transform) {
    var get, me, set;
    this.transform = transform;
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
      return Object.defineProperty(this, 'text', {
        get: get,
        set: set
      });
    }
  },
  initListMixin: function() {},
  attachChildren: function() {},
  createDom: function() {
    var node, text;
    this.valid = true;
    this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
    node.component = this;
    this.updateProperties();
    text = domValue(this._text, this);
    if (this.transform) {
      text = this.transform(text);
    }
    this.cacheText = node.innerHTML = text;
    return this;
  },
  updateDom: function() {
    var namespace, node, text;
    this.valid = true;
    text = domValue(this._text, this);
    if (this.transform) {
      text = this.transform(text);
    }
    node = this.node;
    namespace = this.namespace || "http://www.w3.org/1999/xhtml";
    if (this.tagName !== this.node.tagName.toLowerCase() || namespace !== this.node.namespaceURI) {
      node = this.node;
      node.parentNode && node.parentNode.removeChild(node);
      this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
      node.component = this;
      node.innerHTML = this.cacheText = text;
      this.holder.invalidateAttach(this);
      this.restoreCacheProperties();
    } else if (text !== this.cacheText) {
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
  }
};

ListMixin = require('./ListMixin');

_fn = function(method) {
  return Html.prototype[method] = function() {
    return dc.error("Html component has no children components, do not call ListMixin method(" + method + ") on it");
  };
};
for (method in ListMixin) {
  _fn(method);
}

extend = require('extend');

extend(Html.prototype, HtmlMixin);
