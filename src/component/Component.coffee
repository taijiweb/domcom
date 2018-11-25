import Emitter from '../Emitter'
import ReactDom from 'react-dom'
import React from 'react'

import ReactProxy from '../proxy/ReactProxy'

{normalizeDomElement} = require '../dom-util'
{newDcid, isArray, isObject} = require 'dc-util'
import isComponent from './isComponent'
import dc from '../dc'
d = {}
###
  所有部件的基类
  @params config: the config object for the component, it can have the fileds below
    data: the real data of the component or a function to generate the data
    view: the view object or a function to generate the view
###
export default module.exports = class Component extends Emitter
  constructor: (config) ->
    super()
    Object.assign(this, config)
    return

  ###
    ## 更新部件
    * 基本步骤
      * 渲染部件
      * dc清理：移除不应该继续在Dom中存在的Dom Node
  ###
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

  update: ->
    # any object to trigger the update
    this.proxy.setState({})
    return this

  makeProxyViewItem: ->
    [ReactProxy, {component:this}, []]

  _prepareMount: (mountNode) ->
    parentNode = normalizeDomElement(mountNode) || document.body
    if parentNode.childNodes.length
      dc.error('should not mount to node which is not empty:', mountNode)
    this.parentNode = parentNode
    return

  getData: ->
    if typeof this.data == 'function'
      return this.data()
    else
      return this.data

  getView: ->
    data = this.getData()
    if this.view
      if typeof this.view == 'function'
        view = this.view(data)
      else
        view = this.view
      return view

  unmount: () ->
    this.emit('willUnmount')
    {parentNode} = this
    if parentNode.childNodes.length
      node = parentNode.childNodes[0]
      parentNode.removeChild(node)
    #tell React do not warn about this
    parentNode._reactRootContainer = undefined
    this.emit('didUnmount')
    return
