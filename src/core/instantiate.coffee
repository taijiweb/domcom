{Component, toComponent, isComponent,
Tag, Text, Comment,
If, Case, Func, List, Each} = require './base'
{isEven} = require '../util'

isAttrs = (item) ->
  typeof item == 'object' and item!=null and !isComponent(item) and item not instanceof Array

getAttrsOptions = (item) ->
  if typeof item != 'object' or item==null or isComponent(item) or item instanceof Array
    return [null, null]
  if item.options
    options = item.options
    delete item.options
  attrs =  if Object.keys(item).length then item else null
  [attrs, options]

attrsChildren = (args) ->
  attrs = args[0]
  if !args.length then [Object.create(null), []]
  else if `attrs==null` then [Object.create(null), args.slice(1)]
  else if attrs instanceof Array then [Object.create(null), args]
  else if typeof attrs == 'function' then [Object.create(null), args]
  else if typeof attrs == 'object'
    if isComponent(attrs) then [Object.create(null), args]
    else [attrs, args.slice(1)]
  else [Object.create(null), args]

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

exports.clone = (attrs, src, options) ->
  [attrs, options] =
  if isAttrs(attrs) then new Tag('div', attrs, [toComponent(src).clone(options)])
  else toComponent(attrs).clone(src)

exports.if_ = (attrs, test, then_, else_, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new If(test, then_, else_, options)])
  else
    new If(attrs, test, then_, else_)

exports.case_ = (attrs, test, map, else_, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Case(test, map, else_, options)])
  else new Case(attrs, test, map, else_)

arrangeCondArgs = (condComponents, else_, options) ->
  if !isEven(condComponents)
    condComponents.push else_
    if options and (isComponent(options) or typeof options != 'object')
      else_ = options; options = {}
    else else_ = null
  else if options and (isComponent(options) or typeof options != 'object')
      condComponents.push.apply(condComponents, [else_, options])
  [condComponents, else_, options]

exports.cond = (attrs, condComponents..., else_, options) ->
  if isAttrs(attrs)
    [condComponents, else_, options] = arrangeCondArgs(condComponents, else_, options)
    new Tag('div', attrs, [new Cond(condComponents, else_, options)])
  else
    condComponents.unshift(attrs)
    [condComponents, else_, options] = arrangeCondArgs(condComponents, else_, options)
    new Cond(condComponents, else_, options)

exports.func = (attrs, fn, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Func(fn, options)])
  else new Func(attrs, fn)

exports.txt = (attrs, text) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Text(text)])
  else new Text(attrs)

exports.comment = (attrs, text) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Comment(text)])
  else new Comment(attrs)

exports.list = list = (attrs, lst...) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new List(lst)])
  else
    lst.unshift(attrs)
    if lst.length==1 then toComponent(lst[0])
    else new List(lst)

###*
  @param
    itemFn - function (item, index, list, component) { ... }
    itemFn - function (value, key, index, hash, component) { ... }
###
exports.each = (attrs, list, itemFn, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Each(list, itemFn, options)])
  else new Each(attrs, list, itemFn)

exports.every = (attrs, list, itemFn) ->
  if isAttrs(attrs)
    children = []
    for item, i in list
      children.push itemFn(item, i, list)
    new Tag('div', attrs, [new List(children)])
  else
    # attrs become list, list become itemFn
    children = []
    for item, i in attrs
      children.push list(item, i, attrs)
    new List(children)

exports.all = (attrs, hash, itemFn) ->
  if isAttrs(attrs)
    children = []
    i = 0
    for key, value of hash
      children.push itemFn(key, value, i, hash)
      i++
    new Tag('div', attrs, [new List(children)])
  else
    # attrs become list, list become itemFn
    children = []
    i = 0
    for key, value of attrs
      children.push itemFn(key, value, i, hash)
      i++
    new List(children)
