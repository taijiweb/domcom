import React, {Component} from 'react'

export default module.exports = class HelloReact extends Component
  render: ->
    return React.createElement('div', {}, ['hello react in vue ', this.props.who])