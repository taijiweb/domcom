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
    super(options)

    me = this

    if typeof items == 'function'
      if !items.invalidate then items = renew(items)
      items.onInvalidate -> me.invalidate()

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
    @memoToChild = Object.create(null) # the map from memo key to active child component, only one child from a key is allowed
    @cacheChildren = []
    # let listComponent has at least on child, otherwise @listComponent will become new Text('')
    @listComponent = new List(@children=[''])
    @children.length = 0
    @listComponent.isUpdateHook = true
    return

  reset: (options) ->

  getItems: ->
    {items} = @
    if typeof items == 'function'
      isFunction = true
      items = items()
      if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
    if items not instanceof Array
      @isArrayItems = false
      if !@notWatch and !isFunction and !@needSort then watchEachObject items, @
      items = for key, value of items then [key, value]
    else
      if !@notWatch and !isFunction and !@needSort then watchEachList items, @
      @isArrayItems = true
    if @needSort then items = items.sort(@sortFunction)
    @_items = items

  getContentComponent: ->
    me = @
    {listComponent} = @
    listComponent.parentNode = @parentNode
    if listComponent.node then listComponent.noop = true
    @getItems()
    if !@_items.length
      return @emptyPlaceHolder = @emptyPlaceHolder or new Text('')
    length = Math.max(@_items.length, @children.length)
    length and @invalidateChildren(0, length)
    listComponent

  getChild: (i) ->
    me = @
    if keyFunction
      memoKey = if @isArrayItems then keyFunction(_items[i], i) else keyFunction(_items[i][0], _items[i][1], i)
    {listComponent, cacheChildren, children, childReactives, keyFunction, itemFn} = @
    if i>=@_items.length
      child = cacheChildren[i]
      child.valid = false
      child.mountMode = 'unmounting'
      if keyFunction
        delete @memoToChild[memoKey]
      return child
    if keyFunction
      if @memoToChild[memoKey]
        throw new Error 'duplicated memo key in Each Component'
      if child=@memoComponents[memoKey]
        child.valid = false
        child.mountMode = 'mounting'
        children[i] = cacheChildren[i] = child
        child.listIndex = i
        @memoToChild[memoKey] = child
        child.parentNode = @parentNode
        return child
    if i<children.length
        child = children[i]
        child.valid = false
    else if i<cacheChildren.length
      child = children[i] = cacheChildren[i]
      child.valid = false
      child.mountMode = 'mounting'
    else
      _items = @_items
      if me.isArrayItems
        if !me.isFunctionItems and !me.needSort
          itemBinding = react (value) ->
            if arguments.length==1 then me._items[i] = value
            else me._items[i]
        else itemBinding = react (value) -> _items[i]
        if keyFunction
          @memoToChild[memoKey] = memoComponents[memoKey] = child = toComponent(itemFn(itemBinding, i, me))
        else
          childReactives[i] = ->  itemFn(itemBinding, i, me)
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
          @memoToChild[memoKey] = memoComponents[memoKey] = child = toComponent(itemFn(valueBinding, keyBinding, i, me))
        else
          childReactives[i] = ->  itemFn(valueBinding, keyBinding, i, me)
          child = new Func childReactives[i]
      child = children[i] = cacheChildren[i] = new Func childReactives[i]
      child.holder = listComponent
      child.listIndex = i
      child.parentNode = @parentNode
      if listComponent.node then child.mountMode = 'mounting'

    child

  invalidateChildren: (start, stop) ->
    {listComponent} = @
    node = listComponent.node
    while start<stop
      child = @getChild(start)
      index = binarySearch(start, listComponent.invalidIndexes)
      indexes = []
      while i<stop
        indexes.push i
        i++
      listComponent.invalidIndexes.splice(index, 0, indexes...)
    if node
      listComponent.noop = true
      listComponent.invalidate()
    return

  render: (parentNode, nextNode) ->
    super(mounting)
    itemsLength = @_items.length
    listComponent = @listComponent
    listComponent.children.length = itemsLength
    listComponent.node and listComponent.node.length = itemsLength
    @node.length = itemsLength
    @node

  clone: (options) -> (new Each(@items, @itemFn, options or @options)).copyLifeCallback(@)

  toString: (indent=0, noNewLine) -> newLine("<Each #{funcString(@items)} #{funcString(@itemFn)}/>", indent, noNewLine)
