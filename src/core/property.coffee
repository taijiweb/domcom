{isArray, cloneObject} = require '../util'
{domValue} = require '../dom-util'
{react} = require '../flow'
extend = require '../extend'
{isComponent} = require './base/isComponent'

exports.extendEventValue = extendEventValue = (props, prop, value, before) ->
  oldValue = props[prop]
  if !oldValue then oldValue = []
  else if oldValue not instanceof Array then oldValue = [oldValue]
  if !value then value = []
  else if value not instanceof Array then value = [value]
  if before then props[prop] = value.concat(oldValue)
  else props[prop] = oldValue.concat(value)

exports.extendAttrs = (attrs, obj, options={}) ->
  if !obj then return attrs
  else if !attrs then return obj
  objClass = classFn([obj.class, obj.className])
  if options.replaceClass then attrs.className = objClass
  else
    attrs.className = classFn([attrs.class, attrs.className])
    delete attrs.class
    attrs.className = classFn([attrs.className, objClass])
  if obj.style then extend styleFrom(attrs.style), obj.style
  for key, value of obj
    if key[..1]=='on'
      if options['replace_'+key] or options.replaceEvents then attrs[key] = value
      else extendEventValue(attrs, key, value)
    else attrs[key] = value
  attrs

exports.overAttrs = overAttrs = (attrs, obj) ->
  if !obj
    attrs = extend({}, attrs)
    if attrs.style then attrs.style = extend({}, styleFrom(attrs.style))
    attrs
  else if !attrs then obj
  else
    for key, value of attrs
      if !obj[key]? then obj[key] = value
      if key=='style' then obj[key] = overAttrs(attrs[key], obj[key])
    obj

exports.classFn = classFn = (items...) ->
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
    value = domValue value
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
  method.removeClass = (items...) -> for item in items then processClassValue(item, false)
  method.extend = (items...) -> extendClassMap(items)
  method

exports.styleFrom = styleFrom = (value) ->
  if typeof value == 'string'
    result = {}
    value = value.trim().split(/\s*;\s*/)
    for item in value
      item = item.trim()
      if !item then continue
      [key, v] = item.split /\s*:\s*/
      result[key] = v
    result
  else if value instanceof Array
    result = {}
    for item in value
      if typeof item == 'string'
        item = item.trim()
        if !item then continue
        [key, value] = item.split /\s*:\s*/
      else [key, value] = item
      result[key] = value
    result
  else if value and typeof value != 'object' then {}
  else cloneObject(value)

config = require '../config'

exports.eventHandlerFromArray = (callbackList, eventName, component) ->
  (event) ->
    node = component.node
    for fn in callbackList then fn and fn.call(node, event, component)
    updateList = component.eventUpdateConfig[eventName]
    if updateList
      for [comp, options] in updateList
        # the comp is in updateList, so it need to be updated
        # if config.useSystemUpdating then update this component in dc's system update scheme
        if options.alwaysUpdating or !config.useSystemUpdating then comp[options.method]()
    if !event then return
    !event.executeDefault and event.preventDefault()
    !event.continuePropagation and event.stopPropagation()
    return

attrPropNameMap = {'for':'htmlFor'}
exports.attrToPropName = (name) ->
  if newName=attrPropNameMap[name] then newName
  pieces = name.split('-')
  if pieces.length==1 then return name
  i = 1
  len = pieces.length
  while i<len
    pieces[i] = pieces[i][0].toUpperCase()+pieces[i][1...]
    i++
  pieces.join('')
