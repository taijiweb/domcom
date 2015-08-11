extend = require '../../extend'

{normalizeDomElement, removeNode} = require '../../dom-util'

componentId = 1
mountList = []

module.exports = class Component
  constructor: ->
    @listeners = {}
    @parentNode = null
    @node = null
    @options = null
    @id = componentId++

  init: ->

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
      if @vtree instanceof LifeTimeEvent
        @vtree = null
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
      if @vtree instanceof LifeTimeEvent
        @vtree = null
    @

  setParentNode: (node) -> @parentNode = node; @

  nextNode: ->
    container = @container
    if !container then return @_nextNode
    index = @index
    if !index? then container.nextNode()
    else
      siblings = container.children
      len = siblings.length
      while index<len-1
        if node=siblings[index+1].firstNode() then return node
        index++
      if container.tagName then return
      else container.nextNode()

  mount: (mountNode, beforeNode) ->
    @mountNode = normalizeDomElement(mountNode)
    if @parentNode && @parentNode!=@mountNode
      @unmount()
    @mounting = true
    @setParentNode @mountNode
    @_nextNode = beforeNode
    @render()
    @mounting = false
    @

  render: ->
    if !@vtree
      @init()
      @vtree = @getVirtualTree()
    @vtree.render()

  create: ->
    @init()
    @vtree = @getVirtualTree()
    @vtree.render()

  update: -> @vtree.render()

  unmount: ->
    @remove()
    @

  remove: ->
    removeNode(@parentNode, @node)
    @vtree.executeUnmountCallback()
    @

  hasLifeTimeEvent: -> false

  copyLifeCallback: (srcComponent) ->
    @beforeMountCallbackList = srcComponent.beforeMountCallbackList
    @afterUnmountCallbackList = srcComponent.afterUnmountCallbackList
    @


extend Component::, require '../../emitter'
