import Block from './Block'

import React, {Component} from 'React'
import ReactDom from 'react-dom'
{getImage, createReactElement} = require './util'

import Image from '../image/Image'

createReactElement = (item, index) ->
  if item instanceof ReactBlock
    item = React.createElement(item.tagNameOrReactClass, item.props, item.children)
#    item.key = item && item.props && item.props.key || index
  else
    item
  return item

class ReactProxy extends Component
  constructor: (block) ->
    super()
    {tagNameOrReactClass, props, children} = block.image || block
    this.state = {tagNameOrReactClass, props, children}
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
    Object.assign(this, {tagNameOrReactClass, props, children})
    this.proxy = new ReactProxy(this)
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
    reactElement = this.proxy.render()
    console.log(reactElement)
    ReactDom.render(reactElement, this.parentNode)

