{Component, toComponent, isComponent,
Tag, Text, Comment, Html
If, Case, Func, List,
Pick
Nothing, Defer} = require('./base')
{isEven} = require('dc-util')

{isAttrs} = require('./util')

{isArray, isObject} = require('dc-util')

{watchItems, isEachObjectSystemKey} = require('dc-watch-list')

{renew} = require('lazy-flow')

attrsChildren = (args) ->
  attrs = args[0]
  if !args.length then [{}, []]
  else if `attrs==null` then [{}, args.slice(1)]
  else if attrs instanceof Array then [{}, args]
  else if typeof attrs == 'function' then [{}, args]
  else if typeof attrs == 'object'
    if isComponent(attrs) then [{}, args]
    else [attrs, args.slice(1)]
  else [{}, args]

toTagChildren = (args) ->
  if args not instanceof Array then [args]
  else if !args.length then []
  else if args.length==1 then toTagChildren(args[0])
  else args

tag = exports.tag = (tagName, args...) ->
  [attrs, children] = attrsChildren(args)
  new Tag(tagName, attrs, toTagChildren(children))

exports.nstag = (tagName, namespace, args...) ->
  [attrs, children] = attrsChildren(args)
  new Tag(tagName, attrs, toTagChildren(children), namespace)

exports.txt = (attrs, text) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Text(text)])
  else new Text(attrs)

exports.comment = (attrs, text) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Comment(text)])
  else new Comment(attrs)

# this is for Html Component, which takes some text as innerHTML
# for <html> ... </html>, please use tagHtml instead
exports.html = (attrs, text, transform) ->
  new Html(attrs, text, transform)

exports.if_ = (attrs, test, then_, else_, merge, recursive) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new If(test, then_, else_, merge, recursive)])
  else new If(attrs, test, then_, merge, recursive)

exports.forceIf = (attrs, test, then_, else_) ->
  # always should NOT merge forced if
  if isAttrs(attrs)
    new Tag('div', attrs, [new If(test, then_, else_, true, false, true)])
  else new If(attrs, test, then_, true, false, true)

exports.mergeIf = (attrs, test, then_, else_, recursive) ->
  if isAttrs(attrs)
    new Tag('div', attrs, [new If(test, then_, else_, true, recursive)])
  else
    new If(attrs, test, then_, true, recursive)

exports.recursiveIf = (attrs, test, then_, else_) ->
  if isAttrs(attrs)
    new Tag('div', attrs, [new If(test, then_, else_, true, true)])
  else
    new If(attrs, test, then_, true, true)

exports.case_ = (attrs, test, map, else_) ->
  if isAttrs(attrs)
    new Tag('div', attrs, [new Case(test, map, else_)])
  else
    new Case(attrs, test, map)

exports.forceCase = (attrs, test, map, else_) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Case(test, map, else_, true)])
  else new Case(attrs, test, map, true)

exports.cond = (attrs, condComponents..., else_) ->
  if isAttrs(attrs)
    if !isEven(condComponents)
      condComponents.push else_
      else_ = null
    new Tag('div', attrs, [new Cond(condComponents, else_)])
  else
    condComponents.unshift(attrs)
    if !isEven(condComponents)
      condComponents.push else_
      else_ = null
    new Cond(condComponents, else_)

exports.func = (attrs, fn) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Func(fn)])
  else new Func(attrs) # attrs become fn

# pick can NOT wrapped with attrs
# because host must be an object!!!
exports.pick = (host, field, initialContent) ->
  new Pick(host, field, initialContent)

exports.list = list = (attrs, lst...) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new List(lst)])
  else
    lst.unshift(attrs)
    if lst.length==1 then toComponent(lst[0])
    else new List(lst)

defaultItemFunction = (item) -> new Text(item)

# itemFunc:
# (item, index, items, component) -> List component
# (value, key, object, component) -> List component
_each = (attrs, items, itemFunc = defaultItemFunction, separatorFunc, updateChildIndex) ->
  if attrs
    if attrs.tagName
      tagName = attrs.tagName
      delete attrs.tagName
    else
      tagName = 'div'
    listComponent = new Tag(tagName, attrs, [])
  else
    listComponent = new List([])
  listComponent.items = items
  listComponent.itemFunc = itemFunc
  listComponent.separatorFunc = separatorFunc
  listComponent.updateChildIndex = updateChildIndex
  listComponent.keyChildMap = keyChildMap = {}
  if isArray(items)
    listComponent.getItemComponent = getItemComponent = (item, itemIndex) ->
      itemComponent = toComponent(listComponent.itemFunc(item, itemIndex, items, listComponent))
      if listComponent.separatorFunc && itemIndex
        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, item, items, listComponent))
        itemComponent = new List([separatorComponent, itemComponent])
      itemComponent.itemIndex = itemIndex
      itemComponent
  else
    listComponent.getItemComponent = getItemComponent = (key, itemIndex) ->
      value = items[key]
      keyChildMap[key] = itemIndex
      itemComponent = toComponent(listComponent.itemFunc(value, key, itemIndex, listComponent))
      if listComponent.separatorFunc && itemIndex
        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, value, key, listComponent))
        itemComponent = new List([separatorComponent, itemComponent])
      itemComponent.$watchingKey = key
      itemComponent.itemIndex = itemIndex
      itemComponent

  children = listComponent.children
  if isArray(items)
    for item, i in items
      children.push(getItemComponent(item, i))
  else
    i = 0
    for key of items
      children.push(getItemComponent(key, i))
      i++

  listComponent

exports.every = every = (attrs, items, itemFunc, separatorFunc, updateChildIndex) ->
  if isObject(items)
    _each(attrs, items, itemFunc, separatorFunc, updateChildIndex)
  else
    # separatorFunc = itemFunc; itemFunc = items; items = attrs
    _each(null, attrs, items, itemFunc, separatorFunc)

exports.each = each = (attrs, items, itemFunc, separatorFunc, updateChildIndex) ->
  listComponent = every(attrs, items, itemFunc, separatorFunc, updateChildIndex)
  if !isObject(items)
    items = attrs
  watchItems(items, listComponent)

exports.funcEach = (attrs, listFunc, itemFunc, separatorFunc) ->
  if typeof attrs == 'function'
    separatorFunc = itemFunc
    itemFunc = listFunc
    listFunc = attrs
    attrs = null

  if !listFunc.invalidate
    isRenew = true
    listFunc = renew(listFunc)

  listItems = []
  listComponent = each(attrs, listItems, itemFunc, separatorFunc)
  listFunc.onInvalidate ->
    listComponent.invalidate()
  listComponent.on 'willRender', ->
    newList = listFunc()
    listItems.setItem(0, newList...)
    listItems.setLength(newList.length)
  listComponent.on 'didRender', ->
    if isRenew
      listComponent.holder.invalidateOffspring(listComponent)
  listComponent

exports.mapEach = (attrs, mapFunc, itemFunc, separatorFunc) ->
  if typeof attrs == 'function'
    separatorFunc = itemFunc
    itemFunc = mapFunc
    mapFunc = attrs
    attrs = null

  if !listFunc.invalidate
    isRenew = true
    listFunc = renew(listFunc)

  map = {}
  listComponent = each(attrs, map, itemFunc, separatorFunc)

  listFunc.onInvalidate ->
    listComponent.invalidate()

  listComponent.on 'willRender', ->
    newMap = listFunc()
    deleteKeys = []
    for key of map
      if newMap.hasOwnProperty(key)
        if isEachObjectSystemKey()
          continue
        else
          map.setItem(key, newMap[key])
      else
        deleteKeys.push(key)
    map.deleteItem(keys...)
    for key of newMap
      if !map.hasOwnProperty(key)
        map.setItem(key, newMap[key])

  listComponent.on 'didRender', ->
    if isRenew
      listComponent.holder.invalidateOffspring(listComponent)

  listComponent

# promise is a promise, which have .then and .catch the two method
# fulfill: (value, promise, component) ->
# reject: (reason, promise, component) ->
# init: will be converted to component by toComponent
exports.defer = (attrs, promise, fulfill, reject, init) ->
  if isAttrs(attrs)
    new Tag('div', attrs, [new Defer(promise, fulfill, reject, init)])
  else
    new Defer(attrs, promise, fulfill, reject)

exports.clone = (attrs, src) ->
  if isAttrs(attrs)
    new Tag('div', attrs, [toComponent(src).clone()])
  else
    toComponent(attrs).clone(src)
