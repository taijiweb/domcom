var Defer, FULFILL, INIT, REJECT, TransformComponent, extend, funcString, intersect, newLine, renew, toComponent;

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

extend = require('extend');

({funcString, newLine, intersect} = require('dc-util'));

({renew} = require('lazy-flow'));

INIT = 0;

FULFILL = 1;

REJECT = 2;

module.exports = Defer = class Defer extends TransformComponent {
  constructor(promise1, fulfill, reject, init) {
    var family, treject;
    super();
    this.promise = promise1;
    this.fulfill = fulfill || function(result) {
      return result;
    };
    treject = reject || function(error) {
      return error;
    };
    this.init = init && init(promise, this) || new Nothing();
    this.family = family = intersect([fullfill.family, reject.family, init.family]);
    family[this.dcid] = true;
    this.promiseState = INIT;
    promise.then(function(value) {
      this.promiseResult = value;
      this.promiseState = FULFILL;
      return this.invalidateTransform();
    }).catch(function(error) {
      this.promiseResult = error;
      this.promiseState = REJECT;
      return this.invalidateTransform();
    });
    return this;
  }

  getContentComponent() {
    var state;
    if ((state = this.promiseState) === INIT) {
      return init;
    } else if (state === FULFILL) {
      return toComponent(this.fulfill(this.promiseResult, this.promise, this));
    } else {
      return toComponent(this.reject(this.promiseResult, this.promise, this));
    }
  }

  clone() {
    return (new Defer(this.promise, this.fulfill, this.reject, this.init.clone)).copyEventListeners(this);
  }

  toString(indent = 0, addNewLine = '') {
    return newLine('', indent, addNewLine) + '<Defer ' + this.promise + '>' + newLine('', indent, addNewLine) + funcString(this.fulfill) + newLine('', indent, addNewLine) + funcString(this.reject) + this.init.toString(indent + 2, true) + newLine('</Defer>', indent, true);
  }

};

extend(Defer, {INIT, FULFILL, REJECT});
