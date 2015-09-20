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
    @listComponent.isContainer = true
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
    length = Math.max(@_items.length, @children.length)
    length and @invalidateChildren(0, length)
    listComponent.length = @_items.length
    listComponent

  getChild: (i) ->
    me = @
    {listComponent, cacheChildren, children, childReactives, cacheComponents, keyFunction, itemFn} = @
    if i>=@_items.length
      child = cacheChildren[i]
      child.valid = false
      child.mountMode = 'unmounting'
    else
      if i<children.length
        child = children[i]
        child.valid = false
      else if i<cacheChildren.length
        child = children[i] = cacheChildren[i]
        child.valid = false
        child.mountMode = 'mounting'
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

        child = children[i] = cacheChildren[i] = new Func childReactives[i]
        child.holder = listComponent
        child.listIndex = i
        child.parentNode = @parentNode
        if listComponent.node then child.mountMode = 'mounting'

    child

  invalidateChildren: (start, stop) ->
    {listComponent} = @
    node = listComponent.node
    if node then activeOffspring = listComponent.activeOffspring = listComponent.activeOffspring or Object.create(null)
    while start<stop
      child = @getChild(start)
      node and activeOffspring[child.dcid] = child
      start++
    if node
      listComponent.noop = true
      listComponent.invalidate()
    return

  clone: (options) -> (new Each(@items, @itemFn, options or @options)).copyLifeCallback(@)

  toString: (indent=0, noNewLine) -> newLine("<Each #{funcString(@items)} #{funcString(@itemFn)}/>", indent, noNewLine)
