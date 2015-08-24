extend = require '../../extend'
{insertNode} = require '../../dom-util'
{classFn, styleFrom, eventHandlerFromArray, attrToPropName} = require '../property'
BaseComponent = require './BaseComponent'
List = require './List'
{funcString, newLine, cloneObject} = require '../../util'
{_directiveRegistry} = require '../../directives/register'
Nothing = require './Nothing'
toComponent = require './toComponent'

module.exports = class Tag extends BaseComponent
  constructor: (tagName, attrs={}, children, options) ->
    super(options)
    @tagName = tagName = tagName.toLowerCase()
    @namespace = attrs.namespace
    delete attrs.namespace
    if !@namespace
      if tagName=='svg' then @namespace = "http://www.w3.org/2000/svg"
      else if tagName=='math' then @namespace = "http://www.w3.org/1998/Math/MathML"
    @attrs = attrs
    @isTag = true
    @processAttrs()
    @processDirectives()
    if children instanceof Array
      if children.length==1
        @children = toComponent(children[0])
      else if children.length==0
        @children = new Nothing()
      else @children = new List(children, {})
    else @children = toComponent(children)
    return

  clone: (options=@options) ->
    result = new Tag(@tagName, Object.create(null), @children.clone(), options or @options)
    result.attrs = cloneObject(@attrs)
    result.copyLifeCallback(@)


  processAttrs: ->
    @activePropertiesCount = 0
    attrs = @attrs
    @className = classFn(attrs.className, attrs.class)
    delete attrs.className
    @props = props = Object.create(null)
    @style = style = styleFrom(attrs.style)
    for key of style
      k = attrToPropName(key)
      if key==k then continue
      style[k] = style[key]
      delete style[key]
    @events = events = Object.create(null)
    @specials = specials = Object.create(null)
    @directives = directives = []
    for key, value of attrs
     if key[..1]=='on'
        if typeof value == 'function'
          events[key] = [value]
        else events[key] = value
        @activePropertiesCount++
      else if key[0]=='$'
        # $directiveName: generator arguments list
        generator = _directiveRegistry[key.slice(1)]
        if value instanceof Array then handler = generator.apply(null, value)
        else handler = generator.apply(null, [value])
        directives.push(handler)
      else if key[0]=='_'
        specials[key.slice(1)] = value
      else
        props[attrToPropName(key)] = value
        @activePropertiesCount++
    if !directives.length then delete @directives
    return

  # directives always return the component itself
  processDirectives: ->
    if @directives
      for directive in @directives
        directive(@)
    return

  firstDomNode: -> @node

  getBaseComponent: ->
    @oldBaseComponent = @
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @

  addActivity: (props, prop) ->
    if !props[prop] then @activePropertiesCount++
    container = @
    while container.isBaseComponent
      container.isNoop = false
    return

  css: (prop, value) ->
    {style} = @
    if arguments.length==0 then return style
    if arguments.length==1
      if typeof prop == 'string' then return style and style[prop]
      style = style or style = Object.create(null)
      for key, v of prop
        @addActivity(style, key)
        style[key] = v
    else if arguments.length==2
      style = style or style = Object.create(null)
      @addActivity(style, prop)
      style[prop] = value
    @style = style
    this

  bind: (eventNames, handler) ->
    names = eventNames.split('\s+')
    for name in names then @_addEventProp(name, handler)
    return

  _addEventProp: (prop, handler) ->
    if prop[...2]!='on' then prop = 'on'+prop
    {events} = @
    events = events or Object.create(null)
    if typeof handlers == 'function' then handler = [handler]
    if !events[prop]
      @addActivity(events, prop)
      events[prop] = handler
    else if typeof handler == 'function' then events[prop] = [events[prop]].concat(handler)
    else events[prop].push.apply(events[prop], handler)
    @events = events
    @

  unbind: (eventNames, handler) ->
    names = eventNames.split('\s+')
    for name in names then @_removeEventHandlers(name, handler)
    return

  _removeEventHandlers: (eventName, handler) ->
    if !@events then return @
    if eventName[..1]!='on' then eventName = 'on'+eventName
    eventHandlers = @events[eventName]
    if !eventHandlers then return @
    index = eventHandlers.indexOf(handler)
    if index>=0 then eventHandlers.splice(index, 1)
    @

  addClass: (items...) ->
    if !@className
      @className = classFn(items)
      @activePropertiesCount++
      container = @
      while container.isBaseComponent
        container.isNoop = false
    else
      needUpdate = @className.needUpdate
      @className.extend(items)
      if !needUpdate and @className.needUpdate
        @activePropertiesCount++
        container = @
        while container.isBaseComponent
          container.isNoop = false
      #if baseComponent=@baseComponent then baseComponent.isNoop = baseComponent.isPlaceHolder = false
    this

  removeClass: (classes...) ->
    if !@className then return this
    needUpdate = @className.needUpdate
    @className.removeClass(classes...)
    if !needUpdate and @className.needUpdate
      @activePropertiesCount++
      container = @
      while container.isBaseComponent
        container.isNoop = false
      if baseComponent=@baseComponent then baseComponent.isNoop = baseComponent.isPlaceHolder = false
    this

  show: (test, display) ->
    @showHide(true, test, display)

  hide: (test, display) ->
    @showHide(false, test, display)

  showHide: (showHide, showing, display) ->
    style = @style or Object.create(null)
    @addActivity(style, 'display')
    oldDisplay = style.display
    style.display = ->
      if (if typeof showing == 'function' then !!showing() else !!showing)==showHide
        if display
          if typeof display == 'function' then display()
          else display
        else if oldDisplay?
          if typeof oldDisplay == 'function' then d = oldDisplay()
          else d = oldDisplay
          if d!='none' then d
          else 'block'
        else oldDisplay = 'block'
      else 'none'
    @style = style
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
    @updateProperties()
    children.render(true) # need mounting
    if compList=children.baseComponent.unmountCallbackComponentList
      @unmountCallbackComponentList = compList.concat(@unmountCallbackComponentList)
    @isNoop = !@activePropertiesCount and !@mountCallbackComponentList.length and children.isNoop
    @

  updateDom: (mounting) ->
    {children} = @
    @updateProperties()
    children.render()
    @isNoop = !@activePropertiesCount and !@mountCallbackComponentList.length and children.isNoop
    @

  updateProperties: ->
    if !@activePropertiesCount then return

    {className} = @
    if className
      classValue = className()
      if !classValue then classValue = ''
      if classValue!=@cacheClassName
        @cacheClassName = node.className = classValue
      if !className.needUpdate then delete @className

    {props} = @
    if props
      {cacheProps} = @
      active = false
      for prop, value of props
        if typeof value == 'function'
          value = value()
          active = true
        else
          delete props[prop]
          @activePropertiesCount--
        if !value? then value = ''
        cacheProps[prop] = node[prop] = value
      if !active then delete @props

    {style} = @
    if style
      {cacheStyle} = @
      active = false
      elementStyle = node.style
      for prop, value of style
        if typeof value == 'function'
          value = value()
          active = true
        else
          delete style[prop]
          @activePropertiesCount--
        if !value? then value = ''
        cacheStyle[prop] = elementStyle[prop] = value
      if !active then delete @style

    {events} = @
    if events
      {cacheEvents} = @
      for prop, value of events
        delete events[prop]
        cacheEvents[prop] = node[prop] = eventHandlerFromArray(value, node, @)
        @activePropertiesCount--

    {specials} = @
    if specials
      {cacheSpecials} = @
      active = false
      for prop, value of specials
        if typeof value == 'function'
          value = value()
          active = true
        else
          delete props[prop]
          @activePropertiesCount--
        if !value? then value = ''
        spercialPropSet[prop](@, prop, value)
      if !active then delete @specials

    return

  toString: (indent=0, noNewLine) ->
    s = newLine("<#{@tagName}", indent, noNewLine)
    for key, value of @props then s += ' '+key+'='+funcString(value)
    if @style
      s += ' style={'
      for key, value of @style
        if typeof value =='string'
          s += value
        else for key, v of  value
          s += ' '+key+'='+funcString(v)
        s += '}'
    s += '>'
    s += @children.toString(indent+2)
    s += newLine("</#{@tagName}>", indent+2, 'noNewLine')