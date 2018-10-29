var Case, TestComponent, foreach, funcString, intersect, newLine, renew, toComponent;

toComponent = require('./toComponent');

TestComponent = require('./TestComponent');

({foreach, funcString, newLine, intersect} = require('dc-util'));

({renew} = require('lazy-flow'));

module.exports = Case = class Case extends TestComponent {
  constructor(test, map1, else_, forceCase = false) {
    var families, family;
    if (!forceCase && typeof test !== 'function') {
      if (map.hasOwnPoperty(test)) {
        return toComponent(map[key]);
      } else {
        return toComponent(else_);
      }
    }
    super(test);
    this.map = map1;
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
  }

  getContentComponent() {
    return this.map[this.getTestValue()] || this.else_;
  }

  clone() {
    var cloneMap;
    cloneMap = foreach(this.map, function(value) {
      return value.clone();
    });
    return (new Case(this.test, cloneMap, this.else_.clone())).copyEventListeners(this);
  }

  toString(indent = 0, addNewLine) {
    var s;
    s = newLine('', indent, addNewLine) + '<Case ' + funcString(this.test) + '>';
    foreach(this.map, function(value, index) {
      return s += newLine(index + ': ' + value.toString(indent + 2, false), indent + 2, true);
    });
    return s += this.else_.toString(indent + 2, true) + newLine('</Case>', indent, true);
  }

};
