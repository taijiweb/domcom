{Component, toComponent, isComponent,
Tag, Text, Comment, Html
If, Case, Func, List,
Pick
Nothing, Defer} = require('./component')

{isEven} = require('dc-util')

extend = require('extend')

exports.isAttrs = isAttrs = (item) ->
  typeof item == 'object' && item!=null && !isComponent(item) && !(item instanceof Array)

{isArray, isObject} = require('dc-util')

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
  if !(args instanceof Array)
    [args]
  else if !args.length
    []
  else if args.length==1
    toTagChildren(args[0])
  else
    args

tag = exports.tag = (tagName, args...) ->
  [attrs, children] = attrsChildren(args)
  new Tag(tagName, attrs, toTagChildren(children))

exports.nstag = (tagName, namespace, args...) ->
  [attrs, children] = attrsChildren(args)
  new Tag(tagName, attrs, toTagChildren(children), namespace)

exports.txt = (attrs, text) ->
  if isAttrs(attrs) then new Tag(null, attrs, [new Text(text)])
  else new Text(attrs)

exports.comment = (attrs, text) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new Comment(text)])
  else
    new Comment(attrs)

exports.cdata = (attrs, text) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new Cdata(text)])
  else
    new Cdata(attrs)

# this is for Html Component, which takes some text as innerHTML
# for <html> ... </html>, please use tagHtml instead
exports.html = (attrs, text, transform) ->
  new Html(attrs, text, transform)

exports.if_ = (attrs, test, then_, else_, merge, recursive) ->
  if isAttrs(attrs) then new Tag(null, attrs, [new If(test, then_, else_, merge, recursive)])
  else new If(attrs, test, then_, merge, recursive)

exports.forceIf = (attrs, test, then_, else_) ->
  # always should NOT merge forced if
  if isAttrs(attrs)
    new Tag(null, attrs, [new If(test, then_, else_, true, false, true)])
  else new If(attrs, test, then_, true, false, true)

exports.mergeIf = (attrs, test, then_, else_, recursive) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new If(test, then_, else_, true, recursive)])
  else
    new If(attrs, test, then_, true, recursive)

exports.recursiveIf = (attrs, test, then_, else_) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new If(test, then_, else_, true, true)])
  else
    new If(attrs, test, then_, true, true)

exports.case_ = (attrs, test, map, else_) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new Case(test, map, else_)])
  else
    new Case(attrs, test, map)

exports.forceCase = (attrs, test, map, else_) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new Case(test, map, else_, true)])
  else new Case(attrs, test, map, true)

exports.cond = (attrs, condComponents..., else_) ->
  if isAttrs(attrs)
    if !isEven(condComponents)
      condComponents.push else_
      else_ = null
    new Tag(null, attrs, [new Cond(condComponents, else_)])
  else
    condComponents.unshift(attrs)
    if !isEven(condComponents)
      condComponents.push else_
      else_ = null
    new Cond(condComponents, else_)

exports.func = (attrs, fn) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new Func(fn)])
  else
    new Func(attrs) # attrs become fn

# pick can NOT wrapped with attrs
# because host must be an object!!!
exports.pick = (host, field, initialContent) ->
  new Pick(host, field, initialContent)

exports.list = list = (attrs, lst...) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new List(lst)])
  else
    lst.unshift(attrs)
    if lst.length==1 then toComponent(lst[0])
    else new List(lst)

# promise is a Promise instance which have .then and .catch the two method
# fulfill: (value, promise, component) ->
# reject: (reason, promise, component) ->
# init: will be converted to component by toComponent
exports.defer = (attrs, promise, fulfill, reject, init) ->
  if isAttrs(attrs)
    new Tag(null, attrs, [new Defer(promise, fulfill, reject, init)])
  else
    new Defer(attrs, promise, fulfill, reject)
