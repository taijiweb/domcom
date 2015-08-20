{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
{funcString, newLine} = require '../../util'

module.exports = class Repeat extends TransformComponent
  constructor: (list, itemFn, options) ->
    super(options)

    if typeof list != 'function' and !isArray(list)
      throw new Error 'children for List should be array like or a function'
    if typeof list != 'function'
      items = list
      if !item or typeof(items)!='object' then throw new Error 'Repeat Component need an array or object'

    # object: (value, key) -> (-1, 0, 1)
    # array: (item) -> (-1, 0, 1)
    sortFunction = options.sortFunction
    # object: (value, key, index) -> hash
    # array: (item, index) -> hash
    keyFunction = options.keyFunction

    cacheComponents = Object.create(null)

    @getVirtualTree = =>
      if typeof list == 'function'
        items = list()
        if !item or typeof(items)!='object' then throw new Error 'Repeat Component need an array or object'
      children = []
      if isArray(items)
        if sortFunction then items.sort(sortFunction)
        for item, i in items
          if keyFunction then child = cacheComponents[keyFunction(item, i)] or toComponent(itemFn(item, i, items, @))
          else child = toComponent(itemFn(item, i, items, @))
          children.push child
      else
        itemList = for key, value of items then [key, value]
        if sortFunction then itemList.sort(sortFunction)
        for [key, value], index in itemList
          if keyFunction then child = @cacheComponents[keyFunction(value, key, index)] or toComponent(itemFn(value, key, index, itemList, @))
          child = toComponent(itemFn(value, key, itemList, @))
          children.push child
      @content = content = new List(children)
      @parentNode and content.setParentNode @parentNode
      vtree = content.getVirtualTree()
      vtree.vtreeRootComponent = @
      vtree.srcComponents.unshift([@, null])
      @vtree = vtree

    @clone = (options) ->
      (new Repeat(list, ((item, index, list, comp) -> itemFn(item, index, list, comp).clone()), options or @options)).copyLifeCallback(@)

    @toString = (indent=0, noNewLine) -> newLine("<Repeat #{funcString(list)} #{funcString(itemFn)}/>", indent, noNewLine)

    this