{react} = require('lazy-flow')
{domField} = require '../../dom-util'
{isArray} = require 'dc-util'

module.exports = (items...) ->
  classMap = {}

  method = ->
    if !arguments.length
      lst = []
      method.valid = true
      for klass, value of classMap
        if typeof value == 'function'
          value = value()
        if value then lst.push klass
      lst.join(' ')
    else
      extendClassMap(arguments.slice())
      return

  processClassValue = (name, value) ->
    value = domField value
    oldValue=classMap[name]
    if typeof oldValue == 'function'
      oldValue.offInvalidate method.invalidate
    if !value and oldValue
      method.invalidate()
      delete classMap[name]
    else
      if oldValue!=value # value is a function or true
        method.invalidate()
        if typeof value == 'function'
          value.onInvalidate method.invalidate
        classMap[name] = value

  extendClassMap = (items) ->
    if !items then return
    if !isArray(items) then items = [items]
    for item in items
      if !item then continue
      if typeof item == 'string'
        names = item.trim().split(/\s+(?:,\s+)?/)
        for name in names
          if name[0]=='!' then processClassValue(name[1...], false)
          else processClassValue(name, true)
      else if item instanceof Array
        extendClassMap(item)
      else if item and item.classMap
        # another classFn
        for name, value of item.classMap
          if typeof value != 'function' then value = true
          processClassValue(name, value)
      else if typeof item =='object'
        for name, value of item
          if typeof value != 'function' then value = true
          processClassValue(name, value)

    return

  react method
  extendClassMap(items)
  method.classMap = classMap
  method.valid = !Object.keys(classMap).length

  method.removeClass = (items...) ->
    for item in items
      processClassValue(item, false)

  method.extend = (items...) ->
     extendClassMap(items)
  method