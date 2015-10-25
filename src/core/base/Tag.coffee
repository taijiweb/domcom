extend = require '../../extend'
dc = require '../../dc'
{classFn, styleFrom, eventHandlerFromArray, attrToPropName, updating} = require '../property'
BaseComponent = require './BaseComponent'
Text = require './Text'
List = require './List'
{funcString, newLine, cloneObject} = require '../../util'
{directiveRegistry} = require '../../config'
{flow} = require '../../flow'
{domValue} = require '../../dom-util'
toComponent = require './toComponent'

module.exports = class Tag extends List
  constructor: (tagName, attrs={}, children) ->
    super(children)

    delete @isList
    @isTag = true

    @tagName = tagName = tagName.toLowerCase()
    @namespace = attrs.namespace
    if !@namespace
      if tagName=='svg' then @namespace = "http://www.w3.org/2000/svg"
      else if tagName=='math' then @namespace = "http://www.w3.org/1998/Math/MathML"

    @attrs = attrs
    @processAttrs()
    return

  processAttrs: ->
    me = @
    @hasActiveProperties = false

    attrs = @attrs
    @cacheClassName = ""
    @className = className = classFn(attrs.className, attrs.class)
    delete attrs.className
    delete attrs['class']
    if !className.valid then @hasActiveProperties = true
    className.onInvalidate ->
      if className.valid
        me.hasActiveProperties = true
        me.invalidate()

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
        generator = directiveRegistry[key]
        if value instanceof Array then handler = generator.apply(null, value)
        else handler = generator.apply(null, [value])
        directives.push(handler)

      else @setProp(key, value, props, 'Props')
    for directive in directives then directive(@)

    return

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
    if !@className.valid
      @hasActiveProperties = true
      @invalidate()
    this

  removeClass: (items...) ->
    @className.removeClass(items...)
    if !@className.valid
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

  createDom: ->
    @node = node =
      if @namespace then document.createElementNS(@namespace, @tagName)
      else document.createElement(@tagName)
    @hasActiveProperties and @updateProperties()

    {children} = @
    for child in children then child.parentNode = node
    if length=children.length then children[length-1].nextNode = null
    @childNodes = []
    # @childrenNextNode = null # do not explicit set, by default this is true
    @createChildrenDom()
    @firstNode = node

    node

  updateDom: ->
    @hasActiveProperties and @updateProperties()
    {children, node, invalidIndexes} = @
    for index in invalidIndexes
      children[index].parentNode = node
    # @childrenNextNode = null # do not explicit set, by default this is true
    @updateChildrenDom()
    @firstNode = @node

  removeDom: ->
    @removeNode()
    @emit('afterRemoveDom')
    @

  attachNode: ->
    node = @node
    if @parentNode == node.parentNode then return node
    @parentNode.insertBefore(node, @nextNode)
    node

  removeNode: ->
    @node.parentNode.removeChild(@node)

  updateProperties: ->
    @hasActiveProperties = false

    {node, className} = @
    if !className.valid
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
      for eventName, callbackList of events
        cacheEvents[eventName] = events[eventName]
        delete events[eventName]
        node[eventName] = eventHandlerFromArray(callbackList, eventName, @)
    @hasActiveEvents = false

    return

  clone: ->
    children = []
    for child in @children
      children.push child.clone()
    new Tag(@tagName, @attrs, children).copyEventListeners(@)

  toString: (indent=0, addNewLine) ->
    s = newLine("<#{@tagName}", indent, addNewLine)
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
    children = @children
    if children.length>1
      for child in @children
        s += child.toString(indent+2, true)
      s += newLine("</#{@tagName}>", indent+2, true)
    else
      if children.length==1
        s += children[0].toString(indent+2)
      s += newLine("</#{@tagName}>", indent+2)