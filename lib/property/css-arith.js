var Tag, reNonUnit, unitAdd, unitDiv, unitMul, unitSub;

Tag = require('../components/Tag');

reNonUnit = /[\d\s\.-]/g;

exports.unitAdd = unitAdd = function(x, y) {
  var num;
  num = parseFloat(x);
  if (isNaN(num)) {
    console.log('wrong type in unitAdd(prop, value)');
  }
  return num + parseFloat(y) + x.replace(reNonUnit, '');
};

exports.unitSub = unitSub = function(x, y) {
  var num;
  num = parseFloat(x);
  if (isNaN(num)) {
    console.log('wrong type in unitSub(prop, value)');
  }
  return num - parseFloat(y) + x.replace(reNonUnit, '');
};

exports.unitMul = unitMul = function(x, y) {
  var num;
  num = parseFloat(x);
  if (isNaN(num)) {
    console.log('wrong type in unitMul(prop, value)');
  }
  return num * parseFloat(y) + x.replace(reNonUnit, '');
};

exports.unitDiv = unitDiv = function(x, y) {
  var num;
  num = parseFloat(x);
  if (isNaN(num)) {
    console.log('wrong type in unitDiv(prop, value)');
  }
  return num / parseFloat(y) + x.replace(reNonUnit, '');
};

Tag.prototype.cssAdd = function(prop, value) {
  var v;
  v = unitAdd(this.css(prop), value);
  return this.css(prop, v);
};

Tag.prototype.cssSub = function(prop, value) {
  return this.css(prop, unitSub(this.css(prop), value));
};

Tag.prototype.cssMul = function(prop, value) {
  return this.css(prop, unitMul(this.css(prop), value));
};

Tag.prototype.cssDiv = function(prop, value) {
  return this.css(prop, unitDiv(this.css(prop), value));
};
