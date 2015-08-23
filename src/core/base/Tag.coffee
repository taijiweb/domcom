extend = require '../../extend'
{insertNode} = require '../../dom-util'
{classFn, styleFrom, eventHandlerFromArray} = require '../property'
BaseComponent = require './BaseComponent'
List = require './List'
{funcString, newLine, cloneObject} = require '../../util'
{_directiveRegistry} = require '../../directives/register'
Nothing = require './Nothing'
toComponent = require './toComponent'

module.exports = class Tag extends BaseComponent
  constructor: (tagName, attrs={}, children, options) ->
    @tagName = tagName = tagName.toLowerCase()
    @namespace = attrs.namespace
    delete attrs.namespace
    if !@namespace
      if tagName=='svg' then @namespace = "http://www.w3.org/2000/svg"
      else if tagName=='math' then @namespace = "http://www.w3.org/1998/Math/MathML"
    @attrs = attrs
    @isTag = true
    @initialized = false
    super(options)
    if children instanceof Array
      if children.length==1
        @children = toComponent(children[0])
      else if children.length==0
        @children = new Nothing()
      else @children = new List(children, {})
    else @children = toComponent(children)

  clone: (options=@options) ->
    result = new Tag(@tagName, Object.create(null), @children.clone(), options or @options)
    result.attrs = cloneObject(@attrs)
    result.copyLifeCallback(@)

  init: ->
    if @initialized then return @
    @processDirectives()
    @processAttrs(@attrs)
    @initialized = true
    return

  # directives always return the component it self
  processDirectives: ->
    for key, value of @attrs
      if key[0]=='$'
        # $directiveName: generator arguments list
        generator = _directiveRegistry[key.slice(1)]
        if value instanceof Array then handler = generator.apply(null, value)
        else handler = generator.apply(null, [value])
        handler(@)
    return

  processAttrs: ->
    attrs = @attrs
    @className = classFn(attrs.className, attrs.class)
    delete attrs.className
    @props = props = Object.create(null)
    @style = styleFrom(attrs.style)
    @events = events = Object.create(null)
    @specials = specials = Object.create(null)
    @directives = directives = []
    for key, value of attrs
      if key[0]=='$' then continue
      else if key[0]=='_'
        specials[key.slice(1)] = value
      else if key[..1]=='on'
        if typeof value == 'function'
          events[key] = [value]
        else events[key] = value
      else
        if key=='for' then props['htmlFor'] = value
        else props[key] = value
    if !directives.length then delete @directives
    return

  getChildren: -> @children

  firstDomNode: -> @node

  getBaseComponent: ->
    @oldBaseComponent = @
    @init()
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @

  isActive: -> !@node or @activePropertiesCount or @hasLifeTimeEvent()

  css: (prop, value) ->
    {attrs} = @
    if arguments.length==0 then return attrs.style
    if arguments.length==1
      if typeof prop == 'string' then return style and style[prop]
      else
        @assertNotInitialized()
        style = attrs.style or (attrs.style = Object.create(null))
        for key, v of prop
          style[key] = v
    else if arguments.length==2
      @assertNotInitialized()
      style = attrs or (attrs.style = Object.create(null))
      style[prop] = value
    this

  bind: (eventNames, handler) ->
    @assertNotInitialized()
    names = eventNames.split('\s+')
    for name in names then @addEventProp(name, handler)
    return

  addEventProp: (prop, handler) ->
    if prop[...2]!='on' then prop = 'on'+prop
    {attrs} = @
    if typeof handlers == 'function' then handler = [handler]
    if !attrs[prop] then attrs[prop] = handler
    else if typeof handler == 'function' then attrs[prop] = [attrs[prop]].concat(handler)
    else attrs[prop].push.apply(attrs[prop], handler)
    @

  unbind: (eventNames, handler) ->
    @assertNotInitialized()
    names = eventNames.split('\s+')
    for name in names then @removeEventHandlers(name, handler)
    return

  removeEventHandlers: (eventName, handler) ->
    if eventName[..1]!='on' then eventName = 'on'+eventName
    eventHandlers = @attrs[eventName]
    if !eventHandlers then return @
    index = eventHandlers.indexOf(handler)
    if index>=0 then eventHandlers.splice(index, 1)
    @

  assertNotInitialized: ->
    if @initialized then throw new Error('Component is initialized, do not allowed to be modified any more: '+@toString())

  addClass: (items...) ->
    assertNotInitialized()
    if !@className
      @className = classFn(items)
      @activePropertiesCount--
    else
      needUpdate = @className.needUpdate
      @className.extend(items)
      if !needUpdate and @className.needUpdate
        @activePropertiesCount++
        if baseComponent=@baseComponent then baseComponent.isNoop = baseComponent.isPlaceHolder = false
    this

  removeClass: (classes...) ->
    assertNotInitialized()
    if !@className then return this
    needUpdate = @className.needUpdate
    @className.removeClass(classes...)
    if !needUpdate and @className.needUpdate
      @activePropertiesCount++
      if baseComponent=@baseComponent then baseComponent.isNoop = baseComponent.isPlaceHolder = false
    this

  show: (test, display) ->
    assertNotInitialized()
    @showHide(true, test, display)

  hide: (test, display) ->
    assertNotInitialized()
    @showHide(false, test, display)

  showHide: (showHide, showing, display) ->
    {attrs} = @
    style = attrs.style = attrs.style or Object.create(null)
    oldDisplay = style.display
    if typeof oldDisplay == 'function' then oldDisplay = oldDisplay()
    style.display = ->
      if (if typeof showing == 'function' then !!showing() else !!showing)==showHide
        if display
          if typeof display == 'function' then display()
          else display
        else if oldDisplay? and oldDisplay!='none' then oldDisplay
        else oldDisplay = 'block'
      else 'none'
    @

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

  createDom: ->
    {children} = @
    @node = node =
      if @namespace then document.createElementNS(@namespace, @tagName)
      else document.createElement(@tagName)
    children.setParentNode node
    @createProperties()
    children.render(true) # need mounting
    @isNoop = !@mountCallbackComponentList.length and children.isNoop
    @

  updateDom: (mounting) ->
    {children} = @
    @updateProperties()
    children.render()
    @isNoop = !@mountCallbackComponentList.length and children.isNoop
    @

  createProperties: ->
    {className, node, props, style, events, specials} = @

    classValue = className()
    @cacheClassName = classValue
    if classValue then node.className = classValue
    if !className.needUpdate then delete @className

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

    @cacheStyle = cacheStyle = Object.create(null)
    active = false
    elementStyle = node.style
    for prop, value of style
      if typeof value == 'function'
        value = value()
        active = true
      else delete style[prop]
      if !value? then value = ''
      cacheStyle[prop] = elementStyle[prop] = value
    if !active then delete @style

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
      {cacheStyle} = @
      for prop, value of style
        if !( value = value())? then value = ''
        value!=cacheStyle[prop] and elementStyle[prop] = value

    if specials
      {cacheSpecials} = @
      for prop, value of specials
        if !( value = value())? then value = ''
        value!=cacheProps[prop] and spercialPropSet[prop](@, cacheProps[prop], value)

  replaceProperties: (baseComponent) ->

  toString: (indent=0, noNewLine) ->
    s = newLine("<#{@tagName}", indent, noNewLine)
    for key, value of @attrs
      if key=='style'
        if Object.keys(value).length
          s += ' style={'
          for key, value of  value
            s += ' '+key+'='+funcString(value)
          s += '}'
      else s += ' '+key+'='+funcString(value)
    s += '>'
    s += @children.toString(indent+2)
    s += newLine("</#{@tagName}>", indent+2, 'noNewLine')