extend = require('extend')
Component = require('./component')
TransformComponentMixin = require('./TransformComponentMixin')

module.exports = class TransformComponent extends Component
  constructor: ->
    super
    this.initTransformComponent()

  xxxupdateChildHolder: (child) ->
    if child.node && child.holder != this
      child.invalidate()
      child.setParentNode(this.parentNode)
      child.setNextNode(this.nextNode)
      child.holder = this
    return

extend(TransformComponent.prototype, TransformComponentMixin)