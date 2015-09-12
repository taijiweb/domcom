toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
{checkContainer} = require '../../util'
{newLine} = require '../../util'

module.exports = exports = class List extends BaseComponent
  constructor: (@children, options) ->
    options = options or {}
    for child, i in children
      child = toComponent(child)
      children[i] = child
      child.container = @
      child.listIndex = i
    @isList = true
    super(options)
    return

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  createDom: ->
    @resetHolderHookUpdater()
    children = @children
    listLength = children.length
    for child, i in children
      child.parentNode = @parentNode
      child.render(true)
    length = children.length
    i = 0
    while i < length-1
      lastNodeComponent = children[i].baseComponent.lastNodeComponent
      if !lastNodeComponent then i++; continue
      last = lastNodeComponent
      j = i+1
      while j<length
        firstNodeComponent = children[j].baseComponent.firstNodeComponent
        if firstNodeComponent
          last = children[j].baseComponent.lastNodeComponent
          break
        j++
      if !firstNodeComponent then break
      lastNodeComponent.nextNodeComponent = firstNodeComponent
      i = j
    @lastNodeComponent = last
    i = length-1
    while i
      firstNodeComponent = children[i].baseComponent.firstNodeComponent
      if !firstNodeComponent then i--; continue
      first = firstNodeComponent
      j = i-1
      while j>=0
        lastNodeComponent = children[j].baseComponent.lastNodeComponent
        if lastNodeComponent
          first = children[j].baseComponent.firstNodeComponent
          break
        j--
      if !lastNodeComponent then break
      firstNodeComponent.prevNodeComponent = lastNodeComponent
      i = j
    @firstNodeComponent = first
    @node = true # prevent createDom this List again
    return

  updateDom: (mounting) ->
    @resetHolderHookUpdater()
    @updateOffspring(mounting)

  getNode: -> for child in @children then child.getNode()

  attachNode: -> # children will attach themself

  removeNode: ->
    parentNode = @parentNode
    for node in @getNode()
      parentNode.removeChild(node)

  removeChild: (index, notSetFirstLast) ->
    children = @children
    removedChild = children[index]
    children.splice(index, 1)
    childrenLengh = children.length
    while index<childrenLengh
      children[index].listIndex = index
      index++
    if !notSetFirstLast then @setFirstLast(removedChild.baseComponent)

  setFirstLast: (removed, replaced) ->
    removedFirst = removed.firstNodeComponent
    if !removedFirst then return
    if removedFirst==@firstNodeComponent
      newFirst = replaced and replaced.firstNodeComponent or removed.nextNodeComponent
      @firstNodeComponent = newFirst
      me = @; container = @container
      while me.listIndex
        if removedFirst!=container.firstNodeComponent then break
        container.firstNodeComponent = newFirst
        me = container; container = @container
    removedLast = removed.lastNodeComponent
    if !removedLast then return
    if removedLast==@lastNodeComponent
      newLast = replaced and replaced.lastNodeComponent or removed.prevNodeComponent
      @lastNodeComponent = newLast
      me = @; container = @container
      while me.listIndex
        if removedLast==container.lastNodeComponent then break
        container.firstNodeComponent = newLast
        me = container; container = @container
    return

  toString: (indent=0, noNewLine) ->
    s = newLine("<List>", indent, noNewLine)
    for child in @children
      s += child.toString(indent+2)
    s += newLine('</List>', indent)