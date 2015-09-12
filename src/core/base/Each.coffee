{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
Func = require './Func'
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
    @cacheComponents = Object.create(null)
    @cacheChildren = []
    @listComponent = new List(@children=[])
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
      if !@notWatch and !isFunction then watchEachObject items, @
      items = for key, value of items then [key, value]
    else
      if !@notWatch and !isFunction then watchEachList items, @
      @isArrayItems = true
    if @needSort then items = items.sort(@sortFunction)
    @_items = items

  getContentComponent: ->
    me = @
    {listComponent} = @
    listComponent.parentNode = @parentNode
    @getItems()
    @invalidateChildren(0, @_items.length)
    listComponent

  invalidateChild: (i) ->
    me = @
    {listComponent, cacheChildren, children, childReactives, cacheComponents, _items, keyFunction, itemFn} = @
    itemsLength = _items.length
    cacheChildrenLength = cacheChildren.length
    childrenLength = children.length
    if i>=itemsLength
      children[i].setRemoving()
      children[i].invalidate()
    else
      if i<cacheChildrenLength
        children[i] = cacheChildren[i]
        children[i].mounting = true
      else
        childReactives[i] = react ->
          items = me._items
          item = items[i]
          index = child.listIndex
          result =
            if me.isArrayItems
              if keyFunction then cacheComponents[keyFunction(item, index)] or itemFn(item, index, items, me)
              else itemFn(item, i, items, me)
            else
              [key, value] = item
              if keyFunction then cacheComponents[keyFunction(value, key, index)] or itemFn(value, key, index, items, me)
              else itemFn(value, key, i, items, me)
          if itemFn.pouring then child.invalidate()
          result

        children[i] = cacheChildren[i] = child = new Func childReactives[i]
        child.invalid = false # let child can be add to activeOffspring by children[i].invalidate()
        child.container = listComponent
        child.listIndex = i
        child.parentNode = @parentNode
      children[i].invalidate()

  invalidateChildren: (start, stop) ->
    if stop
      while start<stop
        @invalidateChild(start)
        start++
    else @invalidateChild(start)
    return

  clone: (options) -> (new Each(@items, @itemFn, options or @options)).copyLifeCallback(@)

  toString: (indent=0, noNewLine) -> newLine("<Each #{funcString(@items)} #{funcString(@itemFn)}/>", indent, noNewLine)
