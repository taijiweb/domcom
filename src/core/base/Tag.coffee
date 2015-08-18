extend = require '../../extend'
{insertNode} = require '../../dom-util'
{classFn, styleFrom, updateProp, eventHandlerFromArray, specialPropSet} = require '../property'
{checkContainer} = require '../../util'

BaseComponent = require './BaseComponent'
List = require './List'
{VirtualTag} = require '../virtual-node'

{funcString, newLine} = require '../../util'

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
    @intialized = false
    super(options)
    @children = new List(children, {})

  init: ->
    @processAttrs(@attrs)
    @processDirectives()
    @children.init()
    @initialized = true

  clone: (options=@options) ->
    children = for child in @children.children then child.clone()
    result = new Tag(@tagName, Object.create(null), children, options or @options)
    result.attrs = cloneObject(@attrs)
    result.copyLifeCallback(@)

  processDirectives: ->
    directives = @directives
    if !directives then return @
    if typeof directives == 'function' then return directives(@)
    comp = @
    for directive in directives
      comp = directive(comp)
    comp

  processAttrs: ->
    attrs = @attrs
    @className = classFn(attrs.className, attrs.class)
    delete attrs.className
    @props = props = Object.create(null)
    @style = styleFrom(attrs.style)
    @events = Object.create(null)
    @specials = specials = Object.create(null)
    @directives = []
    for key, value of attrs
      if key[0]=='$'
        @directives.push(Component.directiveRegistry[key.slice(1).apply(null, value)])
      else if key[0]=='_'
        specials[key.slice(1)] = value
      else if key[..1]=='on'
        @addEventProp(key, value)
      else
        if key=='for' then props['htmlFor'] = value
        else props[key] = value
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