extend = require '../../extend'
{insertNode} = require '../../dom-util'
{classFn, styleFrom, updateProp, _specialProperties} = require '../property'
{cloneObject} = require '../../util'

BaseComponent = require './BaseComponent'
List = require './List'
{VirtualTag} = require '../virtual-node'

{funcString, newLine} = require '../../util'
{_directiveRegistry} = require '../../directives/register'

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

  clone: (options=@options) ->
    children = for child in @children.children then child.clone()
    result = new Tag(@tagName, Object.create(null), children, options or @options)
    result.attrs = cloneObject(@attrs)
    result.copyLifeCallback(@)

  init: ->
    if @initialized then return @
    @processDirectives()
    @processAttrs(@attrs)
    #@children.init()
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

  firstNode: -> @node

  getVirtualTree: ->
    if vtree=@vtree
      vtree.srcComponents = []
      vtree
    else
      @init()
      @vtree = vtree = new VirtualTag(@, @children.getVirtualTree())
      vtree

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
        if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
    this

  removeClass: (classes...) ->
    assertNotInitialized()
    if !@className then return this
    needUpdate = @className.needUpdate
    @className.removeClass(classes...)
    if !needUpdate and @className.needUpdate
      @activePropertiesCount++
      if vtree=@vtree then vtree.isNoop = vtree.isPlaceHolder = false
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
    for child in @children.children
      s += child.toString(indent+2)
    s += newLine("</#{@tagName}>", indent+2, 'noNewLine')