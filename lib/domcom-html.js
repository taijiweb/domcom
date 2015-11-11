var Comment, Html, List, Nothing, Tag, Text, TransformComponent, childrenHtml, domValue;

domValue = require("./dom-util").domValue;

List = require('./core/base/List');

Tag = require('./core/base/Tag');

Text = require('./core/base/Text');

Comment = require('./core/base/Comment');

Html = require('./core/base/Html');

Nothing = require('./core/base/Nothing');

TransformComponent = require('./core/base/TransformComponent');

TransformComponent.prototype.html = function() {
  var content;
  if (this.valid) {
    return this._html;
  }
  content = this.getContentCompnent();
  return content.html();
};

childrenHtml = function(children) {
  var child, htmlList, _i, _len;
  htmlList = [];
  for (_i = 0, _len = children.length; _i < _len; _i++) {
    child = children[_i];
    htmlList.push(child.html());
  }
  return htmlList.join("");
};

List.prototype.html = function() {
  return childrenHtml(this.children);
};

Nothing.prototype.html = function() {
  return "";
};

Text.prototype.html = function() {
  return domValue(this.text);
};

Html.prototype.html = function() {
  return this.transform && this.transform(domValue(this.text)) || domValue(this.text);
};

Commment.prototype.html = function() {
  return "<-- " + (domValue(this.text)) + " -->";
};

Tag.prototype.html = function() {
  var prop, propHtml, styleHtml, value, _i, _j, _len, _len1, _ref, _ref1;
  propHtml = [];
  _ref = this.props;
  for (value = _i = 0, _len = _ref.length; _i < _len; value = ++_i) {
    prop = _ref[value];
    propHtml.push(prop + "=" + domValue(value));
  }
  styleHtml = [];
  _ref1 = this.styles;
  for (value = _j = 0, _len1 = _ref1.length; _j < _len1; value = ++_j) {
    prop = _ref1[value];
    styleHtml.push(prop + ":" + domValue(value));
  }
  styleHtml.length && propHtml.push("{" + styleHtml.join('; ') + "}");
  if (propHtml) {
    propHtml = " " + propHtml.join(" ");
  } else {
    propHtml = "";
  }
  return ("<" + this.tagName) + properties.join(" ") + ">" + childrenHtml(this.children) + "</{@tagName}>";
};
