import Vue from 'vue'
import VueWrapper4React from './VueWrapper4React'
import React from 'react'

createVueElement = (h, item, index) ->
  if !item
    item = h(item)
  else if item.isReactBlock
    debugger
    props = Object.assign({}, item)
    if !props.key?
      props.key = 9999
    item = h(VueWrapper4React, {props:{props}}, children)
  else if item.tagComponent && item.tagComponent  && item.children
    children = item.children.map (child, i) -> createVueElement(h, child, index)
    item = h(item.tagComponent, item.props, children)
  else
    item
  return item


export default module.exports = class VueProxy
  constructor: (block) ->
    proxy = this
    this.block = block
    # set key to trigger refresh
    this.data = {key: 0}
    this.vueInstance = new Vue({
    # do not observe tagComponent, props, children, key
    #[Vue warn]: Avoid using observed data object as vnode data: {}
    #Always create fresh vnode data objects in each render!
      data: this.data,
      render:((h) ->
        debugger
        image = proxy.block.getImage()
        {tagComponent, props, children} = image
        children = children.map (child, index) ->
          createVueElement(h, child, index)
        console.log 'VueProxy.render:', props, children
        h(tagComponent, props, children))
    })
    return this

  mount: (node) ->
    this.vueInstance.$mount(node)
    return

  refresh: ->
    this.data.key++
    return
