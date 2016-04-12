extend = require('extend')
Component = require('./Component')
TransformComponentMixin = require('./TransformComponentMixin')

module.exports = class TransformComponent extends Component
  isTransformComponent: true
  constructor: ->
    super
    this.initTransformComponent()

extend(TransformComponent.prototype, TransformComponentMixin)