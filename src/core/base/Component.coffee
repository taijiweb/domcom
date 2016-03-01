extend = require('extend')

{normalizeDomElement} = require('../../dom-util')
{newDcid} = require('dc-util')
isComponent = require('./isComponent')
dc = require('../../dc')

componentId = 1
mountList = []

module.exports = class Component
  constructor: ->
    # maybe this.listeners is be set in sub class's component.on(...) call
    this.listeners = this.listeners || {}
    this.baseComponent = null
    this.parentNode = null
    this.node = null
    this.attached = false
    this.destroyed = false
    this.holder = null
    this.dcid = newDcid()

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
      if !(listeners = this.listeners)
        this.listeners = listeners = {}
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
    if this.destroyed
      return @
    if !(callbacks = @listeners[event])
      return @
    for callback in callbacks then callback.apply(@, args)
    @

  ### if mountNode is given, it should not be the node of any Component
  only use beforeNode if mountNode is given
  ###
  mount: (mountNode, beforeNode) ->
    @emit('willMount')
    @parentNode = normalizeDomElement(mountNode) or @parentNode or document.body
    if beforeNode
      @nextNode = beforeNode
# try to add this lines below, so that let to mount before script
# but more trouble is followed: reverse order mounting
#    else
#      if @parentNode == document.body && (firstBodyChild = document.body.childNodes[0])
#        @nextNode = firstBodyChild
    @render()
    @emit('didMount')
    @

  render: ->
    if this.destroyed
      return @
    @renderDom(@baseComponent)

  update: ->
    this.emit('willUpdate')
    if !this.destroyed
      this.render()
    this.emit('didUpdate')
    this

  unmount: ->
    @emit('willUnmount')
    if !this.attached
      return
    if !@node or !@node.parentNode
      # pass
    else
      component = @
      holder = @holder
      while holder and !holder.isBaseComponent
        component = holder
        holder = holder.holder

      if holder and (holder.isList or holder.isTag)
        holder.removeChild(holder.dcidIndexMap[component.dcid])
        component.markRemovingDom(true)
        holder.update()
      else
        component.markRemovingDom(true)
        component.removeDom()
    @emit('didUnmount')
    # this is not necessary
    # it will be set in holder.update(): call removeDom indirectly
    # or component.removeDom()
    #this.attached = false
    @

  remove: ->
    this.emit('willRemove')

    if !this.node or !this.node.parentNode
      this.emit('didRemove')
    else
      component = @
      holder = @holder
      if  holder
        if holder.isTransformComponent
          dc.error('Should not remove the content of TransformComponent')
        else
          # holder is List or Tag
          holder.removeChild(component)
          holder.update()
      else
        component.markRemovingDom(true)
        component.removeDom()
      this.emit('didRemove')

  replace: (oldComponent) ->
    if this.destroyed
      return
    holder = oldComponent.holder
    if  holder
      if holder.isTransformComponent
        dc.error('Should not replace the content of TransformComponent')
      else
        # holder is List or Tag
        holder.replaceChild(oldComponent, this)
        holder.update()
    else
      this.setParentNode(oldComponent.parentNode)
      this.setNextNode(oldComponent.nextNode)
      oldComponent.markRemovingDom(true)
      this.renderDom()
      oldComponent.removeDom()
    this

  destroy: ->
    this.destroyed = true
    this.remove()
    this.listeners = null
    if this.node
      this.node.component = null
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