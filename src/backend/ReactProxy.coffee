import React, {Component} from 'React'

createReactElement = (item, index) ->
  # must require here to prevent loop dependency
  ReactBlock = require '../component/ReactBlock'
  if item instanceof ReactBlock || item.tagNameOrReactClass
    children = item.children.map (child, i) -> createReactElement(child, i)
    item = React.createElement(item.tagNameOrReactClass, item.props, children)
#    item.key = item && item.props && item.props.key || index
  else
    item
  return item

export default module.exports = class ReactProxy extends Component
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
    debugger
    {tagNameOrReactClass, props, children} = this.state
    children = children.map (child, index) ->
      createReactElement(child, index)
    React.createElement(tagNameOrReactClass, props, children)

