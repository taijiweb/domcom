var BaseComponent, Comment, Text, domValue, funcString, newLine;

BaseComponent = require('./BaseComponent');

Text = require('./Text');

({funcString, newLine} = require('dc-util'));

({domValue} = require('../../dom-util'));

module.exports = Comment = class Comment extends Text {
  constructor(text) {
    super(text);
  }

  createDom() {
    var node, text;
    this.valid = true;
    text = domValue(this.text, this);
    node = document.createComment(text);
    this.node = this.firstNode = node;
    this.cacheText = text;
    return this.node;
  }

  updateDom() {
    var node, parentNode, text;
    this.valid = true;
    text = domValue(this.text, this);
    if (text !== this.cacheText) {
      parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
      node = document.createComment(text);
      this.node = this.firstNode = node;
      this.cacheText = text;
    }
    return this.node;
  }

  toString(indent = 2, addNewLine) {
    return newLine(`<Comment ${funcString(this.text)}/>`, indent, addNewLine);
  }

};
