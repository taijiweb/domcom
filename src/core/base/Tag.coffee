extend = require('extend')
{refreshComponents} = dc = require('../../dc')
{domField, domValue} = require('../../dom-util')
{classFn, styleFrom, eventHandlerFromArray, attrToPropName, updating} = require('../property')
BaseComponent = require('./BaseComponent')
{funcString, newLine, cloneObject} = require('dc-util')
{directiveRegistry} = require('../../config')
{flow, react} = require('lazy-flow')

module.exports = class Tag extends BaseComponent
  constructor: (tagName, attrs={}, children) ->

    if this not instanceof Tag
      throw 'should use new SubclassComponent(...) with the subclass of Tag'

    super()
    this.initChildren(children)

    this.isTag = true

    tagName = tagName or 'div'
    this.tagName = tagName.toLowerCase()
    this.namespace = attrs.namespace

    this.initAttrs()
    this.extendAttrs(attrs)

    return

  initAttrs: ->
    me = this

    this.hasActiveProperties = false

    this.cacheClassName = ""
    this.className = className = classFn()
    this.className.onInvalidate ->
      if className.valid
        me.hasActiveProperties = true
        me.invalidate()

    this.cacheProps = {}
    this.props = {}
    this.boundProps = {}
    this['invalidateProps'] = {}
    this.nodeProps = {}

    this.hasActiveNodeAttrs = false
    this.cacheNodeAttrs = {}
    this.nodeAttrs = {}
    this.boundNodeAttrs = {}
    this['invalidateNodeAttrs'] = {}

    this.hasActiveStyle = false
    this.cacheStyle = {}
    this.style = {}
    this.boundStyle = {}
    this['invalidateStyle'] = {}

    this.hasActiveEvents = false
    # maybe this.events is be set in sub class's tag.bind(...) call
    this.events = this.events || {}
    this.eventUpdateConfig = {}

  extendAttrs: (attrs)->

    {className, style, props, nodeAttrs} = this

    for key, value of attrs

      if key=='style'
        # style is this.style
        styles = styleFrom(value)
        for key, value of styles
          this.setProp(key, value, style, 'Style')

      else if key=='class' or key=='className'
        className.extend(value)

      # events and its handler
      else if key[..1]=='on'
        if !value then continue
        else if typeof value == 'function'
          this.bindOne(key, value)
        else
          v0 = value[0]
          if v0=='before' or v0=='after'
            for v in value[1...]
              # value is an array of handlers
              this.bindOne(key, v, v0=='before')
          else
            for v in value
              # value is an array of handlers
              this.bindOne(key, v)

      else if key[0]=='$'
        # $directiveName: generator arguments list
        generator = directiveRegistry[key]
        if value instanceof Array then handler = generator.apply(null, value)
        else handler = generator.apply(null, [value])
        handler(@)

      else if key[..4] == 'attr_'
        @setProp(key[5...], value, nodeAttrs, 'NodeAttrs')

      else @setProp(key, value, props, 'Props')

    @

  prop: (args...) -> @_prop(args, @props, 'Props')

  propBind: (prop) ->  @_propBind([prop], @props, 'Props')

  css: (args...) -> @_prop(args, @style, 'Style')

  cssBind: (prop) ->  @_propBind(prop, @style, 'Style')

  attr: (args...) -> @_prop(args, @nodeAttrs, 'NodeAttrs')

  attrBind: (prop) ->  @_propBind(prop, @nodeAttrs, 'NodeAttrs')

  _propBind: (prop, props, type) ->
    boundProps = this['bound'+type]
    if bound = boundProps[prop]
      bound
    else
      me = this
      boundProps[prop] = react ->
        me._prop(prop, props, type)

  _prop: (args, props, type) ->
    if args.length==0
      return props

    if args.length==1
      prop = args[0]
      if typeof prop == 'string'
        # should return dom value
        value = props[prop]
        if value?
          if typeof value == 'function'
            return domValue(value())
          else return domValue(value)
        else
          return domValue(@['cache'+type][prop])
      else
        for key, v of prop
          @setProp(key, v, props, type)

    else if args.length==2
      if type=='NodeAttrs'
        this.setProp(args[0], args[1], props, type)
      else @setProp(args[0], args[1], props, type)

    this

  setProp: (prop, value, props, type) ->
    prop = attrToPropName(prop)
    value = domField value
    oldValue = props[prop]

    if value==oldValue
      return @

    else if !oldValue?
      if typeof value == 'function'
        me = @
        @['invalidate'+type][prop] = fn = ->
          me.addActivity(props, prop, type, true)
          if bound = me['bound'+type][prop]
            bound.invalidate()
          props[prop] = value
        value.onInvalidate(fn)
        @addActivity(props, prop, type)
        props[prop] = value

      else if value != this['cache'+type][prop]
        @addActivity(props, prop, type)
        if bound = this['bound'+type][prop]
          bound.invalidate()
        props[prop] = value
      # else null # do nothing

    else
      # do not need to check cache
      # do not need check typeof value == 'function'
      if typeof oldValue =='function'
        oldValue.offInvalidate(this['invalidate'+type][prop])
      # else null # do not need to offInvalidate old callback

      if typeof value == 'function'
        me = this
        this['invalidate'+type][prop] = fn = ->
          me.addActivity(props, prop, type, true)
          if bound = me['bound'+type][prop]
            bound.invalidate()
          props[prop] = value
        # value will always be a reactive function after executing "value = domField(value)"
        value.onInvalidate(fn)
      # else null # do not need  value.onInvalidate
      if bound = this['bound'+type][prop]
        bound.invalidate()
      props[prop] = value

    this

  addActivity: (props, prop, type) ->
    @['hasActive'+type] = true
    @hasActiveProperties = true
    if !@node then return
    @invalidate()

  bind: (eventNames, handler, before) ->
    if arguments.length == 1
      for eventName, handler of eventNames
        @bindOne(eventName, handler)
    else
      if !this.events
        this.events = {}
      eventNames = eventNames.split('\s+')
      for eventName in eventNames
        @bindOne(eventName, handler, before)

    @

  bindOne: (eventName, handler, before) ->
    if eventName[...2]!='on' then eventName = 'on'+eventName
    {events} = @
    eventHandlers = events[eventName]
    if !eventHandlers
      events[eventName] = [handler]
      if @node
        @node[eventName] = eventHandlerFromArray(events[eventName], eventName, this)
      else
        @hasActiveEvents = true
        @hasActiveProperties = true
    else
      index = eventHandlers.indexOf(handler)
      if index>=0 then return @
      if before then eventHandlers.unshift.call(eventHandlers, handler)
      else eventHandlers.push.call(eventHandlers, handler)
    @

  unbind: (eventNames, handler) ->
    eventNames = eventNames.split('\s+')
    {events} = @
    for eventName in eventNames
      if eventName[..1]!='on' then eventName = 'on'+eventName
      eventHandlers = events[eventName]
      if !eventHandlers then continue
      index = eventHandlers.indexOf(handler)
      if index>=0
        eventHandlers.splice(index, 1)
        if !eventHandlers.length
          events[eventName] = null
          @node and @node[prop] = null
    @

  addClass: (items...) ->
    @className.extend(items)
    if  @node and !@className.valid
      @hasActiveProperties = true
      @invalidate()
    this

  removeClass: (items...) ->
    @className.removeClass(items...)
    if @node and !@className.valid
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
    dc.update()
    @

  hide: (display) ->
    if typeof display == 'function'
      display = display()
      if !display? then display = ''
    if !display then @setProp('display', 'none', @style, 'Style')
    else if display=='hidden' then @setProp('visibility', 'hidden', @style, 'Style')
    else @setProp('display', display, @style, 'Style')
    dc.update()
    @

  showHide: (status, test, display) ->
    {style} = @
    test = domField(test)
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

  # because dc, tag and List has different behaviour
  # so getChildParentNode is a necessary method
  getChildParentNode: (child) ->
    this.node

  createDom: ->
    this.valid = true

    this.node = node =
      if @namespace then document.createElementNS(@namespace, @tagName)
      else document.createElement(@tagName)
    node.component = this

    @hasActiveProperties and @updateProperties()

    children = this.children
    this.childNodes = childNodes = []
    this.nextNodes = nextNodes = []
    childNodes.length = nextNodes.length = length = children.length
    this.childParentNode = this.node
    this.childNextNode = null
    if length=children.length
      nextNodes[length-1] = null
      @createChildrenDom()

    this.firstNode = node

  refreshDom: ->
    this.valid = true
    if this.hasActiveProperties
      this.updateProperties()
    refreshComponents.call(this)
    this.node

  updateProperties: ->
    @hasActiveProperties = false

    {node, className} = @
    if !className.valid
      classValue = className()
      if classValue!=@cacheClassName
        @cacheClassName = node.className = classValue

    if @hasActiveNodeAttrs
      {nodeAttrs, cacheNodeAttrs} = @
      @hasActiveNodeAttrs = false
      for prop, value of nodeAttrs
        delete nodeAttrs[prop]
        value = domValue(value)
        cacheNodeAttrs[prop] = node[prop] = value
        node.setAttribute(prop, value)

    if @hasActiveProps
      {props, cacheProps} = @
      @hasActiveProps = false
      for prop, value of props
        delete props[prop]
        value = domValue(value)
        cacheProps[prop] = node[prop] = value

    if @hasActiveStyle
      {style, cacheStyle} = @
      @hasActiveStyle = false
      elementStyle = node.style
      for prop, value of style
        delete style[prop]
        value = domValue(value)
        cacheStyle[prop] = elementStyle[prop] = value

    if @hasActiveEvents
      {events} = @
      for eventName, callbackList of events
        node[eventName] = eventHandlerFromArray(callbackList, eventName, @)
    @hasActiveEvents = false

    return

  getPrevChainComponentOf: (child) ->
    children = this.children
    if index = this.dcidIndexMap[child.dcid]
      children[index - 1]
    else  null

  clone: ->
    children = []
    for child in @children
      children.push child.clone()
    new Tag(@tagName, @attrs, children).copyEventListeners(@)

  toString: (indent=0, addNewLine) ->
    s = newLine("<#{@tagName}", indent, addNewLine)

    for key, value of @props
      s += ' '+key+'='+funcString(value)

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

{mixin} = require('dc-util')
ListMixin = require('./ListMixin')
mixin(Tag.prototype, ListMixin)