toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
{checkContainer, newLine} = require '../../util'
{checkConflictOffspring, insertNode} = require '../../dom-util'

module.exports = exports = class List extends BaseComponent
  constructor: (children, options) ->
    if !children.length then return new Text('')
    @children = children
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
    {children, created} = @
    if created
      throw new Error 'do not allow set children after the Dom of List Component was created'
    created and @invalidate()
    @activeOffspring = @activeOffspring or  activeOffspring = Object.create(null)
    i = startIndex
    for child in newChildren
      child = toComponent child
      child.setRefContainer(@)
      child.holder = @
      child.parentNode = @parentNode
      child.listIndex = i
      children[i] = child
      activeOffspring[child.dcid] = child
      child
      i++
    @length = children.length
    return @

  createDom: ->
    @resetContainerHookUpdater()
    children = @children
    listLength = children.length
    if !listLength
      @lastNodeComponent = @firstNodeComponent = @emptyPlaceHolder = none = new Text('')
      @node = [ none.createDom()]
      return
    @node = node = []
    for child, i in children
      child.listIndex = i
      child.parentNode = @parentNode
      node[i] = child.render(true)
    i = 0; lastIndex = listLength-1
    # do not need set firstNode and lastNode for ListComponent
    # we always use component.firstNodeComponent.firstNode and component.lastNodeComponent.LastNode
    @firstNodeComponent = children[0].firstNodeComponent
    @lastNodeComponent = children[lastIndex].lastNodeComponent
    while i<lastIndex
      children[i].lastNodeComponent.nextNodeComponent = children[i+1].firstNodeComponent
      i++
    while i
      children[i].firstNodeComponent.prevNodeComponent = children[i-1].lastNodeComponent
      i--
    node

  updateDom: (mounting) ->
    @resetContainerHookUpdater()
    @updateOffspring(mounting)
    @children.length = @length
    @node

  getNode: -> @node

  attachNode: (nextNode) ->
    @unmounted = false
    if !@parentNode then return
    container = @container
    if container and container.isList
      container.node[@listIndex] = @node
      if !container.created or container.detached then  return @node
    if @created and !@detached then return @node
    @detached = false
    insertNode(@parentNode, @node, nextNode)

  removeNode: ->
    if !@parentNode or @unmounted then return
    for child in @children
      child.baseComponent.removeNode()
    return

  insertChild: (index, child) ->
    if @created
      throw new Error 'do not allow set children after the Dom of List Component was created'
    children = @children
    child = toComponent(child, @, index)
    child.setRefContainer(container)
    children.splice(index, 0, child)
    @length++
    @

  removeChild: (index) ->
    if @created
      throw new Error 'do not allow set children after the Dom of List Component was created'
    @children.splice(index, 1)
    @

  setFirstLast: (removed, replaced) ->
    removedFirst = removed.firstNodeComponent
    if removedFirst==@firstNodeComponent
      newFirst = replaced and replaced.firstNodeComponent or removed.nextNodeComponent
      @firstNodeComponent = newFirst
      me = @; holder = @holder
      while me.listIndex
        if removedFirst!=holder.firstNodeComponent then break
        holder.firstNodeComponent = newFirst
        me = holder; holder = @holder
    removedLast = removed.lastNodeComponent
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