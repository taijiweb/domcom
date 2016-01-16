var Pick, TransformComponent, extend, newLine, toComponent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

newLine = require('dc-util').newLine;

extend = require('extend');

module.exports = Pick = (function(_super) {
  __extends(Pick, _super);

  function Pick(host, field, initialContent) {
    var family, get, me, set;
    this.host = host;
    Pick.__super__.constructor.call(this);
    me = this;
    if (field == null) {
      this.field = field = 'content';
    } else {
      this.field = field;
    }
    if (initialContent) {
      this._content = host[field] = toComponent(initialContent);
    } else {
      this._content = host[field] = toComponent(host[field]);
    }
    this.family = family = extend({}, this._content.family);
    family[this.dcid] = true;
    if (Object.defineProperty) {
      get = function() {
        return me._content;
      };
      set = function(content) {
        me.setContent(content);
        return content;
      };
      Object.defineProperty(host, field, {
        get: get,
        set: set
      });
    }
  }

  Pick.prototype.setContent = function(content) {
    var oldContent;
    oldContent = this._content;
    if (content === oldContent) {
      return this;
    } else {
      this.invalidateTransform();
      this.onSetContent(content, oldContent);
      this._content = toComponent(content);
      return this;
    }
  };

  Pick.prototype.onSetContent = function(content, oldContent) {
    return this;
  };

  Pick.prototype.getContentComponent = function() {
    return this._content;
  };

  Pick.prototype.clone = function() {
    return (new this.constructor(this.host, this.field)).copyEventListeners(this);
  };

  Pick.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 0;
    }
    if (addNewLine == null) {
      addNewLine = '';
    }
    return newLine('', indent, addNewLine) + '<Pick:' + this.field + ': ' + this._content.toString(indent + 2, true) + '>';
  };

  return Pick;

})(TransformComponent);
