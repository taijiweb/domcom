var BaseComponent, Html, Text, domValue, funcString, newLine, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

Text = require('./Text');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine;

domValue = require('../../dom-util').domValue;

module.exports = Html = (function(_super) {
  __extends(Html, _super);

  function Html(text, transform) {
    this.transform = transform;
    this.isHtml = true;
    Html.__super__.constructor.call(this, text);
  }

  Html.prototype.createDom = function() {
    var childNodes, i, n, node, text, _i, _len;
    this.textValid = true;
    childNodes = document.createElement('div');
    text = this.transform && this.transform(domValue(this.text)) || domValue(this.text);
    childNodes.innerHTML = text;
    this.cacheText = text;
    childNodes = childNodes.childNodes;
    this.node = node = [];
    node.length = childNodes.length;
    for (i = _i = 0, _len = childNodes.length; _i < _len; i = ++_i) {
      n = childNodes[i];
      n.component = this;
      node[i] = n;
    }
    this.firstNode = node[0];
    return this;
  };

  Html.prototype.updateDom = function() {
    var childNodes, i, n, node, text, _i, _len;
    if (this.textValid) {
      return this;
    }
    this.textValid = true;
    text = this.transform && this.transform(domValue(this.text)) || domValue(this.text);
    if (text !== this.cacheText) {
      if (this.node.parentNode) {
        this.removeNode();
      }
      childNodes = document.createElement('DIV');
      childNodes.innerHTML = text;
      node = this.node;
      childNodes = childNodes.childNodes;
      node.length = childNodes.length;
      for (i = _i = 0, _len = childNodes.length; _i < _len; i = ++_i) {
        n = childNodes[i];
        node[i] = n;
        n.component = this;
      }
      this.firstNode = node[0];
      this.cacheText = text;
    }
    return this;
  };

  Html.prototype.attachNode = function() {
    var childNode, e, nextNode, node, parentNode, _i, _len;
    node = this.node, parentNode = this.parentNode, nextNode = this.nextNode;
    if (parentNode === node.parentNode && nextNode === node.nextNode) {
      return node;
    } else {
      node.parentNode = parentNode;
      node.nextNode = nextNode;
      for (_i = 0, _len = node.length; _i < _len; _i++) {
        childNode = node[_i];
        try {
          parentNode.insertBefore(childNode, this.nextNode);
        } catch (_error) {
          e = _error;
          dc.error(e);
        }
      }
      return node;
    }
  };

  Html.prototype.removeNode = function() {
    var childNode, node, parentNode, _i, _len;
    node = this.node;
    parentNode = node.parentNode;
    node.parentNode = null;
    for (_i = 0, _len = node.length; _i < _len; _i++) {
      childNode = node[_i];
      parentNode.removeChild(childNode);
      delete childNode.component;
    }
  };

  Html.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Html " + (funcString(this.text)) + "/>", indent, addNewLine);
  };

  return Html;

})(Text);
