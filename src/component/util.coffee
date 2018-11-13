import isComponent from './isComponent'
import React, {Component} from 'React'
{isArray, isObject} = require 'dc-util'

module.exports = exports = {}

exports.getImage = (item) ->
  if isComponent(item) && item.getImage
    return item.getImage()
  else
    return item

exports.isAttrs = isAttrs = (item) ->
  typeof item == 'object' && item!=null && !isComponent(item) && !(item instanceof Array)

exports.attrsChildren = (args) ->
  attrs = args[0]
  if !args.length then [{}, []]
  else if `attrs==null` then [{}, args.slice(1)]
  else if attrs instanceof Array then [{}, args]
  else if typeof attrs == 'function' then [{}, args]
  else if typeof attrs == 'object'
    if isComponent(attrs) then [{}, args]
    else [attrs, args.slice(1)]
  else [{}, args]

exports.toTagChildren = toTagChildren = (args) ->
  if !(args instanceof Array)
    [args]
  else if !args.length
    []
  else if args.length==1
    toTagChildren(args[0])
  else
    args

export default exports