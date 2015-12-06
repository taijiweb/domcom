{Component, toComponent, isComponent,
Tag, Text, Comment, Html
If, Case, Func, List, Each,
ActiveView
Nothing, Defer} = require './base'
{isEven, numbers} = require 'dc-util'

{isAttrs} = require './util'

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
  if isAttrs(attrs) then new Tag('div', attrs, [new Html(text, transform)])
  else new Html(attrs, text)

exports.if_ = (attrs, test, then_, else_) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new If(test, then_, else_)])
  else new If(attrs, test, then_, else_)

exports.case_ = (attrs, test, map, else_) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Case(test, map, else_)])
  else new Case(attrs, test, map, else_)

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

exports.activeView = (attrs, content) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new ActiveView(content)])
  else new ActiveView(attrs) # attrs become content

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
exports.each = (attrs, list, itemFn) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Each(list, itemFn)])
  # attrs become list, list become itemFn
  else new Each(attrs, list)

exports.every = every = (attrs, list, itemFn) ->
  if isAttrs(attrs)

    if !list then return new Nothing()

    children = []
    for item, i in list
      children.push itemFn(item, i, list)
    new Tag('div', attrs, [new List(children)])
  else

    if !attrs then return new Nothing()

    # attrs become list, list become itemFn
    children = []
    for item, i in attrs
      children.push list(item, i, attrs)
    new List(children)

# all can not use attrs directly
exports.all = (hash, itemFn) ->
    if !hash then return new Nothing()

    children = []
    i = 0
    for key, value of hash
      if !hash.hasOwnProperty((key)) then break
      children.push itemFn(key, value, i, hash)
      i++
    new List(children)

# each(0...n , itemFn) if n is function
# otherwise every(0...n, itemFn)
exports.nItems = (attrs, n, itemFn) ->
  if isAttrs(attrs)
    if typeof n == 'function'
      new Tag('div', attrs, [new Each(numbers(n), itemFn)])
    else new Tag('div', every(numbers(n), itemFn))
  else
    if typeof attrs == 'function'
      new Each(numbers(attrs), n)
    else every(numbers(attrs), n)

# promise is a promise, which have .then and .catch the two method
# fulfill: (value, promise, component) ->
# reject: (reason, promise, component) ->
# init: will be converted to component by toComponent
exports.defer = (attrs, promise, fulfill, reject, init) ->
  if isAttrs(attrs) then new Tag('div', attrs, [new Defer(promise, fulfill, reject, init)])
  else new Defer(attrs, promise, fulfill, reject)

exports.clone = (attrs, src) ->
  if isAttrs(attrs) then new Tag('div', attrs, [toComponent(src).clone()])
  else toComponent(attrs).clone(src)
