Component = require './component'
{insertNode, removeNode} = require '../../dom-util'
{cloneObject} = require '../../util'

module.exports = class BaseComponent extends Component
  constructor: (options) ->
    super(options)
    @activeOffspring = null
    @isBaseComponent = true
    @refs = Object.create(null)
    @baseComponent = @

  render: (mounting) ->
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    mountMode = @mountMode
    if mountMode=='unmounting'
      @remove()
      if @listIndex? then @holder.removeChild(@listIndex) #notSetFirstLast
      @mountMode = null
      return
    if !@node
      nextNode = @nextLeaf and @nextLeaf.node or @mountBeforeNode
      @executeMountCallback()
      @createDom(mounting)
      @attachNode(nextNode)
      @created = true
      @node
    else
      mounting = @mountMode=='mounting' or mounting
      if mounting
        nextNode = @nextLeaf and @nextLeaf.node or @mountBeforeNode
        @executeMountCallback()
        if !@noop then @updateDom(mounting)
        @attachNode(nextNode)
        @mountMode = null
        @node
      else if !@noop then @updateDom(mounting)

  getBaseComponent: ->
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @

  attachNode: (nextNode) ->
    @unmounted = false
    @detached = false
    if @parentNode
      container = @container
      if container and  container.isList
        container.node[@listIndex] = @node
        if !container.created or container.detached then return @node
      @parentNode.insertBefore(@node, nextNode)
      @node

  # this method will be called after updateProperties and before updating chidlren or activeOffspring
  resetContainerHookUpdater: ->
    # @noop will always be set again while offspring is changed
    @noop = !@hasActiveProperties and !@mountCallbackComponentList.length
    if !@holder or @holder.isTransformComponent
      @isContainer = true
      # do not need to hook updater, just to be itself
    else if !@noop or @isUpdateRoot
      @isContainer = true
      holder = @holder
      # the condition for isContainer ensure reaching baseComponent before transformCompnent or null
      while !holder.isContainer then holder = holder.holder
      @hookUpdater = holder
      holder.activeOffspring = holder.activeOffspring or Object.create(null)
      holder.activeOffspring[dcid] = @
      holder.noop = false # family update holder.noop!!!

  updateOffspring: () ->
    {activeOffspring} = @
    if !activeOffspring then return
    @activeOffspring = null
    for dcid, component of activeOffspring
      component.render()
    return

  invalidate: ->
    if !@noop then return
    @noop = false
    @valid = false
    holder = @holder
    while holder and !holder.isContainer
      holder = holder.holder
    if !holder then return
    holder.activeOffspring = holder.activeOffspring or Object.create(null)
    holder.activeOffspring[@dcid] = @
    holder.invalidate()

  setRefContainer: (container) ->
    @refs[container.dcid] = container
    @container = container
    @holder = container
    @

  replace: (newBaseComponent, rootContainer) ->
    @removeNode()
    @detached = true
    @executeUnmountCallback()
    {prevLeaf, nextLeaf} = @
    if prevLeaf then prevLeaf.nextLeaf = newBaseComponent.firstLeaf
    if nextLeaf then nextLeaf.prevLeaf = newBaseComponent.lastLeaf
    if !newBaseComponent.node
      newBaseComponent.createDom()
      newBaseComponent.attachNode(nextLeaf and nextLeaf.node or rootContainer.mountBeforeNode)
      newBaseComponent.detached = false
      newBaseComponent.created = true
    else
      if !newBaseComponent.noop then newBaseComponent.updateDom(true) # mounting = true
      newBaseComponent.attachNode(nextLeaf and nextLeaf.node or rootContainer.mountBeforeNode)
      newBaseComponent.detached = false
    {holder, firstLeaf, lastLeaf} = @
    while holder
      if holder.firstLeaf==firstLeaf
        holder.firstLeaf = newBaseComponent.firstLeaf
      if holder.lastLeaf==lastLeaf
        holder.lastLeaf = newBaseComponent.lastLeaf
      holder = holder.holder
    return

  remove: ->
    @removeNode()
    @executeUnmountCallback()
    prevLeaf = @prevLeaf
    nextLeaf = @nextLeaf
    prevLeaf and prevLeaf.nextLeaf = nextLeaf
    nextLeaf and nextLeaf.prevLeaf = prevLeaf
    return

  removeNode: ->
    if !@parentNode or @unmounted then return
    @parentNode.removeChild(@node)
    @unmounted = true

  executeMountCallback: ->
    for component in @mountCallbackComponentList
      for cb in component.mountCallbackList then cb()
    return

  executeUnmountCallback: ->
    for component in @unmountCallbackComponentList
      for cb in component.unmountCallbackList then cb()
    return