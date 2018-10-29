var BaseComponent, Nothing, newLine;

BaseComponent = require('./BaseComponent');

({newLine} = require('dc-util'));

module.exports = Nothing = class Nothing extends BaseComponent {
  constructor() {
    super();
    this.firstNode = null;
    this.family = {};
    this.baseComponent = this;
  }

  invalidate() {
    return this;
  }

  renderDom(oldBaseComponent) {
    if (oldBaseComponent) {
      oldBaseComponent.markRemovingDom();
    }
    this.valid = true;
    this.node = [];
    return this;
  }

  createDom() {
    return this.node = [];
  }

  attachParent() {
    return this.node;
  }

  attachChildren() {
    return this.node;
  }

  markRemovingDom() {
    return this;
  }

  removeDom() {
    return this;
  }

  removeNode() {}

  clone() {
    return new Nothing();
  }

  toString(indent = 2, addNewLine) {
    return newLine("<Nothing/>", indent, addNewLine);
  }

};
