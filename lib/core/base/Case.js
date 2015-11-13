var Case, TransformComponent, funcString, intersect, newLine, renew, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

renew = require('lazy-flow').renew;

module.exports = Case = (function(_super) {
  __extends(Case, _super);

  function Case(test, map, else_) {
    var families, family, key, value, _;
    this.map = map;
    if (typeof test !== 'function') {
      if (map.hasOwnPoperty(test)) {
        return toComponent(map[key]);
      } else {
        return toComponent(else_);
      }
    }
    Case.__super__.constructor.call(this);
    if (!test.invalidate) {
      this.test = renew(test);
    } else {
      this.test = test;
    }
    this.test.onInvalidate(this.invalidateTransform.bind(this));
    for (key in map) {
      value = map[key];
      map[key] = toComponent(value);
    }
    this.else_ = toComponent(else_);
    families = (function() {
      var _ref1, _results;
      _ref1 = this.map;
      _results = [];
      for (_ in _ref1) {
        value = _ref1[_];
        _results.push(value.family);
      }
      return _results;
    }).call(this);
    families.push(this.else_.family);
    this.family = family = intersect(families);
    family[this.dcid] = true;
  }

  Case.prototype.getContentComponent = function() {
    return this.map[this.test()] || this.else_;
  };

  Case.prototype.clone = function() {
    var cloneMap, key, value, _ref1;
    cloneMap = {};
    _ref1 = this.map;
    for (key in _ref1) {
      value = _ref1[key];
      cloneMap[key] = value.clone();
    }
    return (new Case(this.test, cloneMap, this["else"].clone())).copyEventListeners(this);
  };

  Case.prototype.toString = function(indent, addNewLine) {
    var comp, key, s, _ref1;
    if (indent == null) {
      indent = 0;
    }
    s = newLine('', indent, addNewLine) + '<Case ' + funcString(this.test) + '>';
    _ref1 = this.map;
    for (key in _ref1) {
      comp = _ref1[key];
      s += newLine(key + ': ' + comp.toString(indent + 2, false), indent + 2, true);
    }
    return s += this.else_.toString(indent + 2, true) + newLine('</Case>', indent, true);
  };

  return Case;

})(TransformComponent);
