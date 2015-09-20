extend = require '../../extend'

{normalizeDomElement} = require '../../dom-util'
{newDcid} = require '../../util'
isComponent = require './isComponent'
dc = require '../../dc'

componentId = 1
mountList = []

module.exports = class Component
  constructor: (options) ->
    @listeners = {}
    @baseComponent = null
    @refComponent = @
    @parentNode = null
    @node = null
    @options = options or {}
    @hookUpdater = @
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

  ### if mountNode is given, it should not the node of any Component
  only use beforeNode if mountNode is given
  ###
  mount: (mountNode, beforeNode) ->
    if @holder
      throw new Error 'do not mount/unmount sub component'
    mountNode = normalizeDomElement(mountNode) or @parentNode or document.getElementsByTagName('body')[0]
    if @isBaseComponent then @isContainer = true
    if @parentNode and @parentNode!=mountNode
      @mounted and @unmount()
    @parentNode = mountNode
    @mountMode = 'mounting'
    @mountBeforeNode = beforeNode or @mountBeforeNode
    @render(true) # mounting = true
    @

  render: (mounting) ->
    oldBaseComponent = @baseComponent
    mountMode = @mountMode
    if mountMode=='unmounting'
      oldBaseComponent.remove()
      if @listIndex? then @holder.removeChild(@listIndex) #notSetFirstLast
      @mountMode = null
      return
    baseComponent = @getBaseComponent()
    baseComponent.parentNode = @parentNode
    if oldBaseComponent and baseComponent!=oldBaseComponent
      oldBaseComponent.replace(baseComponent, @) # pass the root holder
    else
      if !baseComponent.node
        nextNode = oldBaseComponent and oldBaseComponent.nextNodeComponent and oldBaseComponent.nextNodeComponent.node or @mountBeforeNode
        baseComponent.executeMountCallback()
        baseComponent.createDom(mounting)
        baseComponent.attachNode(nextNode)
      else
        mounting = @mountMode=='mounting' or mounting
        if mounting
          nextNode = oldBaseComponent and oldBaseComponent.nextNodeComponent and oldBaseComponent.nextNodeComponent.node or @mountBeforeNode
          baseComponent.executeMountCallback()
          if !baseComponent.noop then baseComponent.updateDom(mounting)
          baseComponent.attachNode(nextNode)
          @mountMode = null
        else if !baseComponent.noop then baseComponent.updateDom(mounting)

  create: -> @render()

  update: ->
    if @updateCallbackList
      for callback in @updateCallbackList then callback()
    @valid = false
    @render()

  ### to ensure that the component can be mounted back again, this method should not change holder and listIndex,
  ###
  unmount: ->
    @baseComponent.remove()
    if @listIndex? then @holder.removeChild(@listIndex)
    @mountMode = null
    return

  setUpdateRoot: ->
    if !@noop
      if !@isUpdateRoot
        @isUpdateRoot = true
        # remove me from my hooked ancestor holder
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

  ### component.updateWhen [components, events] ...
  component.updateWhen components..., events...
  component.updateWhen setInterval, interval, options
  component.updateWhen dc.raf, options
  ###
  updateWhen: (args...) -> @_renderWhenBy('update', args)
  renderWhen: (args...) -> @_renderWhenBy('render', args)

  _renderWhenBy: (method, args) ->
    if args[0] instanceof Array
      for item in args
        dc._renderWhenBy(method, item..., [@])
    else
      i = 0; length = args.length
      while i<length
        if !isComponent(args[i]) then break
        i++
      if i>0 then dc._renderWhenBy(method, args.slice(0, i), args.slice(i), [@])
      else
        if args[0]==setInterval
          if args[1]=='number' then dc._renderWhenBy(method, setInterval, args[1], [@], args[2])
          else dc._renderWhenBy(setInterval, [@], args[1])
        else if args[1]==dc.raf then dc._renderWhenBy(method, dc.raf, [@], args[1])
    @

  copyLifeCallback: (srcComponent) ->
    @beforeMountCallbackList = srcComponent.beforeMountCallbackList
    @afterUnmountCallbackList = srcComponent.afterUnmountCallbackList
    @