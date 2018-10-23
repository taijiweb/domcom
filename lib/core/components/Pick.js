var Pick, TransformComponent, extend, newLine, toComponent;

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

({newLine} = require('dc-util'));

extend = require('extend');

module.exports = Pick = class Pick extends TransformComponent {
  constructor(host1, field, initialContent) {
    var family, get, me, set;
    super();
    this.host = host1;
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
      Object.defineProperty(host, field, {get, set});
    }
  }

  setContent(content) {
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
  }

  onSetContent(content, oldContent) {
    return this;
  }

  getContentComponent() {
    return this._content;
  }

  // this probably should be overloaded by the subclass
  clone() {
    return (new this.constructor(this.host, this.field)).copyEventListeners(this);
  }

  toString(indent = 0, addNewLine = '') {
    return newLine('', indent, addNewLine) + '<Pick:' + this.field + ': ' + this._content.toString(indent + 2, true) + '>';
  }

};
