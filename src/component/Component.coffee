import Emitter from '../Emitter'
import ReactDom from 'react-dom'
import React from 'react'

import ReactProxy from '../backend/ReactProxy'

{normalizeDomElement} = require '../dom-util'
{newDcid, isArray, isObject} = require 'dc-util'
import isComponent from './isComponent'
import dc from '../dc'

###
  所有部件的基类
  @params config: the config object for the component, it can have the fileds below
    data: the real data of the component or a function to generate the data
    view: the view object or a function to generate the view
###
export default module.exports = class Component extends Emitter
  constructor: (config) ->
    super()
    this.dcid = dc.dcid++;
    this.data = null
    this.view = null
    this.backend = null
    Object.assign(this, config)
    return

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
    this.proxy.setState(this.getData())
    return this

  ###
    ## 渲染部件
    * 基本步骤
      * 计算即时数据映像
      * 计算vdom
      * 更新dom
    big change: componet.render will be called by component.proxy and  so it should be provided in sub class or its instance
  ###
#  render: ->
#    dc.error('big change: componet.render will be called by component.proxy and  so it should be provided in sub class or its instance')
#    oldBlock = this.block
#    block = this.getBlock()
#    if oldBlock && block != oldBlock
#      oldBlock.unattach()
#    if block
#      block.refreshDom()
#    return this

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
    return

  getData: ->
    data = this.data || {}
    if typeof this.model == 'funxction'
      model = this.model(dc.store) || {}
    else model = this.model
    return [data, model]

  getView: ->
    [data, model] = this.getData()
    if this.view
      if typeof this.view == 'function'
        view = this.view(data, model)
      else
        view = this.view
      return view

  ### if mountNode is given, it should not be the node of any Component
  only use beforeNode if mountNode is given
  ###
  mount: (mountNode) ->
    this.emit('willMount')
    this._prepareMount(mountNode)
    reactElement = React.createElement(ReactProxy, {component:this})
    ReactDom.render(reactElement, this.parentNode)
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
      dc.error('Should not remove the content of TranBlock')
    this


  replace: (oldComponent) ->
    if !this.destroyed && this != oldComponent && !oldComponent.removing && !oldComponent.removed
      holder = oldComponent.holder
      if holder && holder != dc
        if holder.isTransformComponent
          dc.error('Should not replace the content of TranBlock')
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
    this.block = null
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
