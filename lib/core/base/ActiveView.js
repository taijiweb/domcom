var ActiveView, TransformComponent, extend, newLine, setActiveView, toComponent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toComponent = require('./toComponent');

TransformComponent = require('./TransformComponent');

newLine = require('dc-util').newLine;

extend = require('extend');

module.exports = ActiveView = (function(_super) {
  __extends(ActiveView, _super);

  function ActiveView(activeView) {
    var family, get, set;
    ActiveView.__super__.constructor.call(this);
    this._activeView = activeView = toComponent(activeView);
    this.family = family = extend({}, activeView.family);
    family[this.dcid] = true;
    if (Object.defineProperty) {
      get = function() {
        return this._activeView;
      };
      set = function(activeView) {
        return setActiveView(this, activeView);
      };
      Object.defineProperty(this, 'activeView', {
        get: get,
        set: set
      });
    }
  }

  ActiveView.prototype.setActiveView = function(activeView) {
    return setActiveView(this, activeView);
  };

  ActiveView.prototype.onSetActiveView = function(activeView, oldActiveView) {};

  ActiveView.prototype.getContentComponent = function() {
    return this._activeView;
  };

  ActiveView.prototype.clone = function() {
    return (new this.constructor(this.activeView)).copyEventListeners(this);
  };

  ActiveView.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 0;
    }
    if (addNewLine == null) {
      addNewLine = '';
    }
    return newLine('', indent, addNewLine) + '<ActiveView ' + this.activeView.toString(indent + 2, true) + '>';
  };

  return ActiveView;

})(TransformComponent);

setActiveView = function(component, activeView) {
  var oldActiveView;
  oldActiveView = component._activeView;
  if (activeView === oldActiveView) {
    return activeView;
  } else {
    component.onSetActiveView(activeView, oldActiveView);
    activeView = toComponent(activeView);
    component.invalidateTransform();
    return component._activeView = activeView;
  }
};
