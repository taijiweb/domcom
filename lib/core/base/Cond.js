var Cond, TransformComponent, funcString, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine;

renew = require('lazy-flow').renew;

module.exports = Cond = (function(_super) {
  __extends(Cond, _super);

  function Cond(testComponentPairs, else_) {
    var families, family, i, length, test;
    Cond.__super__.constructor.call(this);
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
    this.family = family = intersect(families);
    this;
  }

  Cond.prototype.getContentComponent = function() {
    var component, test, _i, _len, _ref1, _ref2;
    _ref1 = this.testComponentPairs;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      _ref2 = _ref1[_i], test = _ref2[0], component = _ref2[1];
      if (test()) {
        return component;
      }
    }
    return this.else_;
  };

  Cond.prototype.clone = function() {
    var i, length, newCondComponentList, newElse;
    newCondComponentList = this.testComponentPairs.slice();
    i = 0;
    length = newCondComponentList.length;
    while (i < length) {
      newCondComponentList[i + 1] = newCondComponentList[i + 1].clone();
      i += 2;
    }
    newElse = this.else_.clone();
    return new Cond(newCondComponentList, else_).copyEventListeners(this);
  };

  Cond.prototype.toString = function(indent, addNewLine) {
    var comp, s, test, _i, _len, _ref1;
    if (indent == null) {
      indent = 0;
    }
    s = newLine('', indent, addNewLine) + '<Cond ' + funcString(test) + '>';
    _ref1 = this.testComponentPairs;
    for (comp = _i = 0, _len = _ref1.length; _i < _len; comp = ++_i) {
      test = _ref1[comp];
      s += newLine(funcString(test) + ': ' + comp.toString(indent + 2), indent + 2);
    }
    return s += this.else_.toString(indent + 2) + newLine('</Cond>', indent, true);
  };

  Cond;

  return Cond;

})(TransformComponent);
