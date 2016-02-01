var ObjectDefineProperty, TestComponent, TransformComponent, funcString, intersect, newLine, renew, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TransformComponent = require('./TransformComponent');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

renew = require('lazy-flow').renew;

ObjectDefineProperty = Object.defineProperty;

module.exports = TestComponent = (function(_super) {
  __extends(TestComponent, _super);

  function TestComponent(test) {
    var get, set;
    TestComponent.__super__.constructor.apply(this, arguments);
    this.__cacheTest = null;
    this.transformValid = false;
    this.invalidateHandler = (function(_this) {
      return function() {
        return _this.invalidateTransform();
      };
    })(this);
    if (ObjectDefineProperty) {
      get = (function(_this) {
        return function() {
          return _this._test;
        };
      })(this);
      set = (function(_this) {
        return function(test) {
          _this.setTest(test);
          return test;
        };
      })(this);
      ObjectDefineProperty(this, 'test', {
        get: get,
        set: set
      });
    }
    this.setTest(test);
    this;
  }

  TestComponent.prototype.getTestValue = function() {
    var test;
    test = this.test;
    if (typeof test === 'function') {
      return this.__cacheTest = test.call(this);
    } else {
      return this.__cacheTest = test;
    }
  };

  TestComponent.prototype.setTest = function(test) {
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
  };

  return TestComponent;

})(TransformComponent);
