extend = require 'extend'

{normalizeDomElement} = require '../../dom-util'
{newDcid} = require 'dc-util'
isComponent = require './isComponent'
dc = require '../../dc'

componentId = 1
mountList = []

module.exports = class Component
  constructor: ->
    @listeners = {}
    @baseComponent = null
    @parentNode = null
    @node = null
    @dcid = newDcid()

  on: (event, callback) ->
    if !arguments.length
      dc.error('missing arguments for Component.on(event, callback)')
    if arguments.length == 1
      if !event or typeof event != 'object'
        dc.error('wrong arguments for Component.on(event, callback)')
      else
        for eventName, callback of event
          @on(eventName, callback)
    else
      {listeners} = @
      for event in event.split(/\s*,\s*|\s+/)
        if callbacks = listeners[event]
          if callbacks.indexOf(callback) < 0
            callbacks.push(callback)
          # else null # do not repeat to add callback
        else
          listeners[event] = [callback]
    @

  off: (event, callback) ->
    if @argmuents.length
      dc.error('missing arguments for Component.off(event, callback)')
    else if arguments.length==1
      {listeners} = @
      for event in event.split(/\s*,\s*|\s+/)
        listeners[event] = null
    else
      {listeners} = @
      for event in event.split(/\s*,\s*|\s+/)
        callbacks = listeners[event]
        if callbacks and callbacks.indexOf(callback) >= 0
          callbacks.splice(index, 1)
          if !callbacks.length
            listeners[event] = null
        # else null # do nothing
    @

  emit:(event, args...) ->
    if !(callbacks = @listeners[event]) then return
    for callback in callbacks then callback.apply(@, args)
    @

  ### if mountNode is given, it should not the node of any Component
  only use beforeNode if mountNode is given
  ###
  mount: (mountNode, beforeNode) ->
    @emit('beforeMount')
    @parentNode = normalizeDomElement(mountNode) or @parentNode or document.getElementsByTagName('body')[0]
    @renderDom()
    @emit('afterMount')
    @

  create: -> @renderDom()

  render: -> @renderDom()

  update: ->
    @emit('update')
    @renderDom()
    @

  unmount: ->
    @emit('beforeUnmount')

    if !@node or !@node.parentNode
      @emit('afterUnmount')
      return @
    else
      component = @
      holder = @holder
      while holder and !holder.isBaseComponent
        component = holder
        holder = holder.holder

      if holder and (holder.isList or holder.isTag)
        holder.removeChild(holder.dcidIndexMap[component.dcid])

      component.markRemovingDom(true)
      component.removeDom()

      @emit('afterUnmount')

      @

  remount: (parentNode) ->
    @emit('beforeMount')
    child = @
    holder = @holder
    while holder and !holder.isBaseComponent
      child = holder
      holder = holder.holder
    if (holder and (holder.isList or holder.isTag)) and index = holder.dcidIndexMap[child.dcid]
      index = if index? then index else holder.children.length
      holder.insertChild(index, child)
    child.parentNode =
      if holder then holder.parentNode
      else if parentNode then parentNode
      else document.body
    child.invalidate()
    if holder and (holder.isList or holder.isTag) then holder.renderDom()
    else child.renderDom()
    @emit('afterMount')
    child

  destroy: ->
    this.listeners = null
    this.node = null
    this.baseComponent = null
    this.parentNode = null

  ###
  component.updateWhen components, events
  component.updateWhen setInterval, interval, options
  component.updateWhen dc.raf, options
  ###
  updateWhen: (args...) -> @_renderWhenBy('update', args)
  renderWhen: (args...) -> @_renderWhenBy('render', args)

  _renderWhenBy: (method, args) ->
    if args[0]==setInterval
      if args[1]=='number' then dc._renderWhenBy(method, setInterval, args[1], [@], args[2])
      else dc._renderWhenBy(method, setInterval, [@], args[1])
    else if args[1]==dc.raf then dc._renderWhenBy(method, dc.raf, [@], args[1])
    else dc._renderWhenBy(method, args[0], args[1], [@])
    @

  # navigate up till meeting Tag Component
  # if the component itself is a tag
  # start navigating from its holder
  reachTag: ->
    {holder} = @
    while !holder.isTag and holder.holder
      holder = holder.holder
    holder

  # just one kind of many design patterns in domcom
  # sometimes this can make code simpler
  # controller can be any object
  addController: (controller) ->
    controller.component = @

  copyEventListeners: (srcComponent) ->
    myListeners = @listeners
    srcListeners = srcComponent.listeners
    for event of srcListeners
      srcListeners[event] and myListeners[event] = srcListeners[event].splice()
    @