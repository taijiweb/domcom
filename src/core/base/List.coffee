toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
{checkContainer, newLine, binarySearch} = require '../../util'
{checkConflictOffspring} = require '../../dom-util'

module.exports = exports = class List extends BaseComponent
  constructor: (children, options) ->
    if !children.length then return new Text('')
    @children = children
    options = options or {}
    super(options)
    @family = family = Object.create(null)
    family[@dcid] = true
    @invalidIndexes = invalidIndexes = []
    for child, i in children
      children[i] = child = toComponent(child)
      checkConflictOffspring(family, child)
      child.holder = @
      invalidIndexes.unshift i
    @isList = true
    @createDom = @_renderDom.bind(@)
    @updateDom = @_renderDom.bind(@)
    return

  invalidateContent: (child) ->
    @valid = false
    @contentValid = false
    [index, found] = binarySearch(child.listIndex, @invalidIndexes)
    if !found then @invalidIndexes.splice(index, 0, child.listIndex)
    @holder and @holder.invalidateContent(@)

  createDom: ->
    @node = []
    children = @children
    if !children.length
      @firstNode = null
      return @node
    index = children.length-1
    while index>=0
      child = children[index]
      if child.holder!=@ then child.invalidate()
      child.holder = @
      child.listIndex = i
      child.parentNode = @parentNode
      child.render(mounting)
      index--
    @firstNode = children[0].firstNode
    @node

  updateDom: ->
    children = @children
    invalidIndexes = for index in @invalidIndexes then index
    @invalidIndexes = []
    index = invalidChildren.length-1
    for index in invalidIndexes
      child = children[index]
      if child.holder!=@ then child.invalidate()
      child.holder = @
      child.listIndex = i
      child.parentNode = @parentNode
      child.render(mounting)
    node

  removeNode: ->
    if !@parentNode or @unmounted then return
    for child in @children
      child.baseComponent.removeNode()
    return

  xxxsetUnmounted: (value) ->
    @unmounted = value
    for child in @children
      child.baseComponent.setUnmounted(value)
    return

  insertChild: (index, child) ->
    @invalidate()
    {invalidIndexes} = @
    insertLocation = binarySearch(index, invalidIndexes)
    invalidIndexes.splice(insertLocation, 0, index)
    length = invalidIndexes.length
    while insertLocation<length
      insertLocation[insertLocation]++
      insertLocation++
    @children.splice(index, 0, toComponent(child))
    @

  removeChild: (index) ->
    @invalidate()
    [insertLocation, found] = binarySearch(child.listIndex, @invalidIndexes)
    if !found then @invalidIndexes.splice(insertLocation, 0, index)
    # todo: remove child from @children and node from @node while @updateDom()
    @children[index].setRemoving()
    @

  setChildren: (startIndex, newChildren...) ->
    @invalidate()
    insertLocation = binarySearch(startIndex, @invalidIndexes)
    {children, invalidIndexes} = @
    for child in newChildren
      if invalidIndexes[inserLocation]!=startIndex then invalidIndexes.splice(insertLocation, 0, startIndex)
      if invalidIndexes[insertLocation] insertLocation++
      children[startIndex++] = toComponent child
    return @

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  toString: (indent=0, noNewLine) ->
    s = newLine("<List>", indent, noNewLine)
    for child in @children
      s += child.toString(indent+2)
    s += newLine('</List>', indent)