import Block from './Block'

import React from 'react'
import ReactDom from 'react-dom'
{getImage} = require '../util'

import Image from '../../image/Image'

import ReactProxy from '../../backend/ReactProxy'

export default module.exports = class ReactBlock extends Block

  isReactBlock:true

  constructor: (tagComponent, props, children=[]) ->
    super()
    this.mounted = false
    Object.assign(this, {tagComponent, props, children})
    return this

  getImage: ->
    block = this
    this.block = block
    isReactBlock = true
    props = {}
    for prop, value of this.props
      props[prop] = getImage(value)
    children = this.children.map (child) -> getImage(child)
    {tagComponent} = this
    image = {block, isReactBlock, tagComponent, props, children}
    return image

  refreshDom: ->
    this.image = this.getImage()
    {tagComponent, props, children} = this.image
    if !this.mounted
      block = this
      reactElement = React.createElement(ReactProxy, {block, tagComponent, props, children})
      ReactDom.render(reactElement, this.parentNode)
      this.node =  this.parentNode.childNodes[this.parentNode.childNodes.length - 1]
      this.mounted = true
    else
      if !this.proxy
        debugger
      this.proxy.setState({tagComponent, props, children})
    return


  unattach: ->
    if this.node
      #call ReactDom.unmountComponentAtNode to empty a container
      this.parentNode.removeChild(this.node)
      # make React happy, stop warning about this
      this.parentNode._reactRootContainer = undefined
    return


