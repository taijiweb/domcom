extend = require '../../extend'
{insertNode} = require '../../dom-util'
{classFn, styleFrom, updateProp, eventHandlerFromArray, specialPropSet} = require '../property'
{checkContainer} = require '../../util'

BaseComponent = require './BaseComponent'
List = require './List'
{VirtualTag} = require '../virtual-node'

{funcString, newLine} = require '../../util'

module.exports = class Tag extends BaseComponent
  constructor: (tagName, attrs, children, options) ->
    @tagName = tagName = tagName.toLowerCase()
    @namespace = attrs.namespace
    delete attrs.namespace
    if !@namespace
      if tagName=='svg' then @namespace = "http://www.w3.org/2000/svg"
      else if tagName=='math' then @namespace = "http://www.w3.org/1998/Math/MathML"
    @isTag = true
    super(options)
    @children = new List(children, {})
    @processAttrs(attrs)
    @processDirectives()

  clone: (options=@options) ->
    children = for child in @children.children then child.clone()
    result = new Tag(@tagName, Object.create(null), children, options or @options)
    result.cacheProps = @cacheProps
    result.props = @props
    result.cacheStyle = @cacheStyle
    result.style = @style
    result.cacheEvents = @cacheEvents
    result.events = @events
    result.cacheSpecials = @cacheSpecials
    result.specials = @specials
    result.activePropertiesCount = @activePropertiesCount
    result.copyLifeCallback(@)

  processDirectives: ->
    directives = @directives
    if !directives then return @
    if typeof directives == 'function' then return directives(@)
    comp = @
    for directive in directives
      comp = directive(comp)
    comp

  processAttrs: (attrs={}) ->
    @attrs = attrs
    @directives = attrs.directives
    delete @attrs.directives
    activePropertiesCount = 0
    @className = classFn(attrs.className, attrs.class)
    delete attrs.className
    delete attrs.class
    if @className.needUpdate then activePropertiesCount++
    @cacheClassName = ''
    @props = props = Object.create(null)
    @cacheProps = Object.create(null)
    style = styleFrom(attrs.style)
    if typeof style != 'object'
      style = Object.create(null)
    else activePropertiesCount += Object.keys(style).length
    @style = style
    delete attrs.style
    @cacheStyle = Object.create(null)
    @cacheEvents = Object.create(null)
    @events = Object.create(null)
    @specials = specials = Object.create(null)
    @cacheSpecials = Object.create(null)
    for key, value of attrs
      if key[..1]=='on'
        if @addEventProp(key, value) then activePropertiesCount++
      else
        if specialPropSet[key] then specials[key] = value
        else if key=='for' then props['htmlFor'] = value
        else props[key] = value
        activePropertiesCount++
    @activePropertiesCount = activePropertiesCount
    return

  getChildren: -> @children

  setParentNode: (node) ->
    @parentNode = node
    @children.setParentNode(@node)
    return

  firstNode: -> @node

  getVirtualTree: ->
    if vtree=@vtree
      # vtree.children = @initChildrenVirtualTree()
      vtree.srcComponents = []
      vtree
    else
      @vtree = vtree = new VirtualTag(@, @children.getVirtualTree())
      vtree

  isActive: -> !@node or @activePropertiesCount or @hasLifeTimeEvent()

  renderProperties: ->
    activePropertiesCount = @activePropertiesCount
    if !activePropertiesCount then return
    {node, className, cacheProps, props, cacheStyle, style, cacheEvents, events, cacheSpecials, specials} = @

    if className.needUpdate
      cacheClassName = @cacheClassName
      classes = className()
      if classes!=cacheClassName then node.className = classes
      if !className.needUpdate then activePropertiesCount--
      @cacheClassName = classes

    for prop, value of props
      if typeof value == 'function'
        value = value()
      else
        delete props[prop]
        activePropertiesCount--
      if !value? then value = ''
      value!=cacheProps[prop] and node[prop] = value

    elementStyle = node.style
    for prop, value of style
      if typeof value == 'function'
        value = value()
      else
        delete style[prop]
        activePropertiesCount--
      if !value? then value = ''
      value!=cacheStyle[prop] and elementStyle[prop] = value
    if !cacheStyle.oldDisplay? and (display=elementStyle.display) and display!='none'
      cacheStyle.oldDisplay = display

    for prop, value of events
      delete events[prop]
      cacheEvents[prop] = value
      activePropertiesCount--
      node[prop] = eventHandlerFromArray(value, node, @)

    for prop, value of specials
      if typeof value == 'function' then value = value()
      else
        delete props[prop]
        activePropertiesCount--
      if !value? then value = ''
      value!=cacheProps[prop] and spercialPropSet[prop](@, cacheProps[prop], value)

    @activePropertiesCount = activePropertiesCount

    return

  css: (prop, value) ->
    # for performance: use cacheStyle to avoid accessing dom
    if arguments.length==0 then return @cacheStyle
    if arguments.length==1
      if typeof prop == 'string' then return @cacheStyle[prop]
      else
        style = @style
        for key, v of prop
          if !style[key]?
            @activePropertiesCount++
            if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
          if !v? then v = ''
          style[key] = v
    else if arguments.length==2
      style = @style
      if !style[prop]?
        @activePropertiesCount++
        if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
      if !value? then value = ''
      style[prop] = value
    this

  bind: (eventName, handlers...) ->
    if eventName[..1]!='on' then eventName = 'on'+eventName
    if @addEventProp(eventName, handlers)
      @activePropertiesCount++
      if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
    @

  addEventProp: (prop, value) ->
    if prop[...2]!='on' then prop = 'on'+prop
    if cacheCallbackList=@cacheEvents[prop]
      if typeof value=='function' then cacheCallbackList.push value
      else cacheCallbackList.push.apply(cacheCallbackList, value)
      return
    if typeof value == 'function' then value = [value]
    if node=@node
      if nodeFn=node[prop] then value.unshift(nodeFn)
      @cacheEvents[prop] = value
      node[prop] = eventHandlerFromArray(value, node, @)
    else
      @events[prop] = value
      true # indicate that it need increment activePropertiesCount

  unbind: (eventName, handlers...) ->
    if eventName[..1]!='on' then eventName = 'on'+eventName
    eventHandlers = @events[eventName]
    if !eventHandlers then return @
    for h in handlers
      index = eventHandlers.indexOf(h)
      if index>=0 then eventHandlers.splice(index, 1)
    if !eventHandlers.length
      events = @events
      if @node then delete @node[eventName]
      else @activePropertiesCount--
    @

  addClass: (items...) ->
    if !@className
      @className = classFn(items)
      @activePropertiesCount--
    else
      needUpdate = @className.needUpdate
      @className.extend(items)
      if !needUpdate and @className.needUpdate
        @activePropertiesCount++
        if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
    this

  removeClass: (classes...) ->
    if !@className then return this
    needUpdate = @className.needUpdate
    @className.removeClass(classes...)
    if !needUpdate and @className.needUpdate
      @activePropertiesCount++
      if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
    this

  show: (display) ->
    if !@style.display
      @activePropertiesCount++
      if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
    @style.display = @styleDisplayOfShow(true, display)

  hide: ->
    if !@style.display
      @activePropertiesCount++
      if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
    @style.display = !@styleDisplayOfShow(false)

  styleDisplayOfShow: (status, display) ->
    if status
      cacheStyle = @cacheStyle
      oldDisplay = @cacheStyle.oldDisplay
      if display then display
      else if oldDisplay then oldDisplay
      else 'block'
    else 'none'

  top: ->
    elm = @node
    if !elm then return 0
    rect = elm.getBoundingClientRect()
    rect.top

  bottom: ->
    elm = @node
    if !elm then return 0
    rect = elm.getBoundingClientRect()
    rect.bottom

  height: ->
    elm = @node
    if !elm then return 0
    rect = elm.getBoundingClientRect()
    rect.height

  width: ->
    elm = @node
    if !elm then return 0
    rect = elm.getBoundingClientRect()
    rect.width

  getSpecialProp: (prop) ->

  toString: (indent=0, noNewLine) ->
    s = newLine("<#{@tagName}", indent, noNewLine)
    for key, value of @props
      s += ' '+key+'='+funcString(value)
    if Object.keys(@style).length
      s += ' style={'
      for key, value of  @style
        s += ' '+key+'='+funcString(value)
      s += '}'
    s += '>'
    for child in @children.children
      s += child.toString(indent+2)
    s += newLine("</#{@tagName}>", indent+2, 'noNewLine')