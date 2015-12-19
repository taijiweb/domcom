extend = require 'extend'

{tag} = require('./instantiate')
{getBindProp} = require '../dom-util'

tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl"+
    " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object"+
    " ol optgroup option p param pre q samp script select small span strong style sub sup"+
    " table tbody td textarea tfoot th thead title tr tt ul var header footer section"+
    " svg iframe"
tagNames = tagNames.split(' ')

for tagName in tagNames
  do (tagName=tagName) -> exports[tagName] = (args...) ->
    tag(tagName, args...)

# Because the name 'html' under dc has been used to instantiate Html component
# So use tagHtml instead here
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
    if value.isDuplex then component.bind('onchange', ((event, comp) -> value(@value)), 'before')
  component

for type in 'text checkbox radio date email tel number'.split(' ')
  do (type=type) -> exports[type] = (value, attrs) ->
    if typeof value =='object'
      temp = attrs
      attrs = value
      value = temp
    attrs = attrs or {}
    input(type, attrs, value)

exports.textarea = (attrs, value) ->
  if isAttrs(attrs)
    if  value?
      attrs = extend({value:value}, attrs)
      component = tag('textarea', attrs)
      if value.isDuplex then component.bind('onchange', ((event, comp) -> value(@value)), 'before')
    else  component = tag('textarea', attrs)
  else
    if attrs? # attrs is value
      component = tag('textarea', {value:attrs})
      if attrs.isDuplex then component.bind('onchange', ((event, comp) -> attrs(@value)), 'before')
    else  component = tag('textarea')
  component
