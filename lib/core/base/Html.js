var BaseComponent, Html, constructTextLikeComponent, domValue, funcString, newLine, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

constructTextLikeComponent = require('./Text').constructTextLikeComponent;

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine;

domValue = require('../../dom-util').domValue;


/*
  https://github.com/ajaxorg/ace/blob/master/lib/ace/lib/dom.js
  /*
 * Optimized set innerHTML. This is faster than plain innerHTML if the element
 * already contains a lot of child elements.
 *
 * See http://blog.stevenlevithan.com/archives/faster-than-innerhtml for details
 *-/
exports.setInnerHtml = function(el, innerHtml) {
    var element = el.cloneNode(false);//document.createElement("div");
    element.innerHTML = innerHtml;
    el.parentNode.replaceChild(element, el);
    return element;
};
 */

module.exports = Html = (function(_super) {
  __extends(Html, _super);

  function Html(text, transform) {
    this.transform = transform;
    Html.__super__.constructor.call(this);
    constructTextLikeComponent.call(this, text);
  }

  Html.prototype.createDom = function() {
    var node, text;
    this.textValid = true;
    node = document.createElement('DIV');
    text = this.transform && this.transform(domValue(this.text)) || domValue(this.text);
    node.innerHTML = text;
    this.cacheText = text;
    this.node = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = node.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        _results.push(node);
      }
      return _results;
    })();
    this.firstNode = this.node[0];
    return this;
  };

  Html.prototype.updateDom = function() {
    var n, node, text;
    if (this.textValid) {
      return this;
    }
    this.textValid = true;
    text = this.transform && this.transform(domValue(this.text)) || domValue(this.text);
    if (text !== this.cacheText) {
      if (this.node.parentNode) {
        this.removeNode();
      }
      node = document.createElement('DIV');
      node.innerHTML = text;
      node = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = node.childNodes;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          n = _ref1[_i];
          _results.push(n);
        }
        return _results;
      })();
      this.setNode(node);
      this.setFirstNode = node[0];
      this.cacheText = text;
    }
    return this;
  };

  Html.prototype.attachNode = function() {
    var childNode, nextNode, node, parentNode, _i, _len;
    node = this.node, parentNode = this.parentNode, nextNode = this.nextNode;
    if (parentNode === node.parentNode && nextNode === node.nextNode) {
      return node;
    } else {
      node.parentNode = parentNode;
      node.nextNode = nextNode;
      for (_i = 0, _len = node.length; _i < _len; _i++) {
        childNode = node[_i];
        parentNode.insertBefore(childNode, this.nextNode);
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
    }
  };

  Html.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Html " + (funcString(this.text)) + "/>", indent, addNewLine);
  };

  return Html;

})(BaseComponent);
