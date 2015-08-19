{cloneObject} = require '../../util'
VirtualList = require './VirtualList'
VirtualNode = require './VirtualNode'
{styleFrom, _specialProperties, eventHandlerFromArray} = require '../property'

module.exports = class VirtualTag extends VirtualNode

  constructor: (@baseComponent, @children) ->
    super
    @tagName = baseComponent.tagName
    @namespace = baseComponent.namespace
    @className = baseComponent.className
    @props = cloneObject(baseComponent.props)
    @style = cloneObject(baseComponent.style)
    @events = cloneObject(baseComponent.events)
    @specials = cloneObject(baseComponent.specials)
    @vtreeRootComponent = null
    @

  setParentNode: (node) ->
    @parentNode = node
    @children.setParentNode(@node)
    return

  isActive: -> @baseComponent.activePropertiesCount or @vtreeRootComponent or @children

  createDom: ->
    {children, baseComponent} = @
    baseComponent.node = @node = node =
      if @namespace then document.createElementNS(@namespace, @tagName)
      else document.createElement(@tagName)
    children.setParentNode(node)
    @createProperties()
    children.createDom()
    @isPlaceHolder = !(@className or @props or @style or @specials) and !@vtreeRootComponent and !@hasMountCallback()
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
    if !@className.needUpdate then delete @className

    @cacheProps = cacheProps = Object.create(null)
    active = false

    for prop, value of props
      if typeof value == 'function'
        value = value()
        active = true
      else delete props[prop]
      if !value? then value = ''
      cacheProps[prop] = node[prop] = value
    if !active then delete @props

    @cacheStyles = cacheStyles = Object.create(null)
    active = false
    elementStyle = node.style
    for prop, value of style
      if typeof value == 'function'
        value = value()
        active = true
      else delete style[prop]
      if !value? then value = ''
      cacheStyles[prop] = elementStyle[prop] = value
    if !active then delete @styles

    @cacheEvents = cacheEvents = Object.create(null)
    for prop, value of events
      delete events[prop]
      cacheEvents[prop] = node[prop] = eventHandlerFromArray(value, node, @)

    @cacheSpecials = Object.create(null)
    active = false
    for prop, value of specials
      if typeof value == 'function'
        value = value()
        active = true
      else delete props[prop]
      if !value? then value = ''
      spercialPropSet[prop](@, prop, value)
    if !active then delete @specials

    return

  updateProperties: ->
    {node, className, props, style, specials} = @

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
