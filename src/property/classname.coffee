{react} = require 'lazy-flow'
{domField} = require '../dom-util'
{isArray} = require 'dc-util'

export default module.exports = classname = (items...) ->
  classMap = {}
  if !items
    return {}
  if !isArray(items)
    items = [items]
  for item in items
    if !item then continue
    if typeof item == 'string'
      names = item.trim().split(/(?:\s*,\s*)|s+/)
      for name in names
        classMap[name] = 1
    else if item instanceof Array
      for name in item
        classMap[name] = 1
    if typeof item =='object'
      for name, value of item
        classMap[name] = 1

  return classMap
