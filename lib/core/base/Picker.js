var Picker, TransformComponent, extend, newLine, setContent, toComponent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

newLine = require('dc-util').newLine;

extend = require('extend');

module.exports = Picker = (function(_super) {
  __extends(Picker, _super);

  function Picker(content, field) {
    var family, get, set;
    Picker.__super__.constructor.call(this);
    this._content = content = toComponent(content);
    this.family = family = extend({}, content.family);
    family[this.dcid] = true;
    if (field == null) {
      this.field = field = 'content';
    } else {
      this.field = field;
    }
    if (Object.defineProperty) {
      get = function() {
        return this._content;
      };
      set = function(content) {
        return setContent(this, content);
      };
      Object.defineProperty(this, field, {
        get: get,
        set: set
      });
    }
  }

  Picker.prototype.setContent = function(content) {
    return setContent(this, content);
  };

  Picker.prototype.onSetContent = function(content, oldContent) {};

  Picker.prototype.getContentComponent = function() {
    return this._content;
  };

  Picker.prototype.clone = function() {
    return (new this.constructor(this.content)).copyEventListeners(this);
  };

  Picker.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 0;
    }
    if (addNewLine == null) {
      addNewLine = '';
    }
    return newLine('', indent, addNewLine) + '<Picker:' + this.field + ': ' + this.content.toString(indent + 2, true) + '>';
  };

  return Picker;

})(TransformComponent);

setContent = function(component, content) {
  var oldContent;
  oldContent = component._content;
  if (content === oldContent) {
    return content;
  } else {
    component.onSetContent(content, oldContent);
    content = toComponent(content);
    component.invalidateTransform();
    return component._content = content;
  }
};
