{normalizeItem} = require 'dc-util'


globalKey = 0
###
addReactProxy should be attached to dc and called like below:
  dc.addReactProxy(React, ReactDom, ReactComponent)
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

    componentWillMount: ->
      this.component.emit 'mounting'
      return

    componentDidMount: ->
      this.component.node = ReactDom.findDOMNode(this)
      this.component.watch()
      if this.component.mounted
        dc.error 'component should be mounted under only one place'
      this.component.emit 'mounted'
      dc.emit 'mounted'
      this.component.mounted = true

      return

    componentWillUnmount: ->
      dc.emit 'unmounting'
      this.component.emit 'unmounting'
      this.component.mounted = false
      this.component.node = null
      return

    componentDidCatch: (error) ->
      dc.error(error)

    componentWillUpdate: (prevProps, prevState) ->
      dc.emit 'updating'
      this.component.emit 'updating'
      return

    componentDidUpdate: (prevProps, prevState) ->
      this.component.node = ReactDom.findDOMNode(this)
      this.component.emit 'updated'
      dc.emit 'updated'
      return

    renderNormalized: (item) =>
      if !item?
        return null
      else if typeof item == 'string'
        return item
      else if dc.React.isValidElement(item)
        return item
      else
        props = Object.assign({}, item[1])
        for key, value of props
          if key[0] == '$'
            directive = dc.directives[key]
            delete item[1][key]
            item = directive.call(this.component, item, value)
        [tag, props, children] = item
        if tag == 'input'
          if children.length > 1
            dc.error 'input element should not have multiple children'
          else if children.length == 1
            if typeof children[0] != 'string'
              dc.error 'the child of input is used as model field, it should be a string'
            item = dc.directives.$model.call(this.component, item, children[0])
            props = item[1]
            children = []

        if !props.key
          props.key = globalKey++

        if (focusid = props.focusid)?
          ref = props.ref
          props.ref = (el) ->
            ref && ref(el)
            if focusid == dc.focusid
              dc.focusNode = el
            return
          onFocus = props.onFocus
          props.onFocus = (event) ->
            onFocus && onFocus(event)
            dc.focusid = focusid
            return
          onBlur = props.onBlur
          props.onBlur = (event) ->
            onBlur &&onBlur(event)
            dc.focusid = null
            return

        children = children.map (child) => this.renderNormalized(child)
        if !children.length
          children = null
        else if children.length == 1
          if props.useSingleChildren
            children = children[0]
        if keepid = props.keepid
          if reactElement = dc.keepReactElementMap[keepid]
            return reactElement
          else
            delete props.keepid
            reactElement = React.createElement(tag, props, children)
            dc.keepReactElementMap[keepid] = reactElement
            return reactElement
        else
          return React.createElement(tag, props, children)

    renderItem: (item) =>
      item = normalizeItem(item)
      return this.renderNormalized(item)

    render: ->
      {component} = this
#      try
      view = component.getView()
      reactElement = this.renderItem(view)
#      catch err
#        dc.error "catched error in ReactProxy.render:#{err}"
      return reactElement
