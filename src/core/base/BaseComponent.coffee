Component = require './component'
{insertNode, removeNode} = require '../../dom-util'
{cloneObject} = require '../../util'

module.exports = class BaseComponent extends Component
  constructor: (options) ->
    super(options)
    @isBaseComponent = true

  getBaseComponent: ->
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @oldBaseComponent = @

  attachNode: (nextNode) -> @parentNode and @parentNode.insertBefore(@node, nextNode)

  # this method will be called after updateProperties and before updating chidlren or activeOffspring
  resetHolderHookUpdater: ->
    @noop = !@hasActiveProperties and !@mountCallbackComponentList.length # will always be set again while offspring is changed
    if !@container or @container.isTransformComponent
      @isHolder = true
      # do not need to hook updater, just to be itself
    else if !@noop or @isUpdateRoot
      @isHolder = true
      container = @container
      # the condition for isHolder ensure reaching baseComponent before transformCompnent or null
      while !container.isHolder then container = container.container
      @hookUpdater = container
      container.activeOffspring = container.activeOffspring or Object.create(null)
      container.activeOffspring[dcid] = @
      container.noop = false # offspring update container.noop!!!

  updateOffspring: (mounting) ->
    {activeOffspring} = @
    if !activeOffspring then return
    @activeOffspring = null
    for dcid, component of activeOffspring
      component.render(mounting)
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
    container.invalidate()

  replace: (baseComponent, rootContainer) ->
    @removeNode()
    @executeUnmountCallback()
    prevNodeComponent = @prevNodeComponent
    nextNodeComponent = @nextNodeComponent
    firstNodeComponent = baseComponent.firstNodeComponent
    if firstNodeComponent
      container = baseComponent.container
      if prevNodeComponent then prevNodeComponent.nextNodeComponent = firstNodeComponent
      else container and container.firstNodeComponent = firstNodeComponent
      if nextNodeComponent then nextNodeComponent.prevNodeComponent = baseComponent.lastNodeComponent
      else container and container.lastNodeComponent = baseComponent.lastNodeComponent
    if !baseComponent.node then baseComponent.createDom()
    else if !baseComponent.noop then baseComponent.updateDom(mounting)
    baseComponent.attachNode(@nextNodeComponent and @nextNodeComponent.node or rootContainer.mountBeforeNode)
    return

  remove: ->
    @removeNode()
    @executeUnmountCallback()
    prevNodeComponent = @prevNodeComponent
    nextNodeComponent = @nextNodeComponent
    prevNodeComponent and prevNodeComponent.nextNodeComponent = nextNodeComponent
    nextNodeComponent and nextNodeComponent.prevNodeComponent = prevNodeComponent
    return

  removeNode: ->
    if @parentNode
      @parentNode.removeChild(@node)
      @parentNode = null

  executeMountCallback: ->
    for component in @mountCallbackComponentList
      for cb in component.mountCallbackList then cb()
    return

  executeUnmountCallback: ->
    for component in @unmountCallbackComponentList
      for cb in component.unmountCallbackList then cb()
    return

  getNode: -> @node
