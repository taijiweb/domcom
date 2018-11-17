import Emitter from '../Emitter'
import ReactDom from 'react-dom'

{normalizeDomElement} = require '../dom-util'
{newDcid, isArray} = require 'dc-util'
{flow} = require 'lazy-flow'
flowBind = flow.bind
import isComponent from './isComponent'
import dc from '../dc'

###
  所有部件的基类

###
export default module.exports = class Component extends Emitter
  constructor: (template, model) ->
    super()
    this.dcid = dc.dcid++;
    this.view = null
    this.model = null
    this.backend = null

  ###
    设置部件模版 this.view
  ###
  view: (view) ->
    this._view = view
    return this

  ###
    设置部件数据模型 this.model
  ###
  model: (model) ->
    this._model = model
    return this

  ###
    设置部件后端 this.backend
  ###
  use: (@backend) ->
    return this

  ###
    ## 更新部件
    * 基本步骤
      * 渲染部件
      * dc清理：移除不应该继续在Dom中存在的Dom Node
  ###
  update: ->
    this.render()
#    dc.refresh()
    return this

  ###
    ## 渲染部件
    * 基本步骤
      * 计算即时数据映像
      * 计算vdom
      * 更新dom
  ###
  render: ->
    oldBlock = this.block
    block = this.getBlock()
    if oldBlock && block != oldBlock
      oldBlock.unattach()
    block.refreshDom()
    return this

  ###
    根据部件数据模型this.model计算即时数据映像this.data
  ###
  getImage: ->
    this.block = block = this.getBlock()
    image = block.getImage()
    return image

  _prepareMount: (mountNode, beforeNode) ->
    parentNode = normalizeDomElement(mountNode) || document.body
    if parentNode.childNodes.length
      dc.error('should not mount to node which is not empty:', mountNode)
    this.parentNode = parentNode
    this.setHolder(dc)
    dc.rootComponentMap[this.dcid] = this
    return

  ### if mountNode is given, it should not be the node of any Component
  only use beforeNode if mountNode is given
  ###
  mount: (mountNode) ->
    this.emit('willMount')
    this._prepareMount(mountNode)
    this.render()
    this.emit('didMount')
    return

  unmount: () ->
    this.emit('willUnmount')
    this.remove()
    dc.clean()
    this.emit('didUnmount')
    return

  remove: ->
    holder = this.holder
    if !holder || holder == dc
      delete dc.rootComponentMap[this.dcid]
      firstNode = this.firstNode
      if firstNode && firstNode.parentNode
        this.markRemovingDom()
    else if holder && holder.children
      holder.removeChild(this)
    else if holder
      dc.error('Should not remove the content of TranComponent')
    this


  replace: (oldComponent) ->
    if !this.destroyed && this != oldComponent && !oldComponent.removing && !oldComponent.removed
      holder = oldComponent.holder
      if holder && holder != dc
        if holder.isTransformComponent
          dc.error('Should not replace the content of TranComponent')
        else
          holder.replaceChild(oldComponent, this)
      else if holder == dc
        this.parentNode = oldComponent.parentNode
        this.nextNode = oldComponent.nextNode
        oldComponent.markRemovingDom()
        this.setHolder(holder)
        this.invalidate()
        dc.rootComponentMap[this.dcid] = this
        delete dc.rootComponentMap[oldComponent.dcid]

    this

  ###
  component.renderWhen components, events, options
  component.renderWhen setInterval, interval, options
  component.renderWhen setTimeout, interval, options
  ###
  renderWhen: (cause, events, options) ->
    options = options || {}
    options.target = [this]
    dc.renderWhen(cause, events, options)
    this

  destroy: ->
    this.emit('willDestroy')
    this.executeDestroy()
    this.emit('didDestroy')

  executeDestroy: ->
    this.unmount(true)
    this.destroyed = true
    this.listeners = null
    if this.node
      this.node.component = null
      this.node = null
    this.Block = null
    this.parentNode = null

  getPrevComponent: ->
    if !(holder = this.holder)
      null
    else if children = holder.children
      children[children.indexOf(this) - 1]

  getNextComponent: ->
    if !(holder = this.holder)
      null
    else if children = holder.children
      children[children.indexOf(this) - 1]

  setNextNode: (nextNode) ->
    this.nextNode = nextNode
    return

  setHolder: (holder) ->
    if this.holder && this.holder != holder
      this.holder.invalidateAttach(this)
    this.holder = holder
    this

  isOffspringOf: (ancestor) ->
    holder = this.holder
    while holder
      if holder == ancestor
        return true
      holder = holder.holder
    false

  inFamilyOf: (ancestor) ->
    this == ancestor || this.isOffspringOf(ancestor)

  setReactive: ->
    if this.reactMap
      me = this
      invalidateThis = -> me.invalidate()
      for srcField, reactField of this.reactMap
        reactive = flowBind(this, srcField)
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

import dcEventMixin from '../dc-event'
Object.assign(Component.prototype, dcEventMixin)
