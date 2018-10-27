var ObjectDefineProperty, TestComponent, TransformComponent, funcString, intersect, newLine, renew;

TransformComponent = require('./TransformComponent');

({funcString, newLine, intersect} = require('dc-util'));

({renew} = require('lazy-flow'));

ObjectDefineProperty = Object.defineProperty;

module.exports = TestComponent = class TestComponent extends TransformComponent {
  constructor(test) {
    var get, me, set;
    super();
    this.__cacheTest = null;
    me = this;
    this.invalidateHandler = function() {
      return me.invalidateTransform();
    };
    if (ObjectDefineProperty) {
      get = function() {
        return me._test;
      };
      set = function(test) {
        me.setTest(test);
        return test;
      };
      ObjectDefineProperty(this, 'test', {get, set});
    }
    this.setTest(test);
    this;
  }

  getTestValue() {
    var test;
    test = this.test;
    if (typeof test === 'function') {
      return this.__cacheTest = test.call(this);
    } else {
      return this.__cacheTest = test;
    }
  }

  setTest(test) {
    var oldTest, testField;
    oldTest = this.test;
    if (test === oldTest) {
      return test;
    } else {
      if (typeof oldTest === 'function') {
        if (test === this.__originalTest) {
          return test;
        }
        this.__originalTest.offInvalidate(this.invalidateHandler);
      }
      if (ObjectDefineProperty) {
        testField = '_test';
      } else {
        testField = 'test';
      }
      if (typeof test === 'function') {
        this.__originalTest = test;
        if (!test.invalidate) {
          test = renew(test);
        }
        test.onInvalidate(this.invalidateHandler);
      }
      if (this.__cacheTest !== test) {
        this.invalidateTransform();
      }
      return this[testField] = test;
    }
  }

};
