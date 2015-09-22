toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
{checkContainer, newLine} = require '../../util'
{checkConflictOffspring} = require '../../dom-util'

getFirstLastComponent = (children) ->
  length = children.length
  if !length then return [null, null]
  if length==1
    baseComponent = children[0].baseComponent
    return [baseComponent.firstNodeComponent, baseComponent.lastNodeComponent]
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
  [first, last]

module.exports = exports = class List extends BaseComponent
  constructor: (@children, options) ->
    options = options or {}
    super(options)
    @family = family = Object.create(null)
    family[@dcid] = true
    for child, i in children
      children[i] = child = toComponent(child)
      checkConflictOffspring(family, child)
      child.setRefContainer(@)
    @isList = true
    @length = children.length
    return

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  setChildren: (startIndex, newChildren...) ->
    if @node and startIndex<children.length
      throw new Error 'do not allow set children after the Dom of List Component was created'
    children = @children
    newChildren = for child in newChildren
      child = toComponent child
      child.setRefContainer(@)
      child.holder = @
      child
    newChildrenLength = newChildren.length
    children.splice(startIndex, newChildrenLength, newChildren...)
    @length = children.length
    return @

  createDom: ->
    @resetContainerHookUpdater()
    children = @children
    listLength = children.length
    for child, i in children
      child.listIndex = i
      child.parentNode = @parentNode
      child.render(true)
    @node = true # prevent createDom this List again
    [first, last] = getFirstLastComponent(children)
    @firstNodeComponent = first
    @lastNodeComponent = last
    @created = true
    return

  updateDom: (mounting) ->
    @resetContainerHookUpdater()
    @updateOffspring(mounting)
    @children.length = @length

  getNode: -> for child in @children then child.getNode()

  attachNode: ->
    @unmounted = false
    if !@parentNode then return
    container = @container
    if container and container.isList and (!container.created or container.detached)
      return
    @parentNode.insertBefore(@node, nextNode)

  removeNode: ->
    if !@parentNode or @unmounted then return
    for child in @children
      child.baseComponent.removeNode()
    return

  insertChild: (index, child) ->
    if @node
      throw new Error 'do not allow set children after the Dom of List Component was created'
    children = @children
    child = toComponent(child, @, index)
    child.setRefContainer(container)
    children.splice(index, 0, child)
    @length++
    @

  removeChild: (index, notSetFirstLast) ->
    children = @children
    removedChild = children[index]
    children.splice(index, 1)
    childrenLengh = children.length
    while index<childrenLengh
      children[index].listIndex = index
      index++
    if !notSetFirstLast then @setFirstLast(removedChild.baseComponent)
    @

  setFirstLast: (removed, replaced) ->
    removedFirst = removed.firstNodeComponent
    if !removedFirst then return
    if removedFirst==@firstNodeComponent
      newFirst = replaced and replaced.firstNodeComponent or removed.nextNodeComponent
      @firstNodeComponent = newFirst
      me = @; holder = @holder
      while me.listIndex
        if removedFirst!=holder.firstNodeComponent then break
        holder.firstNodeComponent = newFirst
        me = holder; holder = @holder
    removedLast = removed.lastNodeComponent
    if !removedLast then return
    if removedLast==@lastNodeComponent
      newLast = replaced and replaced.lastNodeComponent or removed.prevNodeComponent
      @lastNodeComponent = newLast
      me = @; holder = @holder
      while me.listIndex
        if removedLast==holder.lastNodeComponent then break
        holder.firstNodeComponent = newLast
        me = holder; holder = @holder
    return

  getFirstNodeComponent: ->
    children = @children; len = children.length; i = 0
    while i<len
      child = children[i]
      if child.node and child.detached
        first = children[i].getFirstNodeComponent()
      i++
    first

  getLastNodeCompnent: ->
    children = @children; len = children.length; i = 0
    while i<len
      last = children[i].getLastNodeComponent()
    last

  toString: (indent=0, noNewLine) ->
    s = newLine("<List>", indent, noNewLine)
    for child in @children
      s += child.toString(indent+2)
    s += newLine('</List>', indent)