{newLine} = require 'dc-util'

{addEventListener, removeEventListener} = require './dom-util'

processProp = (props, cache, prop, value) ->
  if !prop? then return props
  if !value?
    if typeof prop == 'string' then return props[prop]
    else
      for p, value in prop
        if !cacheProps[p]? or value!=cacheProps[p]
          cacheProps[p] = props[p] = value
  else
    if !cacheProps[prop]? or value!=cacheProps[prop]
      cacheProps[prop] = @node[prop] = value

module.exports = class DomNode
  constructor: (@node) ->
    if node instanceof Node
      @cacheProps = {}
      @cacheStyle = {}
    else
      @cacheProps = for n in @node then {}
      @cacheStyle = for n in @node then {}

  prop: (prop, value) ->
    {node} = @
    if node instanceof Node
      processProp(node, @cacheProps, prop, value)
    else
      for n, i in node
        processProp(n, @cacheProps[i], prop, value)
    this

  css: (prop, value) ->
    {node} = @
    if node instanceof Node
      processProp(node.style, @cacheStyle, prop, value)
    else
      for n, i in node
        processProp(n.style, @cacheStyle[i], prop, value)
    this

  bind: (eventNames, handler) ->
    names = eventNames.split(/\s+/)
    {node} = @
    for name in names
      if name[..1]=='on' then name = name[2...]
      if node instanceof Node
        addEventListener(node, name, handler)
      else for n in node
        addEventListener(n, name, handler)
    return

  unbind: (eventNames, handler) ->
    names = eventNames.split(/\s+/)
    {node} = @
    for name in names
      if name[..1]=='on' then name = name[2...]
      if node instanceof Node
        removeEventListener(node, name, handler)
      else for n in node
        removeEventListener(n, name, handler)
    return

  toString: (indent=0, addNewLine) ->
    newLine('', indent, addNewLine)+'<DomNode>'+newLine(@node.toString(), indent+2, true)+newLine('</DomNode>', indent, true)