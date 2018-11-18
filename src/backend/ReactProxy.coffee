import React, {Component} from 'react'

import ReactWrapper4Vue from './ReactWrapper4Vue'

createReactElement = (item, index) ->
  # must require here to prevent loop dependency
  # ReactBlock = require '../component/ReactBlock'
  # instanceof check is replaced by below
  if !item
    item = React.createElement(item)
  else if item.isVueBlock
    props = Object.assign({}, item.props, {block:item.block, children:item.children})
    if !props.key?
      props.key = 9999
    debugger
    item = React.createElement(ReactWrapper4Vue, props, children)
  else if item.tag && item.props  && item.children
    children = item.children.map (child, i) ->
      if child.props && !child.props.key?
        child.props.key = i
      createReactElement(child, i)
    item = React.createElement(item.tag, item.props, children)
  else
    item
  return item

export default module.exports = class ReactProxy extends Component
  constructor: (props) ->
    super(props)
    {block, tag, props, children} = props
    debugger
    this.block = block
    block.proxy = this
    this.state = {tag, props, children}
    return 

  render: ->
    debugger
    {tag, props, children} = this.state
    children = children.map (child, index) ->
      createReactElement(child, index)
    return React.createElement(tag, props, children)

  mount: (parentNode) ->
    reactElement = React.createElement(ReactProxy, this.props)
    ReactDom.render(reactElement, parentNode)

  refresh: ->


