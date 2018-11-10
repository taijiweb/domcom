import {List, Tag, toBlock} from './component'

import {isArray, isObject} from 'dc-util'

import {watchItems, isEachObjectSystemKey} from 'dc-watch-list'

#export default
exports = {}

defaultItemFunction = (item) -> item

# itemFunc:
# (item, index, items, component) -> List component
# (value, key, object, component) -> List component
_each = (attrs, items, options) ->

  if attrs
    EachClass = attrs.EachClass || Tag
    delete attrs.EachClass
    listComponent = new EachClass(null, attrs, [])
  else
    EachClass = items.EachClass || List
    listComponent = new EachClass([])

  listComponent.items = items

  if typeof options == 'function'
    listComponent.itemFunc = options
    options = {}

  else
    options = options || {}
    listComponent.itemFunc = options.itemFunc || defaultItemFunction

  listComponent.separatorFunc = options.separatorFunc
  listComponent.updateSuccChild = options.updateSuccChild
  listComponent.updateSuccIndex = options.updateSuccIndex
  listComponent.keyChildMap = keyChildMap = {}

  if isArray(items)
    listComponent.getItemComponent = getItemComponent = (item, itemIndex) ->
      itemComponent = toBlock(listComponent.itemFunc(item, itemIndex, items, listComponent))
      if listComponent.separatorFunc && itemIndex
        separatorComponent = toBlock(listComponent.separatorFunc(itemIndex, item, items, listComponent))
        itemComponent = new List([separatorComponent, itemComponent])
      itemComponent.itemIndex = itemIndex
      itemComponent

  else
    listComponent.getItemComponent = getItemComponent = (key, itemIndex) ->
      value = items[key]
      keyChildMap[key] = itemIndex
      itemComponent = toBlock(listComponent.itemFunc(value, key, itemIndex, items, listComponent))
      if listComponent.separatorFunc && itemIndex
        separatorComponent = toBlock(listComponent.separatorFunc(itemIndex, value, key, items, listComponent))
        itemComponent = new List([separatorComponent, itemComponent])
      itemComponent.$watchingKey = key
      itemComponent.itemIndex = itemIndex
      itemComponent

  children = []

  if isArray(items)
    for item, i in items
      children.push(getItemComponent(item, i))

  else
    i = 0
    for key of items
      children.push(getItemComponent(key, i))
      i++
  listComponent.setChildren(0, children)

getEachArgs = (args) ->
  [attrs, items, options] = args
  if args.length == 1
    [null, attrs, {}]
  else if args.length == 3
    [attrs, items, options]
  else
    if typeof items == 'function'
      [null, attrs, {itemFunc:items}]
    else if isArray(items)
      [attrs, items, {}]
    else if isArray(attrs)
      [null, attrs, items]
    else if !items
      # options = items; items = attrs
      [null, attrs, {}]
    else if !isObject(items)
      throw new Error('wrong parameter')
    else
      for key of items
        if items.hasOwnProperty(key)
          continue
        else if key.test(/itemFunc|separatorFunc|updateSuccChild|updateSuccIndex/)
          return [null, attrs, items]
      [attrs, items, {}]

exports.every = every = (args...) ->
  [attrs, items, options] = getEachArgs(args)
  _each(attrs, items, options)

exports.each = each = (args...) ->
  [attrs, items, options] = getEachArgs(args)
  listComponent = every(attrs, items, options)
  watchItems(items, listComponent)

exports.funcEach = (attrs, itemsFunc, options) ->

  if typeof attrs == 'function'
    options = itemsFunc
    itemsFunc = attrs
    attrs = null
    EachClass = itemsFunc.EachClass

  items = itemsFunc()

  if isArray(items)
    items = items[...]

  else
    items = Object.assign({}, items)

  if EachClass
    items.EachClass = EachClass

  component = each(attrs, items, options)

  updateItemsCallback =  ->
    newItems = itemsFunc()
    items.replaceAll(newItems)

  if itemsFunc.onInvalidate
    itemsFunc.onInvalidate updateItemsCallback

  else
    component.on 'willRenderDom', ->
      if component.node
        updateItemsCallback()
    component.on 'didRenderDom', ->
      component.invalidate()

  component

export default exports