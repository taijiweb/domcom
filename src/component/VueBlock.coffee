import Block from './Block'

import Vue, {Component} from 'vue'
{getImage, createReactElement} = require './util'
{isObject} = require 'dc-util'

import Image from '../image/Image'
import VueProxy from '../backend/VueProxy'

export default module.exports = class VueBlock extends Block

  isVueBlock:true

  constructor: (tagComponent, props, children=[]) ->
    super()
    Object.assign(this, {tagComponent, props, children})
    this.proxy = new VueProxy(this)
    return this

  getImage: ->
    isVueBlock = true
    this.block = block = this
    props = {}
    for prop, value of this.props
      props[prop] = getImage(value)
    children = this.children.map (child) -> getImage(child)
    {tagComponent} = this
    this.image = {block, isVueBlock, tagComponent, props, children}
    return this.image

  refreshDom: ->
    this.getImage()
    if !this.mounted
      #workaround for the Vue's weird mounting method(it replace the mounting parantNode with rendering content!!!)
      # should ensure always only mount to empty parent DOM node
      node = document.createElement('div')
      this.parentNode.appendChild(node)
      this.proxy.mount(node)
      this.node = this.parentNode.childNodes[0]
      this.mounted = true
    else
      this.proxy.refresh()
    return

  # unattach DOM node from parentNode
  unattach: ->
    if this.node
      this.parentNode.removeChild(this.node)
    return


