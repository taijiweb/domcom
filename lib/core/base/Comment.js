var BaseComponent, Comment, constructTextLikeComponent, domValue, funcString, newLine, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

constructTextLikeComponent = require('./Text').constructTextLikeComponent;

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine;

domValue = require('../../dom-util').domValue;

module.exports = Comment = (function(_super) {
  __extends(Comment, _super);

  function Comment(text) {
    Comment.__super__.constructor.call(this);
    constructTextLikeComponent.call(this, text);
  }

  Comment.prototype.createDom = function() {
    var node, text;
    this.textValid = true;
    text = domValue(this.text);
    node = document.createComment(text);
    this.setNode(node);
    this.setFirstNode(node);
    this.cacheText = text;
    return this.node;
  };

  Comment.prototype.updateDom = function() {
    var node, parentNode, text;
    if (this.textValid) {
      return this.node;
    }
    this.textValid = true;
    text = domValue(this.text);
    if (text !== this.cacheText) {
      parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
      node = document.createComment(text);
      this.setNode(node);
      this.setFirstNode(node);
      this.cacheText = text;
    }
    return this.node;
  };

  Comment.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Comment " + (funcString(this.text)) + "/>", indent, addNewLine);
  };

  return Comment;

})(BaseComponent);
