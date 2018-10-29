var Html, HtmlMixin, ListMixin, Tag, createElement, domField, domValue, extend, funcString, method, mixin, newLine, setText;

Tag = require('./Tag');

({funcString, newLine, mixin} = require('dc-util'));

({domValue, domField} = require('../dom-util'));

({setText} = require('../property/attrs'));

({createElement} = require('dc-util/element-pool'));

// !!! Warning:
// By default, Html does not escape to safe the html.
// So it's UNSAFE to use Html class without a transform function!!!
// It's the responsibility of user program to keep it in safe!
// Maybe a npm package like escape-html will help.

// this is Html Component, which take some text as innerHTML
// for <html> ... </html>, please use tagHtml instead
module.exports = Html = class Html extends Tag {
  constructor(attrs, text, transform) {
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
    super(tagName, attrs, []);
    this.initHtmlComponent(text, transform);
  }

  toString(indent = 2, addNewLine) {
    return newLine(`<Html ${funcString(this._text)}/>`, indent, addNewLine);
  }

};

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
      return Object.defineProperty(this, 'text', {get, set});
    }
  },
  // initListMixin is called by the constructor of Tag class
  // so put an empty definition here
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
    // this should be done after this.node is processed
    // because may be cloneNode
    this.updateProperties();
    return this;
  }
};

ListMixin = require('./ListMixin');

for (method in ListMixin) {
  (function(method) {
    return Html.prototype[method] = function() {
      return dc.error(`Html component has no children components, do not call ListMixin method(${method}) on it`);
    };
  })(method);
}

extend = require('extend');

extend(Html.prototype, HtmlMixin);
