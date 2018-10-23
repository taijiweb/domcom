var BaseComponent, Cdata, Text, domValue, funcString, newLine;

BaseComponent = require('./BaseComponent');

Text = require('./Text');

({funcString, newLine} = require('dc-util'));

({domValue} = require('../../dom-util'));

module.exports = Cdata = class Cdata extends Text {
  constructor(text) {
    super(text);
  }

  /*
  this operation is not supported in html document
  */
  createDom() {
    this.node = document.createCDATASection(domValue(this.text, this));
    return this.node;
  }

  updateDom() {
    this.text && (this.node.data = domValue(this.text, this));
    return this.node;
  }

  toString(indent = 2, addNewLine) {
    return newLine(`<CDATA ${funcString(this.text)}/>`, indent, addNewLine);
  }

};
