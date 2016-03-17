extend = require('extend')
Component = require('./Component')
TransformComponentMixin = require('./TransformComponentMixin')

module.exports = class TransformComponent extends Component
  constructor: ->
    super
    this.initTransformComponent()

extend(TransformComponent.prototype, TransformComponentMixin)