import {react} from 'lazy-flow'
import {domField} from '../dom-util'
import {isArray} from 'dc-util'

export default classFn = (items...) ->
  classMap = {}

  method = ->
    if !arguments.length
      lst = []
      method.valid = true
      for klass, value of classMap
        if typeof value == 'function'
          value = value.call(this)
        if value
          lst.push klass
      lst.join(' ')
    else
      extendClassMap([].slice(arguments))
      return

  processClassValue = (name, value) ->
    oldValue=classMap[name]
    if typeof oldValue == 'function'
      oldValue.offInvalidate method.invalidate
    if oldValue!=value # value is a function or true
      method.invalidate()
      if typeof value == 'function' && value.onInvalidate
        value.onInvalidate method.invalidate
    if value
      classMap[name] = value
    else
      delete classMap[name]

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
      else if item && item.classMap
        # another classFn
        for name, value of item.classMap
          processClassValue(name, value)
      else if typeof item =='object'
        for name, value of item
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

  method.clone = ->
    newClassName = classFn()
    newClassName.extend(method)

  method