import React, {Component} from 'react'
import ReactDom from 'react-dom'

import ReactWrapper4Vue from './ReactWrapper4Vue'

{isArray, isMap, parseTagString, normalizeReactProps} = require 'dc-util'

import isComponent from '../component/isComponent'

createReactElement = (item, index) ->
  # must require here to prevent loop dependency
  # ReactBlock = require '../component/ReactBlock'
  # instanceof check is replaced by below
  if !item
    item = React.createElement(item)
  else if item.isVueBlock
    props = Object.assign({}, item.props, {block:item.block, children:item.children})
    if !props.key?
      props.key = 9999
    item = React.createElement(ReactWrapper4Vue, props, children)
  else if item.tag && item.props  && item.children
    children = item.children.map (child, i) ->
      if child.props && !child.props.key?
        child.props.key = i
      createReactElement(child, i)
    item = React.createElement(item.tag, item.props, children)
  else
    item
  return item

export default module.exports = class ReactProxy extends Component
  constructor: (props) ->
    console.log('ReactProxy.constructor 1')
    super(props)
    {component} = props
    console.log('ReactProxy.constructor 2')
    this.component = component
    component.proxy = this
    console.log('ReactProxy.constructor 3', component)
    return

  componentWillMount: ->
    console.log('ReactProxy.componentWillMount')

  renderItem: (item, props, children) =>
    h = this.renderItem
    debugger
    if props
      return React.createElement(item, props, children)
    else if typeof item == 'string'
      return item
    else if isComponent(item)
      return item.renderContent()
    else if isArray(item)
      i = 0
      it = item[i]
      if typeof it== 'string'
        [tag, classes, id] = parseTagString(item[i])
        i++
      else if isReactClass(it)
        tag = it
        i++
      else if isComponent(it) || isArray(it)
        tag = 'div'
        props = {}
        children = item.map((child) -> h(child))
        return React.createElement(tag, props, children)
      if isMap(item[i])
        tag = tag || 'div'
        props = Object.assign({classes, id}, item[i])
        i++
      else
        props = {classes, id}
      children = item[i...].map((child) -> h(child))
      props = normalizeReactProps(props)
      return React.createElement(tag, props, children)

  render: ->
    console.log('ReactProxy.render 1')

    {component} = this
    view = component.getView()
    console.log('ReactProxy.render 2', component.render)
    h = this.renderItem
    if component.render
      return component.render(h, view)
    else
      this.renderItem(component.view)
    console.log('ReactProxy.render 3')
    return null

  mount: (parentNode) ->
    debugger
    console.log('ReactProxy.mount')
    this.parentNode = parentNode
    reactElement = React.createElement(ReactProxy, {component:this.component})
    ReactDom.render(reactElement, parentNode)
    this.node = this.parentNode.childNodes[0]
    return

  refresh: ->
    image = this.block.getImage()
    {tag, props, children} = image
    this.setState({tag, props, children})
    return

  unattach: ->
    if this.node
      #call ReactDom.unmountComponentAtNode to empty a container
      this.parentNode.removeChild(this.node)
      # make React happy, stop warning about this
      this.parentNode._reactRootContainer = undefined
    return




