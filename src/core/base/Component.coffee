extend = require '../../extend'

{normalizeDomElement} = require '../../dom-util'

componentId = 1
mountList = []

module.exports = class Component
  constructor: ->
    @listeners = {}
    @baseComponent = null
    @parentNode = null
    @node = null
    @options = null
    @id = componentId++

  setOptions: (@options) -> @

  beforeMount: (fns...) ->
    @mountCallbackList = cbs = @mountCallbackList or []
    cbs.push.apply(cbs, fns)
    @

  unbindBeforeMount: (fns...) ->
    cbs = @mountCallbackList
    for fn in cbs
      if cbs.indexOf(fn)==-1 then continue
      else cbs.splice(index, 1)
    if !cbs.length
      @mountCallbackList = null
      if @baseComponent instanceof LifeTimeEvent
        @baseComponent = null
    @

  afterUnmount: (fns...) ->
    @unmountCallbackList = cbs = @unmountCallbackList or []
    cbs.push.apply(cbs, fns)
    @

  unbindAfterUnmount: (fns...) ->
    cbs = @unmountCallbackList
    for fn in cbs
      if cbs.indexOf(fn)==-1 then continue
      else cbs.splice(index, 1)
    if !cbs.length
      @unmountCallbackList = null
      if @baseComponent instanceof LifeTimeEvent
        @baseComponent = null
    @

  setParentNode: (node) -> @parentNode = node

  nextDomNode: ->
    container = @container
    if !container then return @_nextNode
    index = @listIndex
    if !index? then return container.nextDomNode()
    siblings = container.children
    len = siblings.length
    while index<len-1
      if node=siblings[index+1].firstDomNode() then return node
      index++
    if container.tagName then return
    else container.nextDomNode()

  mount: (mountNode, beforeNode) ->
    @mountNode = normalizeDomElement(mountNode)
    if @parentNode && @parentNode!=@mountNode
      @unmount()
    @setParentNode @mountNode
    @_nextNode = beforeNode
    @render(true) # mounting = true
    @

  render: (mounting) ->
    @baseComponent = baseComponent = @getBaseComponent()
    oldBaseComponent = @oldBaseComponent
#    {funcString} = dc
#    s = funcString(baseComponent)
    if oldBaseComponent and baseComponent!=oldBaseComponent
      oldBaseComponent.remove(@parentNode)
      baseComponent.executeMountCallback()
      if !baseComponent.node then baseComponent.createDom()
      else if !baseComponent.isNoop then baseComponent.updateDom(mounting)
      baseComponent.attachNode(@parentNode)
    else if !baseComponent.node
      baseComponent.executeMountCallback()
      baseComponent.createDom()
      baseComponent.attachNode(@parentNode)
    else
      if mounting then baseComponent.executeMountCallback()
      if !baseComponent.isNoop then baseComponent.updateDom(mounting)
      if mounting then baseComponent.attachNode(@parentNode)

  create: -> @render()

  update: -> @render()

  unmount: ->
    @baseComponent.remove(@parentNode)
    @

  xxxactiveInContainer: ->
    container = self = @
    while container
      if !container.isNoop or container.isUpdateRoot
        container.activeOffspring = container.activeOffspring or Object.create(null)
        container.activeOffspring[self.dcid] = self
        container.isNoop = false
        return
      container = container.container

  activeInContainer: ->
    container = self = @
    while container
      if container.isNoop
        container.isNoop = false
      else return
      container = container.container

  hasLifeTimeEvent: -> false

  copyLifeCallback: (srcComponent) ->
    @beforeMountCallbackList = srcComponent.beforeMountCallbackList
    @afterUnmountCallbackList = srcComponent.afterUnmountCallbackList
    @