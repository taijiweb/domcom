extend = require('extend')

{normalizeDomElement} = require('../../dom-util')
{newDcid, isArray} = require('dc-util')
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
  create: (mountNode, beforeNode, cancelUpdate) ->
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
      this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.body
      this.nextNode = beforeNode || this.nextNode
      this.holder = dc
      dc.rootComponentMap[this.dcid] = this
    if !cancelUpdate
      this.render()
    this

  mount: (mountNode, beforeNode) ->
    this.emit('willMount')
    this.create(mountNode, beforeNode)
    this.emit('didMount')

  render: (force) ->
    if !this.destroyed && (force || dc.alwaysRender || !dc.renderBySystemLoop)
      this.emit('willRender')
      if this.removing
        this.removeDom()
      else
        this.renderDom(this.baseComponent)
      this.emit('didRender')
    this

  unmount: ->
    this.emit('willUnmount')
    this.remove()
    this.emit('didUnmount')
    this

  remove: (cancelUpdate) ->
    holder = this.holder
    component = this
    while holder && holder != dc && !holder.isBaseComponent
      component = holder
      holder = holder.holder
    if holder == dc
      component.markRemovingDom(true)
      dc.rootComponentMap[component.dcid] = component
      if !cancelUpdate
        component.render()
    else if !holder
      this
    else if holder.children
      holder.removeChild(component)
      if !cancelUpdate
        component.render()
    else
      dc.error('Should not remove the content of TransformComponent')
    this

  replace: (oldComponent, cancelUpdate) ->
    if this.destroyed || this == oldComponent
      return
    holder = oldComponent.holder
    if holder && holder != dc
      if holder.isTransformComponent
        dc.error('Should not replace the content of TransformComponent')
      else
        # holder is List or Tag
        holder.replaceChild(oldComponent, this)
        if !cancelUpdate
          this.render()
          oldComponent.render()
    else if holder == dc
      this.parentNode = oldComponent.parentNode
      this.nextNode = oldComponent.nextNode
      oldComponent.markRemovingDom(true)
      this.holder = holder
      this.invalidate()
      dc.rootComponentMap[this.dcid] = this
      dc.rootComponentMap[oldComponent.dcid] = oldComponent
      if !cancelUpdate
        this.render()
        oldComponent.render()
    this

  ###
  component.renderWhen components, events
  component.renderWhen setInterval, interval, options
  component.renderWhen setTimeout, interval, options
  ###
  renderWhen: (component, events, options) ->
    if isArray(component) || isComponent(component)
      options = [this]
    else
      options = options || {}
      options.components = [this]
    dc.renderWhen(component, events, options)
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

  getPrevSibling: ->
    if !(holder = this.holder)
      null
    else if dcidIndexMap = holder.dcidIndexMap
      holder.children[dcidIndexMap[this.dcid]-1]

  getNextSibling: ->
    if !(holder = this.holder)
      null
    else if dcidIndexMap = holder.dcidIndexMap
      holder.children[dcidIndexMap[this.dcid]+1]

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
      srcListeners[event] && myListeners[event] = srcListeners[event].splice()
    this

dcEventMixin = require('../../dc-event')
extend(Component.prototype, dcEventMixin)