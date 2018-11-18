import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Vue from 'vue'
import ReactProxy from './ReactProxy'

component =
  props: ['props']
  data: ->
    return {}

  render: (h) ->
    debugger
    h('div', { ref: 'react' })

  mounted: () ->
    debugger
    reactElement = React.createElement(ReactProxy, this.props, ['haha vue wrapper 4 vue'])
    ReactDOM.render(reactElement, this.$refs.react)

  beforeDestroy: () ->
    return
    ReactDOM.unmountComponentAtNode(this.$refs.react)

export default Vue.component 'VueWrapper4React', component