toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
Func = require './Func'
Text = require './Text'
{isArray, funcString, newLine} = require 'dc-util'
{react, renew, flow} = require 'lazy-flow'
{watchEachList, watchEachObject} = require 'dc-watch-list'

# itemFn:
# (item, index, items, component) -> Component
# (value, key, items, component) -> Component
module.exports = class Each extends TransformComponent
  constructor: (items, @itemFn, options={}) ->
    super()

    @family = {}

    me = this

    if typeof items == 'function'
      @isFunction = true
      !items.invalidate and items = renew(items)
      items.onInvalidate @invalidateTransform.bind(@)

    @items = items

    # object: (value, key) -> (-1, 0, 1)
    # array: (item) -> (-1, 0, 1)
    if options.sort
      @needSort = true
      if typeof options.sort == 'function'
        @sortFunction = options.sort
      else @sortFunction = null
    # object: (value, key, index) -> hash
    # array: (item, index) -> hash
    key = options.key
    @keyFunction =
      if typeof key == 'function' then key
      else if key? then (item, i) -> item[key]

    @childReactives = []
    @memoComponents = {}
    @memoChildMap = {} # the map from memo key to active child component, only one child from a key is allowed
    @cacheChildren = []
    @listComponent = new List([])
    @listComponent.holder = @
    return

  getItems: ->

  getContentComponent: ->
    {listComponent, items, isFunction, needSort} = @

    if !items then return @emptyPlaceHolder or @emptyPlaceHolder = new Nothing()
    if isFunction
      items = items()
      if !items then return @emptyPlaceHolder or @emptyPlaceHolder = new Nothing()
      if typeof(items)!='object' then throw new Error 'Each Component need an array or object'

    if !(@isArrayItems = items instanceof Array)
      items = for key, value of items then [key, value]

    if needSort
      items.sort(@sortFunction)

    else
      _items = @_items
      _items and _items.watchingComponents and delete _items.watchingComponents[@dcid]
      watchingMe = items and items.watchingComponents and items.watchingComponents[@dcid]
      if !@notWatch and !watchingMe
        if @isArrayItems then watchEachList items, @
        else watchEachObject items, @

    @_items = items

    length = items.length
    if length<listComponent.children.length
      @_setLength(length)
      if isFunction or needSort or !@isArrayItems
        @invalidateChildren(0, length)

    else @invalidateChildren(0, length)

    listComponent

  getChild: (index) ->
    me = @

    if keyFunction
      memoKey = if @isArrayItems then keyFunction(_items[index], index) else keyFunction(_items[index][0], _items[index][1], index)

    {listComponent, cacheChildren, children, childReactives, keyFunction, itemFn} = @
    children = listComponent.children

    if keyFunction
      if @memoChildMap[memoKey]
        throw new Error 'duplicated memo key in Each Component'

      if child=@memoComponents[memoKey]
        child.valid = false
        child.transformValid = false
        children[index] = cacheChildren[index] = child
        @memoChildMap[memoKey] = child
        return child

    if index<children.length
      child = children[index]
      child.valid = false
      child.transformValid = false
    else if index<cacheChildren.length
      child = children[index] = cacheChildren[index]
      child.valid = false
      child.transformValid = false
    else
        childReactives[index] = react ->
          items = me._items
          item = items[index]

          # if item.pouring, always invalidate child component
          # so do not move this line after "... child = new Func childReactives[index]"
          if itemFn.pouring
            child.invalidateTransform()

          result =
            if me.isArrayItems then itemFn(item, index, items, me)
            else
              [key, value] = item
              itemFn(value, key, index, items, me)

        children[index] = cacheChildren[index] = child = new Func childReactives[index]
        child.holder = listComponent
        listComponent.dcidIndexMap[child.dcid] = index

    child

  invalidateChildren: (start, stop) ->
    if !stop? then stop = start+1
    i = start
    {listComponent} = @
    children = listComponent.children
    oldChildrenLength = children.length
    while i<stop
      @getChild(i)
      i++
    if stop>oldChildrenLength
      children[stop-1].nextNode = @nextNode
    listComponent.invalidChildren(start, stop)
    @

  _setLength: (length) ->
    listComponent = @listComponent
    oldLength = listComponent.children.length
    if length>=oldLength then @
    else
      if @keyFunction
        index = length
        while index<oldLength
          delete memoChildMap[children[index].memoKey]
          index++
      listComponent.setLength(length); @

  clone: (options) -> (new Each(@items, @itemFn, options or @options)).copyEventListeners(@)

  toString: (indent=0, addNewLine) -> newLine("<Each #{funcString(@items)} #{funcString(@itemFn)}/>", indent, addNewLine)
