extend = require '../../extend'

{normalizeDomElement} = require '../../dom-util'
{newDcid} = require '../../util'
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
    callbacks = @listeners[event] or @listeners[event] = []
    callbacks.push(callback)
    @

  off: (event, callback) ->
    callbacks = @listeners[event] or @listeners[event] = []
    callbacks.indexOf(callback)>=0 and  callbacks.splice(index, 1)
    !callbacks.length and @listeners[event] = null
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
    child = @
    holder = @holder
    while holder and !holder.isBaseComponent
      child = holder
      holder = holder.holder
    if holder and (holder.isList or holder.isTag)
      holder.removeChild(holder.dcidIndexMap[child.dcid])
    child.parentNode = null
    if holder and (holder.isList or holder.isTag) then holder.renderDom()
    else child.renderDom()
    @emit('afterUnmount')
    child

  remount: (parentNode) ->
    @emit('beforeMount')
    child = @
    holder = @holder
    while holder and !holder.isBaseComponent
      child = holder
      holder = holder.holder
    if (holder.isList or holder.isTag) and index = holder.dcidIndexMap[child.dcid]
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

  copyEventListeners: (srcComponent) ->
    myListeners = @listeners
    srcListeners = srcComponent.listeners
    for event of srcListeners
      srcListeners[event] and myListeners[event] = srcListeners[event].splice()
    @