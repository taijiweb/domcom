Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @invalid = true
    @isTransformComponent = true

  invalidate: ->
    if @invalid then return
    @invalid = true
    activeChild = @
    holder = @holder
    while holder and !holder.isContainer
      if holder.isTransformComponent
        holder.invalid = true
        activeChild = holder
      holder = holder.holder
    if holder and holder.isContainer
      holder.activeOffspring = holder.activeOffspring or Object.create(null)
      holder.activeOffspring[activeChild.dcid] = activeChild
      holder.invalidate()

  getBaseComponent: ->
    if !@invalid then return @baseComponent
    @invalid = false
    content = @content = @getContentComponent()
    content.holder = @
    content.mountBeforeNode = @mountBeforeNode
    @baseComponent = baseComponent = content.getBaseComponent()
    if baseComponent.container
      if (baseComponent.container != @container or baseComponent.listPath!=@listPath) and !baseComponent.referable
        throw new Error 'do not mount unreferable component in mutlitple places'
    else
      baseComponent.container = @container
      baseComponent.listPath = @listPath
      content.container = @container
      content.listPath = @listPath
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    baseComponent

  getNode: -> @content and @content.getNode()


