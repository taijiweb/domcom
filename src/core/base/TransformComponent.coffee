Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @invalid = false
    @isTransformComponent = true

  firstDomNode: -> @baseComponent and @baseComponent.firstDomNode()

  invalidate: ->
    if @invalid then return
    @invalid = true
    @baseComponent = null
    @content = null
    activeChild = @
    container = @container
    while container and !container.isHolder
      if container.isTransformComponent
        container.baseComponent = null
        activeChild = container
      container = container.container
    if container and container.isHolder
      container.activeOffspring = container.activeOffspring or Object.create(null)
      container.activeOffspring[activeChild.dcid] = activeChild
      container.noop = false

  getBaseComponent: ->
    if @baseComponent then return @baseComponent
    @invalid = false
    content = @content or @content = @getContentComponent()
    content.container = @
    content.listIndex = null
    baseComponent = content.getBaseComponent()
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    baseComponent



