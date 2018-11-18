{isEven} = require 'dc-util'

import isComponent from './component/isComponent'
import Tag from './component/block/Tag'
{getBindProp, tagNames} = require './dom-util'
{isArray, isObject} = require 'dc-util'
{attrsChildren, toTagChildren, isAttrs} = require './component/util'

#export default
module.exports = exports = {}

tag = (tagName, args...) ->
  [attrs, children] = attrsChildren(args)
  new Tag(tagName, attrs, toTagChildren(children))

for tagName in tagNames
  do (tagName=tagName) -> exports[tagName] = (args...) ->
    tag(tagName, args...)

# Because the name 'html' under dc has been used to instantiate Html component
# So use tagHtml here, instead.
# in client side, html is not necessary, because the dc component must be mounted somewhere
exports.tagHtml = (args...) ->
  tag('html', args...)

inputTypes = 'text checkbox radio date email number'.split(' ')

exports.input = input = (type, attrs, value) ->
  if typeof type == 'object'
    value = attrs
    attrs = type
    type = 'text'
  attrs = Object.assign({type:type}, attrs)
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
      attrs = Object.assign({value:value}, attrs)
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

export default exports