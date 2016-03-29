extend = require('extend')

{normalizeDomElement} = require('../../dom-util')
{newDcid} = require('dc-util')
{flow} = require('lazy-flow')
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
    this.setReactive()

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

  updateWhen: (component, event, options) ->
    dc.updateWhen(component, event, options)
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

  setReactive: ->
    if this.reactMap
      me = this
      invalidateThis = -> me.invalidate()
      for srcField, reactField of this.reactMap
        reactive = flow.bind(this, srcField)
        if typeof reactField == 'string'
          reactive.onInvalidate ->
            if reaction = me[reactField]
              reaction.invalidate()
        else
          reactive.onInvalidate invalidateThis
    this

  copyEventListeners: (srcComponent) ->
    myListeners = this.listeners
    srcListeners = srcComponent.listeners
    for event of srcListeners
      srcListeners[event] and myListeners[event] = srcListeners[event].splice()
    this

dcEventMixin = require('../../dc-event')
extend(Component.prototype, dcEventMixin)