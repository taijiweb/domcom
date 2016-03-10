var Component, TransformComponent, TransformComponentMixin, extend,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

extend = require('extend');

Component = require('./component');

TransformComponentMixin = require('./TransformComponentMixin');

module.exports = TransformComponent = (function(_super) {
  __extends(TransformComponent, _super);

  function TransformComponent() {
    TransformComponent.__super__.constructor.apply(this, arguments);
    this.initTransformComponent();
  }

  TransformComponent.prototype.xxxupdateChildHolder = function(child) {
    if (child.node && child.holder !== this) {
      child.invalidate();
      child.setParentNode(this.parentNode);
      child.setNextNode(this.nextNode);
      child.holder = this;
    }
  };

  return TransformComponent;

})(Component);

extend(TransformComponent.prototype, TransformComponentMixin);
