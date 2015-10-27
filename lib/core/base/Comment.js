var Comment, funcString, newLine, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = require('../../util'), funcString = _ref.funcString, newLine = _ref.newLine;

module.exports = Comment = (function(_super) {
  __extends(Comment, _super);

  function Comment() {
    return Comment.__super__.constructor.apply(this, arguments);
  }

  Comment.prototype.createDom = function(parentNode, nextNode) {
    this.node = document.createComment(this.processText());
    return this.node;
  };

  Comment.prototype.updateDom = function(parentNode, nextNode) {
    this.text && (this.node.data = this.processText());
    return this.node;
  };

  Comment.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<Comment " + (funcString(this.text)) + "/>", indent, addNewLine);
  };

  return Comment;

})(Text);
