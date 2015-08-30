extend = require '../../extend'
{insertNode} = require '../../dom-util'
{classFn, styleFrom, eventHandlerFromArray, attrToPropName} = require '../property'
BaseComponent = require './BaseComponent'
List = require './List'
{funcString, newLine, cloneObject} = require '../../util'
{domValue} = require '../../dom-util'
{_directiveRegistry} = require '../../directives/register'
Nothing = require './Nothing'
toComponent = require './toComponent'

module.exports = class Tag extends BaseComponent
  constructor: (tagName, attrs={}, children, options) ->
    super(options)
    @tagName = tagName = tagName.toLowerCase()
    @namespace = attrs.namespace
    if !@namespace
      if tagName=='svg' then @namespace = "http://www.w3.org/2000/svg"
      else if tagName=='math' then @namespace = "http://www.w3.org/1998/Math/MathML"
    @attrs = attrs
    @isTag = true
    if children instanceof Array
      if children.length==1
        @children = toComponent(children[0])
      else if children.length==0
        @children = new Nothing()
      else @children = new List(children, {})
    else @children = toComponent(children)
    @processAttrs()
    return

  processAttrs: ->
    self = @
    @activePropertiesCount = 0
    attrs = @attrs
    @cacheClassName = ""
    @className = className = classFn(attrs.className, attrs.class)
    if className.needUpdate then @activePropertiesCount++
    className.onInvalidate ->
      if !className.needUpdate
        self.activePropertiesCount++
        self.activeInContainer()
        self.isNoop = false
    @hasActiveProps = false
    @cacheProps = Object.create(null)
    @props = props = Object.create(null)
    @inactiveProps = inactiveProps = Object.create(null)
    @hasActiveStyle = false
    @cacheStyle = Object.create(null)
    @style = style = Object.create(null)
    @inactiveStyle = inactiveStyle = Object.create(null)
    attrStyle = styleFrom(attrs.style)
    for key of attrStyle then @setProp(key, value, specials, 'Style')
    @hasActiveEvents = false
    @cacheEvents = Object.create(null)
    @events = events = Object.create(null)
    @hasActiveSpecials = false
    @cacheSpecials = Object.create(null)
    @inactiveSpecials = inactiveSpecials = Object.create(null)
    @specials = specials = Object.create(null)
    directives = []
    for key, value of attrs
      if key[..1]=='on'
        if typeof value == 'function'
          events[key] = [value]
        else events[key] = value
        @hasActiveEvents = true
        @activePropertiesCount++
      else if key[0]=='$'
        # $directiveName: generator arguments list
        generator = _directiveRegistry[key.slice(1)]
        if value instanceof Array then handler = generator.apply(null, value)
        else handler = generator.apply(null, [value])
        directives.push(handler)
      else if key[0]=='_' then @setProp(key.slice(1), value, specials, 'Specials')
      else @setProp(key, value, specials, 'Props')
    for directive in directives then directive(@)
    return

  firstDomNode: -> @node

  getBaseComponent: ->
    @oldBaseComponent = @
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @

  prop: (args...) -> @_prop(args, @props, @cacheProps, 'Props')

  css: (args...) -> @_prop(args, @style, @cacheStyle, 'Style')

  _prop: (args, props, type) ->
    if args.length==0 then return props
    if args.length==1
      prop = args[0]
      if typeof prop == 'string' then return props[prop]
      for key, v of prop
        @setProp(key, v, props, type, @node) #updating = @node
    else if args.length==2
      @setProp(args[0], args[1], props, type, @node) #updating = @node
    this

  setProp: (prop, value, props, type, updating) ->
    prop = attrToPropName(prop)
    value = domValue value
    oldValue = props[prop]
    if !oldValue?
      if typeof value == 'function'
        props[prop] = value
        if updating then @addActivity(props, prop, type)
      else
        if value!=@['cache'+type][prop]
          props[prop] = value
          if updating then @addActivity(props, prop, type)
    else
      # do not need to check cache
      # do not need check typeof value == 'function'
      if typeof oldValue =='function'
        oldValue.offInvalidate(@['invalidate'+type][prop])
      if typeof value == 'function'
        fn = -> @addActivity(props, prop, type)
        value.onInvalidate(fn)
      props[prop] =value
    return

  addActivity: (props, prop, type) ->
    @['hasActive'+type] = true
    if !props[prop]? then @activePropertiesCount++
    if @isNoop
      @activeInContainer()
      @isNoop = false
    return

  activeInContainer: ->
    container = self = @
    while container
      if !container.isNoop or container.isUpdateRoot
        container.activeOffspring = container.activeChildren or Object.create(null)
        container.activeOffspring[self.dcid] = self
        container.isNoop = false
        return
      container = container.container

  bind: (eventNames, handler, before) ->
    names = eventNames.split('\s+')
    for name in names then @_addEventProp(name, handler, before)
    return

  _addEventProp: (prop, handler, before) ->
    if prop[...2]!='on' then prop = 'on'+prop
    {events} = @
    if typeof handler == 'function' then handler = [handler]
    if !events[prop]
      @addActivity(events, prop, 'Events')
      events[prop] = handler
    else
      if before then events[prop] = handler.concat(events[prop])
      else events[prop] = events[prop].concat(handler)
    @

  unbind: (eventNames, handler) ->
    names = eventNames.split('\s+')
    for name in names then @_removeEventHandlers(name, handler)
    return

  _removeEventHandlers: (eventName, handler) ->
    if !@hasActiveEvents then return @
    if eventName[..1]!='on' then eventName = 'on'+eventName
    {events} = @
    eventHandlers = events[eventName]
    if !eventHandlers then return @
    index = eventHandlers.indexOf(handler)
    if index>=0 then eventHandlers.splice(index, 1)
    if !eventHandlers.length then delete events[eventName]
    @

  addClass: (items...) ->
    @className.extend(items)
    if @className.needUpdate
      @activePropertiesCount++
      @activeInContainer()
    this

  removeClass: (items...) ->
    @className.removeClass(items...)
    if @className.needUpdate
      @activePropertiesCount++
      @activeInContainer()
    this

  show: (display) ->
    if typeof display == 'function'
      display = display()
      if !display? then display = ''
    if !display? then @setProp('display', 'block', @style, @cacheStyle, 'Style')
    else if display=='visible' then @setProp('visibility', 'visible', @style, @cacheStyle, 'Style')
    else @setProp('display', display, @style, @cacheStyle, 'Style')
    @update()
    @

  hide: (display) ->
    if typeof display == 'function'
      display = display()
      if !display? then display = ''
    if !display then @setProp('display', 'none', @style, @cacheStyle, 'Style')
    else if display=='hidden' then @setProp('visibility', 'hidden', @style, @cacheStyle, 'Style')
    else @setProp('display', display, @style, @cacheStyle, 'Style')
    @update()
    @

  showHide: (status, test, display) ->
    {style} = @
    oldDisplay = style.display
    if !oldDisplay then  @addActivity(style, 'display', 'Style')
    style.display = ->
      if (if typeof test == 'function' then !!test() else !!test)==status
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

  showOn: (test, display) -> @showHide(true, test, display)
  hideOn: (test, display) -> @showHide(false, test, display)

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
    @updateProperties()
    {children} = @
    children.render()
    @isNoop = !@activePropertiesCount and !@mountCallbackComponentList.length and children.isNoop
    @

  updateProperties: ->
    if !@activePropertiesCount then return

    {node, className} = @
    @activePropertiesCount--
    if className.needUpdate
      classValue = className()
      if classValue!=@cacheClassName
        @cacheClassName = node.className = classValue

    if @hasActiveProps
      {props, cacheProps} = @
      @hasActiveProps = false
      for prop, value of props
        @activePropertiesCount--
        if typeof value == 'function' then value = value()
        else delete props[prop]
        if !value? then value = ''
        cacheProps[prop] = node[prop] = value

    if @hasActiveStyle
      {style, cacheStyle} = @
      @hasActiveStyle = false
      elementStyle = node.style
      for prop, value of style
        @activePropertiesCount--
        if typeof value == 'function' then value = value()
        else delete style[prop]
        if !value? then value = ''
        cacheStyle[prop] = elementStyle[prop] = value

    if @hasActiveEvents
      {events, cacheEvents} = @
      for prop, value of events
        @activePropertiesCount--
        cacheEvents[prop] = events[prop]
        delete events[prop]
        node[prop] = eventHandlerFromArray(value, node, @)
    @hasActiveEvents = false

    if @hasActiveSpecials
      {specials, cacheSpecials} = @
      @hasActiveSpecials = false
      for prop, value of specials
        @activePropertiesCount--
        if typeof value == 'function' then value = value()
        else delete props[prop]
        if !value? then value = ''
        spercialPropSet[prop](@, prop, value)

    return

  clone: (options=@options) ->
    result = new Tag(@tagName, @attrs, @children.clone(), options or @options)
    result.copyLifeCallback(@)

  toString: (indent=0, noNewLine) ->
    s = newLine("<#{@tagName}", indent, noNewLine)
    for key, value of @props then s += ' '+key+'='+funcString(value)
    if @hasActiveStyle
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