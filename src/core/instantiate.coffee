{Component, toComponent, isComponent,
Nothing
Tag, Text, Comment,
#Ref, Clone,
If, Case, Func, List, Repeat} = require './base'

isAttrs = (item) ->
  typeof item == 'object' and item!=null and !isComponent(item) and item not instanceof Array

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

exports.nothing = (attrs, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, new Nothing(), options)
  else new Nothing()

#exports.ref = (attrs, src, options) ->
#  if isAttrs(attrs) then new Tag('div', attrs, [new Ref(src, options)])
#  else new Ref(attrs, src)

exports.clone = (attrs, src, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [toComponent(src).clone(options)])
  else toComponent(attrs).clone(src)

exports.if_ = (attrs, test, then_, else_, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new If(test, then_, else_, options)])
  else
    new If(attrs, test, then_, else_)

exports.case_ = (attrs, test, map, else_, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Case(test, map, else_, options)])
  else new Case(attrs, test, map, else_)

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
exports.repeat = (attrs, list, itemFn, options) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Repeat(list, itemFn, options)])
  else new Repeat(attrs, list, itemFn)