{newLine} = require('dc-util')

{addEventListener, removeEventListener} = require('./dom-util')

processProp = (props, cache, prop, value) ->
  if !prop?
    return props
  else if !value?
    if typeof prop == 'string'
      props[prop]
    else
      for p, value in prop
        if !cacheProps[p]? || value!=cacheProps[p]
          cacheProps[p] = props[p] = value
      return
  else
    if !cacheProps[prop]? || value!=cacheProps[prop]
      cacheProps[prop] = this.node[prop] = value

module.exports = class DomNode
  constructor: (@node) ->
    if node instanceof Node
      this.cacheProps = {}
      this.cacheStyle = {}
    else
      this.cacheProps = for n in this.node then {}
      this.cacheStyle = for n in this.node then {}

  prop: (prop, value) ->
    {node} = this
    if node instanceof Node
      processProp(node, this.cacheProps, prop, value)
    else
      for n, i in node
        processProp(n, this.cacheProps[i], prop, value)
    this

  css: (prop, value) ->
    node = this.node
    if node instanceof Node
      processProp(node.style, this.cacheStyle, prop, value)
    else
      for n, i in node
        processProp(n.style, this.cacheStyle[i], prop, value)
    this

  bind: (eventNames, handler) ->
    node = this.node
    for name in eventNames.split(/\s+/)
      if name[..1]=='on' then name = name[2...]
      if node instanceof Node
        addEventListener(node, name, handler)
      else for n in node
        addEventListener(n, name, handler)
    return

  unbind: (eventNames, handler) ->
    node = this.node
    for name in eventNames.split(/\s+/)
      if name[..1]=='on' then name = name[2...]
      if node instanceof Node
        removeEventListener(node, name, handler)
      else for n in node
        removeEventListener(n, name, handler)
    return

  toString: (indent=0, addNewLine) ->
    newLine('', indent, addNewLine)+'<DomNode>'+newLine(this.node.toString(), indent+2, true)+newLine('</DomNode>', indent, true)