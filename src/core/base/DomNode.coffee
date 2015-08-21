Tag = require './Tag'
{VirtualDomNode} = require '../virtual-node'
BaseComponent = require './BaseComponent'
{newLine} = require '../../util'

module.exports = class DomNode extends Tag
  constructor: (@node, attrs, options) ->
    @tagName = if node.tagName then node.tagName.toLowerCase() else ''
    @namespace = node.namespace
    @isTag = true
    BaseComponent.constructor.call(@, options)

  init: ->
    if @initialized then return
    @processDirectives()
    @processAttrs(attrs)
    @initialized = true

  getVirtualTree: ->
    if @vtree then @vtree
    else
      @init()
      @vtree = @_vtree = new VirtualDomNode(@, [])

  css: (prop, value) ->
    # for performance: use cacheStyle to avoid accessing dom
    if arguments.length==0 then return @cacheStyle
    if arguments.length==1
      if typeof prop == 'string' then return @cacheStyle[prop]
      else
        {cacheStyle, style, node} = @
        nodeStyle = node.style
        for prop, value in prop
          style[prop] = value
          cacheStyle[prop] = cacheStyle[prop] or nodeStyle[prop]
    else if arguments.length==2
      @style[prop] = value
      @cacheStyle[prop] = @cacheStyle[prop] or @node.style.display
    this

  show: (showDisplay) ->
    display = @style.display = @styleDisplayOfShow(true, showDisplay)
    @cacheStyle.display = @cacheStyle.display or @node.style.display

  hide: (showDisplay) ->
    display = @style.display = @styleDisplayOfShow(false, showDisplay)
    cacheStyle.display = cacheStyle.display or @node.style.display

  toString: (indent=0, noNewLine) ->
    newLine(indent, noNewLine)+'<DomNode>'+newLine(@node.toString(), indent+2)+newLine('</DomNode>', indent)