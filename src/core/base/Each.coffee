{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
Func = require './Func'
{funcString, newLine} = require '../../util'
{renew, flow} = require '../../flow/index'
{watchList, watchItem} = require '../../flow/watch-list'

module.exports = class Each extends TransformComponent
  constructor: (list, itemFn, options={}) ->
    super(options)

    if typeof list != 'function' and !isArray(list)
      throw new Error 'children for List should be array like or a function'
    else if typeof list != 'function'
      items = list
      if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
    else
      if !list.invalidate
        list = renew(list)
      list.onInvalidate(@invalidate.bind(@))

    # object: (value, key) -> (-1, 0, 1)
    # array: (item) -> (-1, 0, 1)
    sortFunction = options.sortFunction
    # object: (value, key, index) -> hash
    # array: (item, index) -> hash
    keyFunction = options.keyFunction

    cacheComponents = Object.create(null)

    @getContentComponent = ->
      if typeof list == 'function'
        items = list()
        if !items or typeof(items)!='object' then throw new Error 'Each Component need an array or object'
      children = []
      if isArray(items)
        watchList items
        if sortFunction then items.sort(sortFunction)
        for item, i in items then do(item=item, i=i) ->
          itemWatcher = watchItem(items, i)
          if list.invalidate then list.onInvalidate(itemWatcher.invalidate.bind(itemWatcher))
          fn = flow itemWatcher, ->
            if keyFunction
              cacheComponents[keyFunction(item, i)] or itemFn(item, i, items, @)
            else itemFn(item, i, items, @)
          children.push  new Func fn
      else
        itemList = for key, value of items then [key, value]
        if sortFunction then itemList.sort(sortFunction)
        for [key, value], index in itemList then do(key=key, value=value, index=index) ->
          fn = flow ->
            if keyFunction then @cacheComponents[keyFunction(value, key, index)] or itemFn(value, key, index, itemList, @)
            else itemFn(value, key, index, itemList, @)
          children.push new Func fn
      new List(children)

    @clone = (options) ->
      (new Each(list, ((item, index, list, comp) -> itemFn(item, index, list, comp).clone()), options or @options)).copyLifeCallback(@)

    @toString = (indent=0, noNewLine) -> newLine("<Each #{funcString(list)} #{funcString(itemFn)}/>", indent, noNewLine)

    this