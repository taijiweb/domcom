Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @options = options or {}
    return

  firstDomNode: -> @baseComponent and @baseComponent.firstDomNode()

  invalidate: ->

  getBaseComponent: ->
    @oldBaseComponent = @baseComponent
    content = @getContentComponent()
    content.container = @
    content.listIndex = null
    baseComponent = content.getBaseComponent()
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    baseComponent

