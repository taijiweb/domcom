var BaseComponent, Cdata, constructTextLikeComponent, domValue, funcString, newLine, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

constructTextLikeComponent = require('./Text').constructTextLikeComponent;

_ref = require('dc-util'), funcString = _ref.funcString, newLine = _ref.newLine;

domValue = require('../../dom-util').domValue;

module.exports = Cdata = (function(_super) {
  __extends(Cdata, _super);

  function Cdata(text) {
    Cdata.__super__.constructor.call(this);
    constructTextLikeComponent.call(this, text);
  }


  /*
    this operation is not supported in html document
   */

  Cdata.prototype.createDom = function(parentNode, nextNode) {
    this.node = document.createCDATASection(domValue(this.text));
    return this.node;
  };

  Cdata.prototype.updateDom = function(parentNode, nextNode) {
    this.text && (this.node.data = domValue(this.text));
    return this.node;
  };

  Cdata.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 2;
    }
    return newLine("<CDATA " + (funcString(this.text)) + "/>", indent, addNewLine);
  };

  return Cdata;

})(BaseComponent);
