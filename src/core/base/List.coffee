toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
Ref = require './Ref'
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
      child.container and !child.isRef and child = new Ref(child, @, i)
      child.holder = @
      child.container = @
    @isList = true
    @length = children.length
    return

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  setChildren: (startIndex, newChildren...) ->
    children = @children
    newChildren = for child in newChildren
      child = toComponent child
      if child.container
        child = new Ref(child, @, i)
      child.holder = child.container = @
      child
    newChildrenLength = newChildren.length
    if !@node
      children.splice(startIndex, newChildrenLength, newChildren...)
      @length = children.length
      return @
    if startIndex<children.length
      throw new Error 'do not allow set children after the Dom of List Component was created'
    i = startIndex; j = 0
    while j<newChildrenLength
      child = children[i]
      if child # maybe newChildren will be more than the left children
        if child.mounted then child.unmount()
      child = children[i] = newChildren[j]
      child.holder = @
      child.listIndex = @
      i++; j++
    @length = children.length
    first = newChildren[0]
    [_, prev] = getFirstLastComponent(children.slice(0, startIndex))
    first.prevNodeComponent = prev
    prev and prev.nextNodeComponent = first
    last = newChildren[newChildrenLength-1]
    [next, _] = getFirstLastComponent(children.slice(i))
    next and next.prevNodeComponent = last
    last.nextNodeComponent = next
    @

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
    return

  updateDom: (mounting) ->
    @resetContainerHookUpdater()
    @updateOffspring(mounting)
    @children.length = @length

  getNode: -> for child in @children then child.getNode()

  attachNode: ->
    @unmounted = false
    # children will attach themself

  removeNode: ->
    if !@parentNode or @unmounted then return
    for child in @children
      child.baseComponent.removeNode()
    return

  insertChild: (index, child) ->
    children = @children
    if !@node
      child = toComponent(child, @, index)
      if child.container
        child = new Ref(child, container, i)
      children.splice(index, 0, child)
      @length++
      return @
    throw new Error 'do not allow set children after the Dom of List Component was created'
    i = index+1; length = children.length
    @length = length
    while i<length
      children[i].listIndex = i
    first = child.baseComponent.firstNodeComponent
    if first
      [_, prev] = getFirstLastComponent(children.slice(0, startIndex))
      first.prevNodeComponent = prev
      prev and prev.nextNodeComponent = first
      [next, _] = getFirstLastComponent(children.slice(i))
      next and next.prevNodeComponent = last
      last.nextNodeComponent = next


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

  toString: (indent=0, noNewLine) ->
    s = newLine("<List>", indent, noNewLine)
    for child in @children
      s += child.toString(indent+2)
    s += newLine('</List>', indent)