extend = require '../../extend'
{insertNode} = require '../../dom-util'
dc = require '../../dc'
{classFn, styleFrom, eventHandlerFromArray, attrToPropName, updating} = require '../property'
BaseComponent = require './BaseComponent'
List = require './List'
{funcString, newLine, cloneObject} = require '../../util'
{flow} = require '../../flow'
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
        children = toComponent(children[0])
      else if children.length==0
        children = new Nothing()
      else children = new List(children, {})
    else children = toComponent(children)
    children.holder = children.container = @
    @children = children
    @processAttrs()
    @firstNodeComponent = @lastNodeComponent = @
    return

  processAttrs: ->
    me = @
    @hasActiveProperties = false
    attrs = @attrs
    @cacheClassName = ""
    @className = className = classFn(attrs.className, attrs.class)
    delete attrs.className
    delete attrs['class']
    if className.invalid then @hasActiveProperties = true
    className.onInvalidate ->
      if !className.invalid
        me.hasActiveProperties = true
        me.invalidate()
        me.noop = false
    @hasActiveProps = false
    @cacheProps = Object.create(null)
    @props = props = Object.create(null)
    @['invalidateProps'] = Object.create(null)
    @hasActiveStyle = false
    @cacheStyle = Object.create(null)
    @style = style = Object.create(null)
    @['invalidateStyle'] = Object.create(null)
    attrStyle = styleFrom(attrs.style)
    for key, value of attrStyle then @setProp(key, value, style, 'Style')
    delete attrs.style
    @hasActiveEvents = false
    @cacheEvents = Object.create(null)
    @events = events = Object.create(null)
    @eventUpdateConfig = Object.create(null)
    @hasActiveSpecials = false
    @cacheSpecials = Object.create(null)
    @['invalidateSpecials'] = Object.create(null)
    @specials = specials = Object.create(null)
    directives = []
    for key, value of attrs
      if key[..1]=='on'
        if typeof value == 'function'
          events[key] = [value]
        else events[key] = value
        @hasActiveEvents = true
        @hasActiveProperties = true
      else if key[0]=='$'
        # $directiveName: generator arguments list
        generator = _directiveRegistry[key]
        if value instanceof Array then handler = generator.apply(null, value)
        else handler = generator.apply(null, [value])
        directives.push(handler)
      else if key[0]=='_' then @setProp(key, value, specials, 'Specials')
      else @setProp(key, value, props, 'Props')
    for directive in directives then directive(@)
    return

  getBaseComponent: ->
    @mountCallbackComponentList = if @mountCallbackList then [@] else []
    @unmountCallbackComponentList = if @unmountCallbackList then [@] else []
    @

  prop: (args...) -> @_prop(args, @props, 'Props')

  css: (args...) -> @_prop(args, @style, 'Style')

  _prop: (args, props, type) ->
    if args.length==0 then return props
    if args.length==1
      prop = args[0]
      if typeof prop == 'string' then return props[prop]
      for key, v of prop
        @setProp(key, v, props, type)
    else if args.length==2
      @setProp(args[0], args[1], props, type)
    this

  setProp: (prop, value, props, type) ->
    prop = attrToPropName(prop)
    value = domValue value
    oldValue = props[prop]
    if !oldValue?
      if typeof value == 'function'
        @addActivity(props, prop, type)
      else if value!=@['cache'+type][prop]
          @addActivity(props, prop, type)
    else
      # do not need to check cache
      # do not need check typeof value == 'function'
      if typeof oldValue =='function'
        oldValue.offInvalidate(@['invalidate'+type][prop])
    if typeof value == 'function'
      me = @
      @['invalidate'+type][prop] = fn = ->
        me.addActivity(props, prop, type, true)
        props[prop] = value
      value.onInvalidate(fn)
    props[prop] = value
    return

  addActivity: (props, prop, type) ->
    @['hasActive'+type] = true
    @hasActiveProperties = true
    if !@node then return
    @invalidate()

  bind: (eventNames, handler, before) ->
    names = eventNames.split('\s+')
    for name in names then @_addEventProp(name, handler, before)
    @

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
    @

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
    if @className.invalid
      @hasActiveProperties = true
      @invalidate()
    this

  removeClass: (items...) ->
    @className.removeClass(items...)
    if @className.invalid
      @hasActiveProperties = true
      @invalidate()
    this

  show: (display) ->
    if typeof display == 'function'
      display = display()
      if !display? then display = ''
    if !display? then @setProp('display', 'block', @style, 'Style')
    else if display=='visible' then @setProp('visibility', 'visible', @style, 'Style')
    else @setProp('display', display, @style, 'Style')
    @update()
    @

  hide: (display) ->
    if typeof display == 'function'
      display = display()
      if !display? then display = ''
    if !display then @setProp('display', 'none', @style, 'Style')
    else if display=='hidden' then @setProp('visibility', 'hidden', @style, 'Style')
    else @setProp('display', display, @style, 'Style')
    @update()
    @

  showHide: (status, test, display) ->
    {style} = @
    test = domValue(test)
    oldDisplay = style.display
    if !oldDisplay then  @addActivity(style, 'display', 'Style', @node)
    else if typeof oldDisplay =='function' and oldDisplay.offInvalidate
      oldDisplay.offInvalidate(@invalidateStyle.display)
    style.display = method = flow test, oldDisplay, ->
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
    me = this
    @invalidateStyle.display = fn = ->
      me.addActivity(style, 'display', 'Style', true)
      style.display = method
    method.onInvalidate fn
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
    @noop = true
    @firstNode = @lastNode = @node = node =
      if @namespace then document.createElementNS(@namespace, @tagName)
      else document.createElement(@tagName)
    @updateProperties()
    @resetContainerHookUpdater()
    {children} = @
    children.parentNode = node
    children.render(true) # need mounting
    if compList=children.baseComponent.unmountCallbackComponentList
      @unmountCallbackComponentList = compList.concat(@unmountCallbackComponentList)
    @

  updateDom: (mounting) ->
    @noop = true
    @updateProperties()
    @resetContainerHookUpdater()
    @updateOffspring()

  updateProperties: ->
    if !@hasActiveProperties then return

    @hasActiveProperties = false

    {node, className} = @
    if className.invalid

      classValue = className()
      if classValue!=@cacheClassName
        @cacheClassName = node.className = classValue

    if @hasActiveProps
      {props, cacheProps} = @
      @hasActiveProps = false
      for prop, value of props
        delete props[prop]
        if typeof value == 'function' then value = value()
        if !value? then value = ''
        cacheProps[prop] = node[prop] = value

    if @hasActiveStyle
      {style, cacheStyle} = @
      @hasActiveStyle = false
      elementStyle = node.style
      for prop, value of style
        delete style[prop]
        if typeof value == 'function' then value = value()
        if !value? then value = ''
        cacheStyle[prop] = elementStyle[prop] = value

    if @hasActiveEvents
      {events, cacheEvents} = @
      for prop, value of events
        cacheEvents[prop] = events[prop]
        delete events[prop]
        node[prop] = eventHandlerFromArray(value, prop, @)
    @hasActiveEvents = false

    if @hasActiveSpecials
      {specials, cacheSpecials} = @
      @hasActiveSpecials = false
      for prop, value of specials
        delete props[prop]
        if typeof value == 'function' then value = value()
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