import Block from './Block'

import React from 'React'
import ReactDom from 'react-dom'
{getImage} = require './util'

import Image from '../image/Image'

import ReactProxy from '../backend/ReactProxy'

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
      debugger
      reactElement = React.createElement(ReactProxy, {block, tagNameOrReactClass, props, children})
      ReactDom.render(reactElement, this.parentNode)
      this.node =  this.parentNode.childNodes[this.parentNode.childNodes.length - 1]
      this.mounted = true
    else
      this.proxy.setState({tagNameOrReactClass, props, children})


