extend = require('extend')
{refreshComponents} = dc = require('../../dc')
{domField, domValue} = require('../../dom-util')
{directiveRegistry} = require('../../dc')
classFn = require('../property/classFn')
{styleFrom} = require('../property/style')
{attrToPropName} = require('../property/attrs')
{domEventHandler, addEventListenerMap, addHandlerToCallbackArray} = require('../property/events')
BaseComponent = require('./BaseComponent')
{funcString, newLine, cloneObject} = require('dc-util')
{flow, react} = require('lazy-flow')
toComponentArray = require('./toComponentArray')
{binaryInsert} = require('dc-util')
{createElement, cacheElement} = require('dc-util/element-pool')

module.exports = class Tag extends BaseComponent

  # used for Tag.clone(...)
  FakeTag: -> Tag

  constructor: (tagName, attrs={}, children) ->

    if !(this instanceof Tag)
      throw 'should use new SubclassComponent(...) with the subclass of Tag'

    super()

    this.isTag = true

    tagName = tagName || attrs.tagName || 'div'
    delete attrs.tagName
    this.tagName = tagName.toLowerCase()
    this.namespace = attrs.namespace
    this.poolLabel = this.generatePoolLabel()

    # initChildren must put before extendAttrs
    this.children = toComponentArray(children)
    this.initListMixin()
    this.initProperties()
    this.extendAttrs(attrs)
    return

  initProperties: ->
    this.hasActiveProperties = false

    this.cacheClassName = ""
    this.className = className = classFn()
    me = this
    this.className.onInvalidate ->
      if className.valid
        me.hasActiveProperties = true
        me.invalidate()

    this.hasActiveProps = false
    this.cacheProps = {}
    this.props = {}
    this.boundProps = {}
    this['invalidateProps'] = {}

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

    this.hasActiveDomEvents = this.hasActiveDomEvents || false
    if !this.domEventCallbackMap
      this.domEventCallbackMap = {}
    this.eventUpdateConfig = {}
    return

  extendAttrs: (attrs)->

    {className, style, props, nodeAttrs} = this

    for key, value of attrs


      if key=='style'
        # style is this.style
        styles = styleFrom(value)
        for key, value of styles
          this.setProp(key, value, style, 'Style')

      else if key=='class' || key=='className'
        this.hasActiveProperties = true
        className.extend(value)

      # dom event
      else if key[..1]=='on'
        if !value then continue
        else if typeof value == 'function'
          this.bindOne(key, value)
        else
          v0 = value[0]
          if v0=='before' || v0=='after'
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
        handler(this)

      else if key[..4] == 'attr_'
        this.setProp(key[5...], value, nodeAttrs, 'NodeAttrs')

      else if key[..2] == 'xxx'
        continue

      else this.setProp(key, value, props, 'Props')

    this

  prop: (args...) ->
    this._prop(args, this.props, 'Props')

  css: (args...) ->
    this._prop(args, this.style, 'Style')

  attr: (args...) ->
    this._prop(args, this.nodeAttrs, 'NodeAttrs')

  _prop: (args, props, type) ->
    if args.length==0
      return props

    if args.length==1
      prop = args[0]
      if typeof prop == 'string'
        if props.hasOwnProperty(prop)
          return domValue(props[prop], this)
        else
          return this['cache'+type][prop]
      else
        for key, v of prop
          this.setProp(key, v, props, type)

    else if args.length==2
      if type=='NodeAttrs'
        this.setProp(args[0], args[1], props, type)
      else this.setProp(args[0], args[1], props, type)

    this

  setProp: (prop, value, props, type) ->
    prop = attrToPropName(prop)
    value = domField(value, this)
    oldValue = props[prop]

    if value==oldValue
      return this

    else if !oldValue?
      if typeof value == 'function'
        me = this
        this['invalidate'+type][prop] = fn = ->
          me.addActivity(props, prop, type, true)
          if bound = me['bound'+type][prop]
            bound.invalidate()
          props[prop] = value
        value.onInvalidate(fn)
        this.addActivity(props, prop, type)
        props[prop] = value

      else if value != this['cache'+type][prop]
        this.addActivity(props, prop, type)
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
        # value will always be a reactive function after executing "value = domField(value, this)"
        value.onInvalidate(fn)
      # else null # do not need  value.onInvalidate
      if bound = this['bound'+type][prop]
        bound.invalidate()
      props[prop] = value

    this

  propBind: (prop) ->  this._propBind(prop, this.props, 'Props')
  cssBind: (prop) ->  this._propBind(prop, this.style, 'Style')
  attrBind: (prop) ->  this._propBind(prop, this.nodeAttrs, 'NodeAttrs')

  _propBind: (prop, props, type) ->
    boundProps = this['bound'+type]
    if bound = boundProps[prop]
      bound
    else
      boundProps[prop] = react ->
        this._prop([prop], props, type)

  addActivity: (props, prop, type) ->
    this['hasActive'+type] = true
    this.hasActiveProperties = true
    if !this.node then return
    this.invalidate()

  bind: (eventNames, handler, before) ->
    if !this.domEventCallbackMap
      this.domEventCallbackMap = {}
    if arguments.length == 1
      for eventName, handler of eventNames
        this.bind(eventName, handler)
    else
      [eventNames, isBefore] = eventNames.split(/\s*:\s*/)
      eventNames = eventNames.split(/\s+/)
      for eventName in eventNames
        this.bindOne(eventName, handler, before || isBefore)
    this

  bindOne: (eventName, handler, before) ->
    if !handler
      dc.error('Tag.bind: handler is undefined for event: '+ eventName)

    if eventName[...2]!='on'
      eventName = 'on'+eventName
    domEventCallbackMap = this.domEventCallbackMap || this.domEventCallbackMap = {}
    domEventCallbacks = domEventCallbackMap[eventName] || domEventCallbackMap[eventName] = []
    if this.node
      # the event in addEventListenerMap do not execute node[eventName]
      # e.g. https://developer.mozilla.org/en/docs/Web/Events/compositionstart
      # [2] The event was fired in versions of Gecko before 9.0, but didn't have the DOM Level 3 attributes and methods.
      # so it's necessary to addEventListener
      if addEventListenerMap[eventName]
        node.addEventListener(eventName[2...], domEventHandler)
      else
        this.node[eventName] = domEventHandler
    else
      this.hasActiveDomEvents = true
      this.hasActiveProperties = true
    addHandlerToCallbackArray(handler, domEventCallbacks, before)
    this

  unbind: (eventNames, handler) ->
    eventNames = eventNames.split('\s+')
    domEventCallbackMap = this.domEventCallbackMap
    for eventName in eventNames
      if eventName[..1]!='on' then eventName = 'on'+eventName
      domEventCallbacks = domEventCallbackMap[eventName]
      if !domEventCallbacks then continue
      index = domEventCallbacks.indexOf(handler)
      if index>=0
        domEventCallbacks.splice(index, 1)
        if !domEventCallbacks.length
          domEventCallbackMap[eventName] = null
          if node = this.node
            node[prop] = null
            node.removeEventListener(domEventHandler)
    this

  addClass: (items...) ->
    this.className.extend(items)
    if  this.node && !this.className.valid
      this.hasActiveProperties = true
      this.invalidate()
    this

  removeClass: (items...) ->
    this.className.removeClass(items...)
    if this.node && !this.className.valid
      this.hasActiveProperties = true
      this.invalidate()
    this

  show: (display) ->
    if typeof display == 'function'
      display = display()
      if !display?
        display = ''

    if !display?
      this.setProp('display', 'block', this.style, 'Style')
    else if display=='visible'
      this.setProp('visibility', 'visible', this.style, 'Style')
    else
      this.setProp('display', display, this.style, 'Style')
    this

  hide: (display) ->
    if typeof display == 'function'
      display = display()
      if !display?
        display = ''

    if !display
      this.setProp('display', 'none', this.style, 'Style')
    else if display=='hidden'
      this.setProp('visibility', 'hidden', this.style, 'Style')
    else
      this.setProp('display', display, this.style, 'Style')
    this

  showHide: (status, test, display) ->
    {style} = this
    test = domField(test, this)
    oldDisplay = style.display
    if !oldDisplay
      this.addActivity(style, 'display', 'Style', this.node)
    else if typeof oldDisplay =='function' && oldDisplay.offInvalidate
      oldDisplay.offInvalidate(this.invalidateStyle.display)
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
    this.invalidateStyle.display = fn = ->
      me.addActivity(style, 'display', 'Style', true)
      style.display = method
    method.onInvalidate fn
    this.style = style
    this

  refreshDom: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)
    this.attachParent()
    return

  createDom: ->
    this.valid = true
    this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel)
    node.component = this

    this.updateProperties()
    this.createChildrenDom()
    this.attachChildren()
    this.valid = !this.hasActiveProperties && !this.updatingChildren.length # && !this.attachParentIndexes.length
    node

  updateDom: ->
    this.valid = true
    this.updateProperties()
    this.updateChildrenDom()
    this.attachChildren()
    this.valid = !this.hasActiveProperties && !this.updatingChildren.length # && !this.attachParentIndexes.length
    this.node

  invalidateAttach: (child) ->
    index = this.children.indexOf(child)
    binaryInsert(index, this.attachParentIndexes)
    if this.holder
      if this.attachValid && this.valid
        this.holder.invalidateContent(this)
      this.valid = false
      this.attachValid = false
    this

  updateProperties: ->
    if !this.hasActiveProperties
      return

    this.hasActiveProperties = false

    {node, className} = this
    if !className.valid
      classValue = className.call(this)
      if classValue!=this.cacheClassName
        this.cacheClassName = node.className = classValue

    if this.hasActiveNodeAttrs
      {nodeAttrs, cacheNodeAttrs} = this
      this.hasActiveNodeAttrs = false
      for prop, value of nodeAttrs
        delete nodeAttrs[prop]
        value = domValue(value, this)
        cacheNodeAttrs[prop] = node[prop] = value
        node.setAttribute(prop, value)

    if this.hasActiveProps
      {props, cacheProps} = this
      this.hasActiveProps = false
      for prop, value of props
        delete props[prop]
        value = domValue(value, this)
        cacheProps[prop] = node[prop] = value

    if this.hasActiveStyle
      {style, cacheStyle} = this
      this.hasActiveStyle = false
      elementStyle = node.style
      for prop, value of style
        delete style[prop]
        value = domValue(value, this)
        cacheStyle[prop] = elementStyle[prop] = value

    if this.hasActiveDomEvents
      for eventName, callbackList of this.domEventCallbackMap
        if callbackList && callbackList.length
          # the event in addEventListenerMap do not execute node[eventName]
          # e.g. https://developer.mozilla.org/en/docs/Web/Events/compositionstart
          # [2] The event was fired in versions of Gecko before 9.0, but didn't have the DOM Level 3 attributes and methods.
          # so it's necessary to addEventListener
          if addEventListenerMap[eventName]
            node.addEventListener(eventName[2...], domEventHandler)
          else
            node[eventName] = domEventHandler
    this.hasActiveDomEvents = false

    return

  setPoolLabel: (poolLabel) ->
    this.poolLabel = poolLabel
    this

  generatePoolLabel: -> ''

  destroy: ->
    if this.poolLabel && node = this.node
      cacheElement(node, this.poolLabel)
    super()
    if this.poolLabel && node
      node.innerHTML = ''
    this

  clone: (options) ->
    attrs = {className: this.className.clone(), style: extend({}, this.cacheStyle, this.style)}
    extend(attrs, this.cacheProps, this.props, this.cacheNodeAttrs, this.nodeAttrs)
    for eventName, domEventCallbacks of this.domEventCallbackMap
      attrs[eventName] = domEventCallbacks[...]

    FakeTag = this.FakeTag()
    result = new FakeTag(this.tagName, attrs, [])
    result.__proto__ = this.__proto__
    result.constructor = this.constructor
    result.cloneChildrenFrom(this, options)
    result.copyEventListeners(this)
    result.setupCloneComponent(this, options)

  setupCloneComponent: (srcTag, options) ->
    this.setReactive()

  toString: (indent=0, addNewLine) ->
    s = newLine("<#{this.tagName}", indent, addNewLine)

    for key, value of this.props
      s += ' '+key+'='+funcString(value)

    if this.hasActiveStyle
      s += ' style={'
      for key, value of this.style
        if typeof value =='string'
          s += value
        else for key, v of  value
          s += ' '+key+'='+funcString(v)
      s += '}'

    s += '>'
    children = this.children

    if children.length>1
      for child in this.children
        s += child.toString(indent+2, true)
      s += newLine("</#{this.tagName}>", indent+2, true)
    else
      if children.length==1
        s += children[0].toString(indent+2)
      s += newLine("</#{this.tagName}>", indent+2)

{mixin} = require('dc-util')
ListMixin = require('./ListMixin')
mixin(Tag.prototype, ListMixin)