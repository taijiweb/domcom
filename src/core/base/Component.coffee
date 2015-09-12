extend = require '../../extend'

{normalizeDomElement} = require '../../dom-util'
{newDcid} = require '../../util'

componentId = 1
mountList = []

module.exports = class Component
  constructor: (options) ->
    @listeners = {}
    @baseComponent = null
    @parentNode = null
    @node = null
    @options = options or {}
    @hookUpdater = @
    @activeOffSpring = Object.create(null)
    @dcid = newDcid()

  setOptions: (@options) -> @

  onMount: (fns...) ->
    @mountCallbackList = cbs = @mountCallbackList or []
    cbs.push.apply(cbs, fns)
    @

  offMount: (fns...) ->
    cbs = @mountCallbackList
    for fn in cbs
      if cbs.indexOf(fn)==-1 then continue
      else cbs.splice(index, 1)
    !cbs.length and @mountCallbackList = null
    @

  onUnmount: (fns...) ->
    @unmountCallbackList = cbs = @unmountCallbackList or []
    cbs.push.apply(cbs, fns)
    @

  offUnmount: (fns...) ->
    cbs = @unmountCallbackList
    for fn in cbs
      if cbs.indexOf(fn)==-1 then continue
      else cbs.splice(index, 1)
    !cbs.length and @unmountCallbackList = null
    @

  onUpdate: (fns...) ->
    @updateCallbackList = cbs = @updateCallbackList or []
    cbs.push.apply(cbs, fns)
    @

  unbindUpdate: (fns...) ->
    cbs = @updateCallbackList
    for fn in cbs
      if cbs.indexOf(fn)==-1 then continue
      else cbs.splice(index, 1)
    !cbs.length and @updateCallbackList = null
    @

  mount: (mountNode, beforeNode) ->
    @mountNode = normalizeDomElement(mountNode)
    if @isBaseComponent then @isHolder = true
    if @parentNode && @parentNode!=@mountNode
      @unmount()
    @parentNode = @mountNode
    @mountBeforeNode = beforeNode
    @render(true) # mounting = true
    @

  render: (mounting) ->
    oldBaseComponent = @oldBaseComponent
    if @removing
      oldBaseComponent.remove()
      if @listIndex? then @container.removeChild(@listIndex) #notSetFirstLast
      @removing = null
      return
    @baseComponent = baseComponent = @getBaseComponent()
    baseComponent.parentNode = @parentNode
    if oldBaseComponent and baseComponent!=oldBaseComponent
      oldBaseComponent.replace(baseComponent, @) # pass the root container
    else
      nextNode = oldBaseComponent and oldBaseComponent.nextNodeComponent and oldBaseComponent.nextNodeComponent.node or @mountBeforeNode
      if !baseComponent.node
        baseComponent.executeMountCallback()
        baseComponent.createDom()
        baseComponent.attachNode(nextNode)
      else
        if mounting then baseComponent.executeMountCallback()
        if !baseComponent.noop then baseComponent.updateDom(mounting)
        if mounting then baseComponent.attachNode(nextNode)
    @oldBaseComponent = baseComponent

  create: -> @render()

  update: ->
    if @updateCallbackList
      for callback in @updateCallbackList then callback()
    @render()

  unmount: ->
    @baseComponent.remove(@parentNode)
    @

  setUpdateRoot: ->
    if !@noop
      if !@isUpdateRoot
        @isUpdateRoot = true
        # remove me from my hooked ancestor container
        # move my active offSpring to meself
        hookUpdater = @hookUpdater
        @hookUpdater = @
        {activeOffSpring} = hookUpdater
        myOffSpring = @activeOffSpring
        #@hasActiveOffspring = false
        for dcid, comp of activeOffSpring
          if comp.isOffSpringOf(@)
            delete offSpring[dcid]
            myOffSpring[dcid] = comp
            @hasActiveOffspring = true
      return

  setRemoving: ->
    if @removing then return
    @removing = true
    if @invalid then return
    @invalidate()

  hasLifeTimeEvent: -> false

  copyLifeCallback: (srcComponent) ->
    @beforeMountCallbackList = srcComponent.beforeMountCallbackList
    @afterUnmountCallbackList = srcComponent.afterUnmountCallbackList
    @