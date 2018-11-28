{normalizeItem} = require 'dc-util'

###
addReactProxy should be attached to dc and called like below:
  dc.addReactProxy(React, ReactDom)
###
export default module.exports = addReactProxy = (React, ReactDom, ReactComponent) ->
  dc = this
  dc.React = React
  dc.ReactDom = ReactDom

  dc.ReactProxy = class ReactProxy extends ReactComponent
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
