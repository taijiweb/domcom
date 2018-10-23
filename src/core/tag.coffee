extend = require('extend')

{isEven} = require('dc-util')

extend = require('extend')

isComponent = require('./components/isComponent')
Tag = require './components/Tag'
{getBindProp} = require '../dom-util'


exports.isAttrs = isAttrs = (item) ->
  typeof item == 'object' && item!=null && !isComponent(item) && !(item instanceof Array)

{isArray, isObject} = require('dc-util')

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

tag = (tagName, args...) ->
  [attrs, children] = attrsChildren(args)
  new Tag(tagName, attrs, toTagChildren(children))

tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl"+
    " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object"+
    " ol optgroup option p param pre q samp script select small span strong style sub sup"+
    " table tbody td textarea tfoot th thead title tr tt ul var header footer section svg iframe" +
    " article aside bdi details dialog figcaption figure footer header main mark menuitem meter nav progress rp rt ruby summary time wbr"
tagNames = tagNames.split(' ')

for tagName in tagNames
  do (tagName=tagName) -> exports[tagName] = (args...) ->
    tag(tagName, args...)

# Because the name 'html' under dc has been used to instantiate Html component
# So use tagHtml here, instead.
# in client side, html is not necessary, because the dc component must be mounted somewhere
exports.tagHtml = (args...) ->
  tag('html', args...)

inputTypes = 'text checkbox radio date email number'.split(' ')

input = exports.input = (type, attrs, value) ->
  if typeof type == 'object'
    value = attrs
    attrs = type
    type = 'text'
  attrs = extend({type:type}, attrs)
  component = tag('input', attrs)
  if value?
    component.prop(getBindProp(component), value)
    if value.isDuplex
      component.bind('onchange', ((event, node) -> value.call(this, node.value)), 'before')
  component

for type in 'text checkbox radio date email tel number'.split(' ')
  do (type=type) ->
    exports[type] =
      (value, attrs) ->
        if typeof value =='object'
          temp = attrs
          attrs = value
          value = temp
        attrs = attrs || {}
        input(type, attrs, value)

exports.textarea = (attrs, value) ->
  if isAttrs(attrs)
    if  value?
      attrs = extend({value:value}, attrs)
      component = tag('textarea', attrs)
      if value.isDuplex
        component.bind('onchange', ((event, node) -> value.call(this, node.value)), 'before')
    else
      component = tag('textarea', attrs)
  else
    if attrs? # attrs is value
      component = tag('textarea', {value:attrs})
      if attrs.isDuplex
        component.bind('onchange', ((event, node) -> attrs.call(this, node.value)), 'before')
    else
      component = tag('textarea')
  component
