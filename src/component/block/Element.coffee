import Block from './Block'
import React from 'react'

import ReactProxy from '../../backend/ReactProxy'
import VueProxy from '../../backend/VueProxy'

{getImage} = require '../util'

###
  Element is a similar replacement to block.Tag, block.ReactBlock, block.VueBlock
  it will have the functionality of all the above similar block
  and can generate different proxy according its backend.
###
export default module.exports = class Element extends Block

  # isReactBlock:true # replaced by this.backend

  # tag can be a tag name(e.g. 'div'..., or React Class or a Vue Component, or a jquery plugin...)
  constructor: (tag, props, children=[]) ->
    super()

    # 'react' 'vue', 'jquery',  or 'html'
    # recursively setten by Element.setBlackend(backend)
    this.backend = null

    this.mounted = false
    Object.assign(this, {tag, props, children})
#    this.proxy = this.makeProxy(this)
    return this

  setBackend: (backend) ->
    if this.backend && backend!=backend
      dc.error("setBackend: unconsistent backend: #{this.toString()}")
    this.backend = backend
    {props, children} = this
    for key, value of props
      if value instanceof Element
        value.setBackend backend
    for child in children
      if child instanceof Element
        child.setBackend backend
    return this

  # h is a function to createElement
  render: (h) ->
    children = children.map(child) ->
      h(child)
    h(this.tag, this.props, children)


  getImage: ->
    block = this
    this.block = block
    isReactBlock = true
    props = {}
    for prop, value of this.props
      props[prop] = getImage(value)
    children = this.children.map (child) -> getImage(child)
    {block, backend, tag} = this
    image = {block, backend, tag, props, children}
    return image

  refreshDom: ->
    this.image = this.getImage()
    {tag, props, children} = this.image
    if !this.mounted
      this.proxy.mount(this.parentNode)
      this.node =  this.proxy.node
      this.mounted = true
    else
      this.proxy.refresh()
    return

  unattach: ->
    this.proxy.unattach()
    return
