{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
Func = require './Func'
{funcString, newLine} = require '../../util'
{react, renew, flow} = require '../../flow/index'
{watchList, watchItem} = require '../../flow/watch-list'

# itemFn:
# (item, index, items, component) -> Component
# (value, key, items, component) -> Component
module.exports = class Each extends TransformComponent
  constructor: (items, @itemFn, options={}) ->
    super(options)

    me = this

    if typeof items != 'function' and !isArray(items)
      throw new Error 'cacheChildren for List should be array like or a function'
    else if typeof items != 'function'
      if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
    else
      if !items.invalidate then items = renew(items)
      items.onInvalidate(@invalidate.bind(@))
    @items = items

    # object: (value, key) -> (-1, 0, 1)
    # array: (item) -> (-1, 0, 1)
    @sortFunction = options.sortFunction
    # object: (value, key, index) -> hash
    # array: (item, index) -> hash
    @keyFunction = options.keyFunction

    @cacheComponents = Object.create(null)
    @cacheChildren = []
    @listComponent = new List(@children=[])
    @childReactives = []
    return

  reset: (options) ->

  getItems: ->
    {items, sortFunction} = @
    if typeof items == 'function' and items.invalid
      items = items()
      if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
      if !isArray(items)
        items = for key, value of items then [key, value]
        @isArrayItems = false
      else @isArrayItems = true
      if sortFunction then items.sort(sortFunction)
    else
      if items.invalid and @sortFunction then items.sort(sortFunction)
      @isArrayItems = true
    @_items = items

  getContentComponent: ->
    me = @
    @getItems()
    {listComponent, cacheChildren, children, childReactives, cacheComponents, keyFunction, _items, itemFn} = @
    itemsLength = _items.length
    cacheChildrenLength = cacheChildren.length
    childrenLength = children.length
    i = childrenLength
    if i>itemsLength
      while --i>=itemsLength
        children[i].removing = true
        children[i].invalidate()
    else while i<itemsLength
      if i<cacheChildrenLength
        children[i] = cacheChildren[i]
        children[i].mounting = true
        children[i].invalidate()
      else do (i=i) ->
        childReactives[i] = react ->
          items = me._items
          item = _items[i]
          if me.isArrayItems
            if keyFunction then cacheComponents[keyFunction(item, i)] or itemFn(item, i, items, me)
            else itemFn(item, i, items, me)
          else
            [key, value] = item
            if keyFunction then cacheComponents[keyFunction(value, key, i)] or itemFn(value, key, i, items, me)
            else itemFn(value, key, i, items, me)
        children[i] = cacheChildren[i] = child = new Func childReactives[i]
        child.container = listComponent
        child.listIndex = i
      i++
    listComponent.setParentNode @parentNode
    listComponent

  clone: (options) -> (new Each(@items, @itemFn, options or @options)).copyLifeCallback(@)

  toString: (indent=0, noNewLine) -> newLine("<Each #{funcString(@items)} #{funcString(@itemFn)}/>", indent, noNewLine)
