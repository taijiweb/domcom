VirtualList = require './VirtualList'
VirtualNoop = require './VirtualNoop'
VirtualNode = require './VirtualNode'

module.exports = class VirtualTag extends VirtualNode

  constructor: (@baseComponent, @children) ->
    super
    @vtreeRootComponent = null
    @

  isActive: -> @baseComponent.activePropertiesCount or @vtreeRootComponent or @children

  createDom: ->
    {children} = @
    @node = node =
      if @namespace then document.createElementNS(@namespace, @tagName)
      else document.createElement(@tagName)
    @createProperties()
    children.setParentNode(node)
    children.createDom()
    @isPlaceHolder = !baseComponent.activePropertiesCount and !@vtreeRootComponent and !@hasMountCallback()
    if children and children.isNoop then children = null
    @isNoop = @isPlaceHolder and !children
    @children = children
    @

  updateDom: ->
    {baseComponent, children} = @
    @updateProperties()
    children and !children.isNoop and children.render()
    @isPlaceHolder = !baseComponent.activePropertiesCount and !@vtreeRootComponent and !@hasMountCallback()
    if children and children.isNoop then children = null
    @isNoop = @isPlaceHolder and !children
    @children = children
    @

  createProperties: ->
    {node, props, style, events, specials} = @

    @cacheClassName = node.className = @className()
    if !className.needUpdate then delete @className

    @cacheProps = Object.create(null)
    active = false

    for prop, value of props
      if typeof value == 'function'
        value = value()
        active = true
      else delete props[prop]
      if !value? then value = ''
      node[prop] = value
    if !active then delete @props

    @cacheStyls = Object.create(null)
    active = false
    elementStyle = node.style
    for prop, value of style
      if typeof value == 'function'
        value = value()
        active = true
      else delete style[prop]
      if !value? then value = ''
      elementStyle[prop] = value
    if !active then delete @styles

    for prop, value of events
      delete events[prop]
      node[prop] = eventHandlerFromArray(value, node, @)

    @cacheStyls = Object.create(null)
    active = false
    for prop, value of specials
      if typeof value == 'function'
        value = value()
        active = true
      else delete props[prop]
      if !value? then value = ''
      spercialPropSet[prop](@, null, value)
    if !active then delete @specials

    return

  updateProperties: ->
    {node, className, props, style, events, specials} = @

    if className and (classes=className())!=@cacheClassName
      @cacheClassName = node.className = classes

    if props
      {cacheProps} = @
      for prop, value of props
        if !( value = value())? then value = ''
        value!=cacheProps[prop] and node[prop] = value

    elementStyle = node.style
    if style
      for prop, value of style
        if !( value = value())? then value = ''
        value!=cacheStyle[prop] and elementStyle[prop] = value

    if specials
      {cacheProps} = @
      for prop, value of specials
        if !( value = value())? then value = ''
        value!=cacheProps[prop] and spercialPropSet[prop](@, cacheProps[prop], value)

  replaceProperties: (vtree) ->

  return
