Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @isTransformCompnent = true

  firstDomNode: -> @baseComponent and @baseComponent.firstDomNode()

  invalidate: ->
    if @content then return
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
    content = @content = @getContentComponent()
    content.container = @
    content.listIndex = null
    baseComponent = content.getBaseComponent()
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    baseComponent



