var Func, TransformComponent, funcString, newLine, renew, toComponent;

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

({funcString, newLine} = require('dc-util'));

({renew} = require('lazy-flow'));

module.exports = Func = class Func extends TransformComponent {
  constructor(func) {
    var me;
    super();
    if (!func.invalidate) {
      this.func = renew(func);
    } else {
      this.func = func;
    }
    me = this;
    this.func.onInvalidate(function() {
      return me.invalidateTransform();
    });
    this;
  }

  getContentComponent() {
    return toComponent(this.func());
  }

  clone() {
    return (new Func(this.func)).copyEventListeners(this);
  }

  toString(indent = 2, addNewLine) {
    return newLine(`<Func ${funcString(this.func)}/>`, indent, addNewLine);
  }

};
