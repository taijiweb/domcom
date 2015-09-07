{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
Func = require './Func'
{funcString, newLine} = require '../../util'
{renew, flow} = require '../../flow/index'
{watchList, watchItem} = require '../../flow/watch-items'

# itemFn:
# (item, index, items, component) -> Component
# (value, key, items, component) -> Component
module.exports = class Each extends TransformComponent
  constructor: (items, itemFn, options={}) ->
    super(options)

    me = this

    if typeof items != 'function' and !isArray(items)
      throw new Error 'children for List should be array like or a function'
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
    children = []
    childrenLength = 0
    currentChildren = []
    currentChildrenLength = 0
    @componentList = new List(currentChildren)

    isArrayItems = true
    @getItems = getItems = ->
      react ->
        if typeof me.items == 'function'
          items = me.items()
          if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
        if !isArray(items)
          items = for key, value of items then [key, value]
          isArrayItems = false
        else isArrayItems = true
        if sortFunction then items.sort(sortFunction)
        items

    _childReactives = []

    @childReatives = childReatives = (i) ->
      _childReactives[i] or _childReactives[i] = react ->
        item = getItems()[i]
        if isArrayItems
          if keyFunction then cacheComponents[keyFunction(item, i)] or itemFn(item, i, items, me)
          else itemFn(item, i, items, me)
        else
          [key, value] = item
          if keyFunction then cacheComponents[keyFunction(value, key, i)] or itemFn(value, key, i, items, me)
          else itemFn(value, key, i, items, me)

    getContentComponent = ->
      i = currentChildrenLength
      itemsLength = items.length
      while i<itemsLength
        if i<childrenLength
          children[i].mounting = true
          currentChildren[i] = children[i]
        else
          currentChildren[i] = children[i] = new Func childReactives(i)
          currentChildren[i].container = componentList
          currentChildren.listIndex = i
        i++
      while i<currentChildren.length
        currentChildren[i].removing = true
        i++
      childrenLength = children.length
      currentChildrenLength = itemsLength
      componentList

    clone = (options) ->
      (new Each(items, ((item, index, items, comp) -> itemFn(item, index, items, comp).clone()), options or me.options)).copyLifeCallback(@)

    toString = (indent=0, noNewLine) -> newLine("<Each #{funcString(me.items)} #{funcString(itemFn)}/>", indent, noNewLine)
