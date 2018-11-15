import Block from './Block'

import React, {Component} from 'React'
import ReactDom from 'react-dom'
{getImage, createReactElement} = require './util'

import Image from '../image/Image'

createReactElement = (item, index) ->
  if item instanceof ReactBlock || item.tagNameOrReactClass
    children = item.children.map (child, i) -> createReactElement(child, i)
    item = React.createElement(item.tagNameOrReactClass, item.props, children)
#    item.key = item && item.props && item.props.key || index
  else
    item
  return item

class ReactProxy extends Component
  constructor: ->
    super()

  componentWillMount: ->
    {block, tagNameOrReactClass, props, children} = this.props
    this.block = block
    block.proxy = this
    this.setState {tagNameOrReactClass, props, children}
    return this

  componentDidMount: ->

  render: ->
    {tagNameOrReactClass, props, children} = this.state
    children = children.map (child, index) ->
      createReactElement(child, index)
    React.createElement(tagNameOrReactClass, props, children)

export default module.exports = class ReactBlock extends Block

  constructor: (tagNameOrReactClass, props, children=[]) ->
    super()
    this.mounted = false
    Object.assign(this, {tagNameOrReactClass, props, children})
    return this

  getImage: ->
    this.block = this
    props = {}
    for prop, value of this.props
      props[prop] = getImage(value)
    children = this.children.map (child) -> getImage(child)
    {tagNameOrReactClass} = this
    image = {tagNameOrReactClass, props, children}
    return image

  refreshDom: ->
    block = this
    image = this.getImage()
    {tagNameOrReactClass, props, children} = image
    if !this.mounted
      reactElement = React.createElement(ReactProxy, {block, tagNameOrReactClass, props, children})
      ReactDom.render(reactElement, this.parentNode)
      this.node =  this.parentNode.childNodes[this.parentNode.childNodes.length - 1]
      this.mounted = true
    else
      this.proxy.setState({tagNameOrReactClass, props, children})


