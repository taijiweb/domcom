{isArray, cloneObject} = require '../util'
extend = require '../extend'

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
  if options.replaceDirectives
    attrs.directives = obj.directives
  else if obj.directives
    if !attrs.directives
      attrs.directives = obj.directives
    else
      if attrs.directives not instanceof Array
        attrs.directives = [attrs.directives]
      if value not instanceof Array
        attrs.directives.push value
      else attrs.directives.push.apply attrs.directives, value
  for key, value of obj
    if key[..1]=='on'
      if options['replace_'+key] or options.replaceEvents then attrs[key] = value
      else extendEventValue(attrs, key, value)
    else attrs[key] = value
  attrs

overAttrs = (attrs, obj) ->
  if !obj
    attrs = extend(Object.create(null), attrs)
    if attrs.style then attrs.style = extend({}, styleFrom(attrs.style))
    attrs
  else if !attrs then obj
  else
    for key, value of attrs
      if !obj[key]? then obj[key] = value
    obj

exports.classFn = classFn = (items...) ->
  classMap = Object.create(null)

  fn = ->
    if !arguments.length
      lst = []
      needUpdate = false
      for klass, value of classMap
        if typeof value == 'function'
          value = value()
          needUpdate = true
        if value then lst.push klass
      fn.needUpdate = needUpdate
      lst.join(' ')
    else
      extendClassMap(arguments.slice())
      return

  processClassValue = (name, value) ->
    if !value and classMap[name]
      fn.needUpdate = true
      delete classMap[name]
    else
      if classMap[name]!=value # value is a function or true
        fn.needUpdate = true
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

  fn.needUpdate = false
  extendClassMap(items)
  fn.classMap = classMap
  fn.removeClass = (items...) -> for item in items then processClassValue(item, false)
  fn.extend = (items...) -> extendClassMap(items)
  fn

exports.styleFrom = (value) ->
  if typeof value == 'string'
    result = Object.create(null)
    value = value.trim().split(/\s*;\s*/)
    for item in value
      item = item.trim()
      if !item then continue
      [key, v] = item.split /\s*:\s*/
      result[key] = v
    result
  else if value instanceof Array
    result = Object.create(null)
    for item in value
      if typeof item == 'string'
        item = item.trim()
        if !item then continue
        [key, value] = item.split /\s*:\s*/
      else [key, value] = item
      result[key] = value
    result
  else if value and typeof value != 'object' then Object.create(null)
  else cloneObject(value)

exports.updateProp = (prop, value, cache, element) ->
  if typeof value == 'function'
    value = value()
    isFunc = true
  else dynamic = false
  if !value? then value = ''
  if cache[prop]!=value
    element[prop] = value
  isFunc

exports.eventHandlerFromArray = (callbackList, node, component) ->
  (event) ->
    for fn in callbackList then fn and fn.call(node, event, component)
    if !event then return
    if !event.executeDefault
      event.preventDefault()
    if !event.continuePropagation
      event.stopPropagation()
    return

exports._specialProperties = _specialProperties = {
}

# special property handler: (baseComponent, prop, value) ->
#  if arguments.length == 2 then return the computed value of baseComponent's prop
#  else if arguments == 3 then set the computed value of baseComponent's porp
#  else error
exports.registerSpecial = (key, handler) -> _specialProperties[key] = handler