import Block from './Block'

import Vue, {Component} from 'vue'
{getImage, createReactElement} = require './util'
{isObject} = require 'dc-util'

import Image from '../image/Image'

createVueElement = (h, item, index) ->
  if isObject item
    item = h(item.tagNameOrVueComponent, item.props, item.children)
#    item.key = item && item.props && item.props.key || index
  else
    item
  return item


class VueProxy
  constructor: (block) ->
    proxy = this
    this.block = block
    {tagNameOrVueComponent, props, children} = block
    key = 0
    data = {tagNameOrVueComponent, props, children, key}
    this.data = data
    this.vueInstance = new Vue({
      data,
      render:((h) ->
        {tagNameOrVueComponent, props, children} = proxy.block.image || proxy.block
        debugger
        children = children.map (child, index) ->
          createVueElement(h, child, index)
        h(tagNameOrVueComponent, props, children))
    })
    return this

  update: ->
    this.data.key++
    this.vueInstance.$forceUpdate()
    return


export default module.exports = class VueBlock extends Block

  constructor: (tagNameOrVueComponent, props, children=[]) ->
    super()
    Object.assign(this, {tagNameOrVueComponent, props, children})
    this.proxy = new VueProxy(this)
    return this

  getImage: ->
    this.block = this
    props = {}
    for prop, value of this.props
      props[prop] = getImage(value)
    children = this.children.map (child) -> getImage(child)
    {tagNameOrVueComponent} = this
    image = {tagNameOrVueComponent, props, children}
    return image

  refreshDom: ->
    if !this.mounted
      this.proxy.vueInstance.$mount(this.parentNode)
      this.mounted = true
    else
      this.proxy.update()

