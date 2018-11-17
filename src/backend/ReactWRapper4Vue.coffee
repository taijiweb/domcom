import React, {Component} from 'react'

import VueProxy from './VueProxy'

export default module.exports = class ReactWrapper4Vue extends Component
  constructor: ->
    super()
  # here this.props is undefined, tested!!!

  componentWillMount: ->
    debugger
    {block, tagComponent, props, children} = this.props
    this.block = block
    proxy = new VueProxy(block)
    this.vueProxy = proxy
    this.setState {tagComponent, props, children}
    return

  render: ->
    debugger
    ref = (el) =>
      debugger
      this.vueProxy.mount(el)
      return
    return React.createElement('div', {ref, key:1000}, [])
