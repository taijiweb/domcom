extend = require('extend')

{normalizeDomElement} = require('../../dom-util')
{newDcid} = require('dc-util')
isComponent = require('./isComponent')
dc = require('../../dc')

module.exports = class Component
  constructor: ->
    # maybe this.listeners is be set in sub class's component.on(...) call
    this.listeners = this.listeners || {}
    this.baseComponent = null
    this.parentNode = null
    this.nextNode = null
    this.node = null
    this.attached = false
    this.destroyed = false
    this.holder = null
    this.dcid = newDcid()
    this.valid = true

  on: (event, callback) ->
    if !arguments.length
      dc.error('missing arguments for Component.on(event, callback)')
    if arguments.length == 1
      if !event or typeof event != 'object'
        dc.error('wrong arguments for Component.on(event, callback)')
      else
        for eventName, callback of event
          this.on(eventName, callback)
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
    this

  off: (event, callback) ->
    if this.argmuents.length
      dc.error('missing arguments for Component.off(event, callback)')
    else if arguments.length==1
      {listeners} = this
      for event in event.split(/\s*,\s*|\s+/)
        listeners[event] = null
    else
      {listeners} = this
      for event in event.split(/\s*,\s*|\s+/)
        callbacks = listeners[event]
        if callbacks and callbacks.indexOf(callback) >= 0
          callbacks.splice(index, 1)
          if !callbacks.length
            listeners[event] = null
        # else null # do nothing
    this

  emit:(event, args...) ->
    if this.destroyed
      return this
    if callbacks = this.listeners[event]
      for callback in callbacks then callback.apply(this, args)
    else
      if method=this[event]
        method.apply(this, args)
    this

  ### if mountNode is given, it should not be the node of any Component
  only use beforeNode if mountNode is given
  ###
  create: (mountNode, beforeNode, force) ->
    if mountNode && mountNode.component
      mountNode = mountNode.component
    else if beforeNode && beforeNode.component
      console.log(mountNode)
      console.log(beforeNode)
      throw new Error('error while mounting: mountNode is not a component, but beforeNode is a component')
    if isComponent(mountNode)
      if !beforeNode
        if !mountNode.children
          console.log(mountNode)
          throw new Error('error while mounting: mountNode is a component, but is not a Tag or List component')
        mountNode.pushChild(this)
      else
        if !isComponent(beforeNode)
          beforeNode = beforeNode.component
          if !beforeNode
            console.log(beforeNode)
            throw new Error('error while mounting: can not mount beforeNode')
        if beforeNode.holder != mountNode || !mountNode.children
          console.log(mountNode)
          console.log(beforeNode)
          throw new Error('both mountNode and beforeNode is component, but mountNode is not the parent of beforeNode')
        this.emit('willMount')
        mountNode.insertChildBefore(this, beforeNode)
    else
      this.emit('willMount')
      this.holder = dc
      dc.dcidIndexMap[this.dcid] = listIndex = dc.listIndex
      dc.invalidateOffspring(this)
      dc.parentNodes[listIndex] = this.parentNode = normalizeDomElement(mountNode) or this.parentNode or document.body
      dc.nextNodes[listIndex] = this.nextNode = beforeNode
      dc.listIndex++
    dc.update(force)
    this

  mount: (mountNode, beforeNode) ->
    this.emit('willMount')
    this.create(mountNode, beforeNode, true)
    this.emit('didMount')

  unmount: ->
    this.emit('willUnmount')
    this.remove(true)
    this.emit('didUnmount')
    this

  remove: (force) ->
    holder = this.holder
    if holder == dc
      this.markRemovingDom(true)
    else
      component = this
      while holder && holder != dc and !holder.isBaseComponent
        component = holder
        holder = holder.holder
      if !holder
        return this
      else if holder.children
        holder.removeChild(component)
      else if holder != dc
        dc.error('Should not remove the content of TransformComponent')
    dc.update(force)

  replace: (oldComponent, force) ->
    if this.destroyed || this == oldComponent
      return
    holder = oldComponent.holder
    if holder != dc
      if holder.isTransformComponent
        dc.error('Should not replace the content of TransformComponent')
      else
        # holder is List or Tag
        holder.replaceChild(oldComponent, this)
    else
      this.setParentNode(oldComponent.parentNode)
      this.sinkNextNode(oldComponent.nextNode)
      oldComponent.markRemovingDom(true)
      this.holder = holder
      this.invalidate()
    dc.update(force)
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
  updateWhen: (args...) ->
    if args[0]==setInterval
      if args[1]=='number'
        dc.updateWhen(setInterval, args[1], [this], args[2])
      else
        dc.updateWhen(setInterval, [this], args[1])
    else if args[1]==dc.raf
      dc.updateWhen(dc.raf, [this], args[1])
    else
      dc.updateWhen(args[0], args[1], [this])
    this

  raiseNode: (child) ->
    node = child.node
    if this.children
      try
        this.childNodes[this.dcidIndexMap[child.dcid]] = node
      catch e
        throw e
    else
      this.node = node
      if holder = this.holder
        holder.raiseNode(this)

  raiseFirstNextNode: (child) ->
    children = this.children
    firstNode = child.firstNode
    if children
      index = this.dcidIndexMap[child.dcid]
      while index
        index--
        node = firstNode || child.nextNode
        this.nextNodes[index] = children[index].nextNode = node
        child = children[index]
        firstNode = child.firstNode
      if !index && this.isList
        if this.firstNode != firstNode
          this.firstNode = firstNode
          this.holder.raiseFirstNextNode(this)
    else
      if this.firstNode != firstNode
        this.firstNode = firstNode
        this.holder.raiseFirstNextNode(this)

  copyEventListeners: (srcComponent) ->
    myListeners = this.listeners
    srcListeners = srcComponent.listeners
    for event of srcListeners
      srcListeners[event] and myListeners[event] = srcListeners[event].splice()
    this