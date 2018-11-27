import React, {Component} from 'react'
import ReactDom from 'react-dom'

{normalizeItem} = require 'dc-util'

import isComponent from '../component/isComponent'

export default module.exports = class ReactProxy extends Component
  constructor: (props) ->
    super(props)
    {component} = props
    this.component = component
    component.proxy = this
    return

  renderNormalized: (item, props, children) =>
    if !item?
      return null
    else if typeof item == 'string'
      return item
    else
      [tag, props, children] = item
      children = children.map (child) => this.renderNormalized(child)
      if !children.length
        children = null
      console.log('renderNormalized children:', children)
      return React.createElement(tag, props, children)

  renderItem: (item, props, children) =>
    if !props
      item = normalizeItem(item)
      return this.renderNormalized(item)
    else
      el = normalizeItem [item, props, children...]
      return this.renderNormalized(el)

  render: ->
    {component} = this
    try
      view = component.getView()
      reactElement = this.renderItem(view)
    catch err
      dc.error "catched error in ReactProxy.render:#{err}"
    return reactElement


