var Case, TestComponent, foreach, funcString, intersect, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TestComponent = require('./TestComponent');

_ref = require('dc-util'), foreach = _ref.foreach, funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

renew = require('lazy-flow').renew;

module.exports = Case = (function(_super) {
  __extends(Case, _super);

  function Case(test, map, else_, forceCase) {
    var families, family;
    this.map = map;
    if (forceCase == null) {
      forceCase = false;
    }
    if (!forceCase && typeof test !== 'function') {
      if (map.hasOwnPoperty(test)) {
        return toComponent(map[key]);
      } else {
        return toComponent(else_);
      }
    }
    foreach(map, function(value, index) {
      return map[index] = toComponent(value);
    });
    this.else_ = toComponent(else_);
    families = [];
    foreach(map, function(value) {
      return families.push(value.family);
    });
    families.push(this.else_.family);
    this.family = family = intersect(families);
    family[this.dcid] = true;
    Case.__super__.constructor.call(this, test);
  }

  Case.prototype.getContentComponent = function() {
    return this.map[this.getTestValue()] || this.else_;
  };

  Case.prototype.clone = function() {
    var cloneMap;
    cloneMap = foreach(this.map, function(value) {
      return value.clone();
    });
    return (new Case(this.test, cloneMap, this["else"].clone())).copyEventListeners(this);
  };

  Case.prototype.toString = function(indent, addNewLine) {
    var s;
    if (indent == null) {
      indent = 0;
    }
    s = newLine('', indent, addNewLine) + '<Case ' + funcString(this.test) + '>';
    foreach(this.map, function(value, index) {
      return s += newLine(index + ': ' + value.toString(indent + 2, false), indent + 2, true);
    });
    return s += this.else_.toString(indent + 2, true) + newLine('</Case>', indent, true);
  };

  return Case;

})(TestComponent);
