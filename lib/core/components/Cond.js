var Cond, TransformComponent, funcString, newLine, renew, toComponent;

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

({funcString, newLine} = require('dc-util'));

({renew} = require('lazy-flow'));

module.exports = Cond = (function() {
  class Cond extends TransformComponent {
    constructor(testComponentPairs, else_) {
      var families, i, length, test;
      super();
      i = 0;
      length = testComponentPairs.length;
      while (i < length) {
        test = testComponentPairs[i];
        if (!test.invalidate) {
          test = renew(test);
        }
        test.onInvalidate(this.invalidateTransform.bind(this));
        testComponentPairs[i] = test;
        testComponentPairs[i + 1] = toComponent(testComponentPairs[i + 1]);
        i += 2;
      }
      else_ = toComponent(else_);
      i = 1;
      families = [];
      while (i < length) {
        families.push(testComponentPairs[i].family);
        i += 2;
      }
      families.push(else_.family);
      this.family = intersect(families);
      this;
    }

    getContentComponent() {
      var component, j, len, ref, test;
      ref = this.testComponentPairs;
      for (j = 0, len = ref.length; j < len; j++) {
        [test, component] = ref[j];
        if (test()) {
          return component;
        }
      }
      return this.else_;
    }

    clone() {
      var i, length, newCondComponentList;
      newCondComponentList = this.testComponentPairs.slice();
      i = 0;
      length = newCondComponentList.length;
      while (i < length) {
        newCondComponentList[i + 1] = newCondComponentList[i + 1].clone();
        i += 2;
      }
      return new Cond(newCondComponentList, this.else_.clone()).copyEventListeners(this);
    }

    toString(indent = 0, addNewLine) {
      var comp, j, len, ref, s, test;
      s = newLine('', indent, addNewLine) + '<Cond ' + funcString(test) + '>';
      ref = this.testComponentPairs;
      for (comp = j = 0, len = ref.length; j < len; comp = ++j) {
        test = ref[comp];
        s += newLine(funcString(test) + ': ' + comp.toString(indent + 2), indent + 2);
      }
      return s += this.else_.toString(indent + 2) + newLine('</Cond>', indent, true);
    }

  };

  Cond;

  return Cond;

}).call(this);
