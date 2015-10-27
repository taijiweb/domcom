var Cond, TransformComponent, funcString, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

_ref = require('../../util'), funcString = _ref.funcString, newLine = _ref.newLine;

renew = require('../../flow').renew;

module.exports = Cond = (function(_super) {
  __extends(Cond, _super);

  function Cond(condComponentList, else_) {
    var families, family, i, length, test;
    Cond.__super__.constructor.call(this);
    i = 0;
    length = condComponentList.length;
    while (i < length) {
      test = condComponentList[i];
      if (!test.invalidate) {
        test = renew(test);
      }
      test.onInvalidate(this.invalidateTransform.bind(this));
      condComponentList[i] = test;
      condComponentList[i + 1] = toComponent(condComponentList[i + 1]);
      i += 2;
    }
    else_ = toComponent(else_);
    i = 1;
    families = [];
    while (i < length) {
      families.push(condComponentList[i].family);
      i += 2;
    }
    families.push(else_.family);
    this.family = family = intersect(families);
    this.getContentComponent = function() {
      var component, _i, _len, _ref1;
      for (_i = 0, _len = condComponentList.length; _i < _len; _i++) {
        _ref1 = condComponentList[_i], test = _ref1[0], component = _ref1[1];
        if (test()) {
          return component;
        }
      }
      return else_;
    };
    this.clone = function() {
      var newCondComponentList, newElse;
      newCondComponentList = condComponentList.slice();
      i = 0;
      length = newCondComponentList.length;
      while (i < length) {
        newCondComponentList[i + 1] = newCondComponentList[i + 1].clone();
        i += 2;
      }
      newElse = else_.clone();
      return new Cond(newCondComponentList, else_).copyEventListeners(this);
    };
    this.toString = function(indent, addNewLine) {
      var comp, s, _i, _len;
      if (indent == null) {
        indent = 0;
      }
      s = newLine('', indent, addNewLine) + '<Cond ' + funcString(test) + '>';
      for (comp = _i = 0, _len = condComponentList.length; _i < _len; comp = ++_i) {
        test = condComponentList[comp];
        s += newLine(funcString(test) + ': ' + comp.toString(indent + 2), indent + 2);
      }
      return s += else_.toString(indent + 2) + newLine('</Cond>', indent, true);
    };
    this;
  }

  return Cond;

})(TransformComponent);
