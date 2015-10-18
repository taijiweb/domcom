{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
Func = require './Func'
Text = require './Text'
{funcString, newLine} = require '../../util'
{react, renew, flow} = require '../../flow/index'
{watchEachList, watchEachObject} = require '../../flow/watch-list'

# itemFn:
# (item, index, items, component) -> Component
# (value, key, items, component) -> Component
module.exports = class Each extends TransformComponent
  constructor: (items, @itemFn, options={}) ->
    super()

    me = this

    if typeof items == 'function'
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
    @memoComponents = Object.create(null)
    @memoChildMap = Object.create(null) # the map from memo key to active child component, only one child from a key is allowed
    @cacheChildren = []
    @listComponent = new List([])
    @listComponent.holder = @
    return

  getItems: ->
    {items} = @
    if typeof items == 'function'
      isFunction = true
      items = items()
      if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
    if items not instanceof Array
      @isArrayItems = false
      if !@notWatch and !isFunction and !@needSort and !@watched then watchEachObject items, @
      items = for key, value of items then [key, value]
    else
      if !@notWatch and !isFunction and !@needSort and !@watched then watchEachList items, @
      @isArrayItems = true
    if @needSort then items = items.sort(@sortFunction)
    @_items = items

  getContentComponent: ->
    me = @
    {listComponent} = @
    @getItems()
    length = @_items.length
    if length<listComponent.children.length then listComponent.setLength(length)
    length and @_invalidateChildren(0, length)
    listComponent

  getChild: (i) ->
    me = @

    if keyFunction
      memoKey = if @isArrayItems then keyFunction(_items[i], i) else keyFunction(_items[i][0], _items[i][1], i)

    {listComponent, cacheChildren, children, childReactives, keyFunction, itemFn} = @
    children = listComponent.children

    if keyFunction
      if @memoChildMap[memoKey]
        throw new Error 'duplicated memo key in Each Component'

      if child=@memoComponents[memoKey]
        child.valid = false
        child.transformValid = false
        children[i] = cacheChildren[i] = child
        @memoChildMap[memoKey] = child
        return child

    if i<children.length
      child = children[i]
      child.valid = false
      child.transformValid = false
    else if i<cacheChildren.length
      child = children[i] = cacheChildren[i]
      child.valid = false
      child.transformValid = false
    else
      _items = @_items
      if me.isArrayItems
        if !me.isFunctionItems and !me.needSort
          itemBinding = react (value) ->
            if arguments.length==1 then me._items[i] = value
            else me._items[i]
        else itemBinding = react (value) -> _items[i]
        if keyFunction
          @memoChildMap[memoKey] = memoComponents[memoKey] = child = toComponent(itemFn(itemBinding, i, me))
          child.memoKey = memoKey
          child
        else
          if itemFn.pouring then childReactives[i] = ->  itemFn(itemBinding, i, me)
          # make childReactives[i] not to be renew by default
          else  childReactives[i] = react ->  itemFn(itemBinding, i, me)
          child = new Func childReactives[i]
      else
        # [key, value] = @_items[i]
        valueBinding = react (v) ->
          if arguments.length==1
            @_items.setItem(@_items[i][0], v)
          else @_items[i][1]
        keyBinding = react -> @_items[i][0]
        _itemsBinding = -> @_items
        childReactives[i] = -> itemFn(valueBinding, keyBinding, i, me)
        if keyFunction
          @memoChildMap[memoKey] = memoComponents[memoKey] = child = toComponent(itemFn(valueBinding, keyBinding, i, me))
          child.memoKey = memoKey
          child
        else
          if itemFn.pouring then childReactives[i] = ->  itemFn(valueBinding, keyBinding, i, me)
          # make childReactives[i] not to be renew by default
          else childReactives[i] =  react ->  itemFn(valueBinding, keyBinding, i, me)
          child = new Func childReactives[i]
      children[i] = cacheChildren[i] = child
      listComponent.dcidIndexMap[child.dcid] = i
      child.holder = listComponent

    child

  _invalidateChildren: (start, stop) ->
    i = start
    while i<stop
      @getChild(i)
      i++
    @listComponent.invalidChildren(start, stop)
    @

  _setLength: (length) ->
    listComponent = @listComponent
    oldLength = listComponent.children.length
    if length==oldLength then @
    else if length>oldLength then @_invalidateChildren(oldLength, length)
    else
      if @keyFunction
        index = length
        while index<oldLength
          delete memoChildMap[children[index].memoKey]
          index++
      listComponent.setLength(length); @

  clone: (options) -> (new Each(@items, @itemFn, options or @options)).copyEventListeners(@)

  toString: (indent=0, addNewLine) -> newLine("<Each #{funcString(@items)} #{funcString(@itemFn)}/>", indent, addNewLine)
