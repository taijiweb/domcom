import React, {Component} from 'react'
import ReactDom from 'react-dom'

import ReactWrapper4Vue from './ReactWrapper4Vue'

createReactClass = require('create-react-class');

{isArray, isMap, parseTagString, normalizeReactProps, normalizeItem} = require 'dc-util'

import isComponent from '../component/isComponent'

export default module.exports = class ReactProxy extends Component
  constructor: (props) ->
    super(props)
    {component} = props
    this.component = component
    component.proxy = this
    return

  componentWillMount: ->

  renderNormalized: (item, props, children) =>
    if !item?
      return null
    else if typeof item != 'string'
      [tag, props, children] = item
      children = children.map (child) => this.renderNormalized(child)
      if !children.length
        children = null
      return React.createElement(tag, props, children)
    else
      return item

  renderItem: (item, props, children) =>
    if !props
      item = normalizeItem(item)
      return this.renderNormalized(item)
    else
      el = normalizeItem [item, props, children...]
      return this.renderNormalized(el)

  render: ->
    {component} = this
    view = component.getView()
    reactElement = this.renderItem(view)
    return reactElement

  mount: (parentNode) ->
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




