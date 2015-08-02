extend = require '../extend'

{tag} = require('./instantiate')
{extendEventValue} = require './property'

tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl"+
    " dt em fieldset form h1 h2 h3 h4 h5 h6 head html hr i img input ins kbd label legend li link map meta noscript object"+
    " ol optgroup option p param pre q samp script select small span strong style sub sup"+
    " table tbody td textarea tfoot th thead title tr tt ul var header footer section"
tagNames = tagNames.split(' ')

for tagName in tagNames
  do (tagName=tagName) -> exports[tagName] = ->
    tag(tagName, arguments...)

inputTypes = 'text textarea checkbox radio date email number'.split(' ')

getInputProp = (type)  ->
  if type=='checkbox' then return 'checked'
  else return 'value'

input = exports.input = (type, attrs, value) ->
  if typeof type == 'object'
    value = attrs
    attrs = type
    type = 'text'
  attrs = extend({type:type}, attrs)
  if value?
    attrs[getInputProp(type)] = value
    if value.setable then extendEventValue attrs, 'onchange', ((event, comp) -> value(@value)), 'before'
  tag('input', attrs)

for type in 'text textarea checkbox radio date email number'.split(' ')
  do (type=type) -> exports[type] = (value, attrs) ->
    if typeof value =='object'
      temp = attrs
      attrs = value
      value = temp
    attrs = attrs or Object.create(null)
    input(type, attrs, value)
