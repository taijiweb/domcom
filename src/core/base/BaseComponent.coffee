Component = require './component'
{insertNode, removeNode} = require '../../dom-util'

module.exports = class BaseComponent extends Component
  constructor: (options) ->
    super(options)
    @isBaseComponent = true

  getBaseComponent: ->
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @oldBaseComponent = @

  attachNode: (parentNode) ->
    {node} = @
    insertNode(parentNode, node, @nextDomNode())
    me = this
    container = @container
    while container
      # for child of list, always be set while createDom or updateDom
      if container.isTag then return
      if !me.listIndex? then container.node = node
      me = container
      container = container.container
    return

  invalidate: ->
    if !@noop then return
    @noop = false
    container = @container
    while container and !container.isHolder
      container = container.container
    if !container then return
    container.activeOffspring = container.activeOffspring or Object.create(null)
    container.activeOffspring[@dcid] = @
    container.noop = false

  remove: (parentNode) ->
    if @node # Nothing.node is null
      removeNode(parentNode, @node)
    @executeUnmountCallback()
    @

  executeMountCallback: ->
    for component in @mountCallbackComponentList
      for cb in component.mountCallbackList then cb()
    return

  executeUnmountCallback: ->
    for component in @unmountCallbackComponentList
      for cb in component.unmountCallbackList then cb()
    return