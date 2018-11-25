camelCase = require('camelcase')

export default exports = module.exports = {}

exports.styleFrom = styleFrom = (items...) ->
  result = {}
  for item in items
    if typeof item == 'string'
      item = item.trim()
      if !item
        continue
      defs = item.split(/\s*;\s*/)
      for def in defs
        if !def
          continue
        [key, value] = def.split /\s*:\s*/
        if !key || !value
          dc.error 'format error in css rules: empty key'
        else if !value
          dc.error 'format error in css rules: empty value'
        key  = camelCase key
        result[key] = value
    else if isMap item
      Object.assign result, item
  return result

exports.classname = classname = (items...) ->
  classMap = {}
  for item in items
    if !item
      continue
    else if typeof item == 'string'
      names = item.trim().split(/(?:\s*,\s*)|s+/)
      for name in names
        classMap[name] = 1
    else if isArray item
      for name in item
        classMap[name] = 1
    else if isObject item
      Object.assign(classMap, item)

  return classMap

exports.isReactClass = isReactClass = (item) ->
exports.isReactClass = isReactClass = (item) ->
  # investigated on both CreateClass and ES6 extends react.Component
  item && item.prototype && item.prototype.isReactComponent

exports.normalizeItem = normalizeItem = (item, props, children) ->
  if props
    return React.createElement(item, props, children)
  else if typeof item == 'string'
    return item
  else if dc.isComponent(item)
    if item.needProxy
      return item.makeProxyViewItem()
    else
      item = item.getView()
      return normalizeItem item
  else if isArray(item)
    i = 0
    it = item[i]
    if typeof it== 'string'
      [tag, classes, id, css, inputType] = parseTagString(item[i])
      classes = classname(classes)
      css = styleFrom(css)
      i++
    else if isReactClass(it)
      tag = it
      i++
      it = item[i]
      if typeof it == 'string' && it
        if it.match /^\.|^#/
          [_, classes, id, css, inputType] = parseTagString(item[i])
          classes = classname(classes)
          css = styleFrom(css)
          i++
          it = item[i]
    else if dc.isComponent(it) || isArray(it)
      tag = 'div'
      props = {}
      children = item.map((child) -> normalizeItem(child))
      return [tag, props, children]
    props = null
    it = item[i]
    while isMap(it)
      props = Object.assign({id}, it)
      tag = tag || it.tag || 'div'
      delete props.tag
      classes = classname(classes, it.classes, it.className)
      delete props.classes
      props.className = classes
      css = styleFrom(css, it.css, it.style)
      delete props.css
      props.style = css
      i++
      it = item[i]
    if !props
      props = {className:classes, id, style:styleFrom(css)}
    if inputType
      props.type = inputType
    children = item[i...].map((child) -> normalizeItem(child))
    props = normalizeReactProps(props, typeof tag == 'string')
    return [tag || 'div', props, children]

exports.normalizeReactProps = normalizeReactProps = (props, camel = true) ->
  for key of props
    value = props[key]
    if camel
      delete props[key]
      key = camelCase(key)
    if value == undefined
      delete props[key]
    else if key == 'className'
      classMap = classname(value)
      if classes = Object.keys(classMap).filter((key) -> classMap[key]).join(' ')
        props.className = classes
      else
        delete props.className
    else if key == 'style'
      if Object.keys(value).length
        props.style = camelCaseProps value
      else
        delete props.style
    else if camel
      props[key] = value
  props

exports.camelCaseProps = camelCaseProps = (props) ->
  result = {}
  for key of props
    value = props[key]
    key = camelCase key
    result[key] = value
  result

inputTypes = {}

for type in 'text checkbox radio date email tel number password'.split(' ')
  inputTypes[type] = 1

# tag.class#id##css
exports.parseTagString = parseTagString = (str) ->
  str = str.trim()
  list = str.split('##')
  if list.length == 2
    css = list[1].trim()
    str = list[0].trim()
  list = str.split('#')
  if list.length == 2
    id = list[1].trim()
    str = list[0].trim()
  list = str.split('.')
  if list.length > 1
    tag = list[0]
    classes = classname list.slice(1)
  else
    tag = str
    classes = []
  if inputTypes[tag]
    inputType = tag
    tag = 'input'
  [tag || 'div', classes, id, css, inputType]

exports.isArray = isArray =
isArray = (item) ->
  Object::toString.call(item) == '[object Array]'

exports.isObject = isObject = (item) ->
  typeof item == 'object' and item != null

exports.isMap = isMap = (item) ->
  typeof item == 'object' and item != null && item.constructor == Object

exports.cloneObject = (obj) ->
  result = {}
  for key of obj
    
    result[key] = obj[key]
  result

exports.pairListDict = ->
  keyValuePairs = if 1 <= arguments.length then __slice.call(arguments, 0) else []
  if keyValuePairs.length == 1
    keyValuePairs = keyValuePairs[0]
  len = keyValuePairs.length
  i = 0
  result = {}
  while i < len
    result[keyValuePairs[i]] = keyValuePairs[i + 1]
    i += 2
  result

dupStr = (str, n) ->
  s = ''
  i = 0
  while i++ < n
    s += str
  s

exports.newLine = (str, indent, addNewLine) ->
  if addNewLine
    '\n' + dupStr(' ', indent) + str
  else
    str

exports.funcString = (fn) ->
  if typeof fn != 'function'
    if fn == null
      return 'null'
    if fn.getBaseComponent
      return fn.toString()
    else
      try
        return JSON.stringify(fn)
      catch _error
        e = _error
        return fn.toString()
  s = fn.toString()
  if fn.invalidate
    return s
  if s.slice(0, 12) == 'function (){'
    s = s.slice(12, s.length - 1)
  else if s.slice(0, 13) == 'function () {'
    s = s.slice(13, s.length - 1)
  else
    s = s.slice(9)
  s = s.trim()
  if s.slice(0, 7) == 'return '
    s = s.slice(7)
  if s[s.length - 1] == ';'
    s = s.slice(0, s.length - 1)
  'fn:' + s

globalDcid = 1

exports.newDcid = ->
  globalDcid++

exports.isEven = (n) ->
  if n < 0
    n = -n
  while n > 0
    n -= 2
  n == 0

exports.matchCurvedString = (str, i) ->
  if str[i] != '('
    return
  level = 0
  while ch = str[++i]
    if ch == '\\'
      if !(ch = str[++i])
        return
    else if ch == '('
      level++
    else if ch == ')'
      if level == 0
        return ++i
      else
        level--
  return

exports.intersect = (maps) ->
  result = {}
  m = maps[0]
  for key of m
    isMember = true
    _ref = maps.slice(1)
    _i = 0
    _len = _ref.length
    while _i < _len
      m2 = _ref[_i]
      if !m2[key]
        isMember = false
        break
      _i++
    isMember and (result[key] = m[key])
  result

exports.substractSet = (whole, unit) ->
  for key of unit
    delete whole[key]
  whole

exports.binarySearch = (item, items) ->
  length = items.length
  if !length
    return 0
  if length == 1
    if items[0] >= item
      return 0
    else
      return 1
  start = 0
  end = length - 1
  loop
    index = start + Math.floor((end - start) / 2)
    if start == end
      if items[index] >= item
        return index
      else
        return index + 1
    else if item == items[index]
      return index
    if item == items[index + 1]
      return index + 1
    else if item < items[index]
      end = index
    else if item > items[index + 1]
      start = index + 1
    else
      return index + 1
  return

exports.binaryInsert = (item, items) ->
  length = items.length
  if !length
    items[0] = item
    return 0
  if length == 1
    if items[0] == item
      return 0
    else if items[0] > item
      items[1] = items[0]
      items[0] = item
      return 0
    else
      items[1] = item
      return 1
  start = 0
  end = length - 1
  loop
    index = start + Math.floor((end - start) / 2)
    if start == end
      if items[index] == item
        return index
      else if items[index] > item
        items.splice index, 0, item
        return index
      else
        items.splice index + 1, 0, item
        return index + 1
    else if item == items[index]
      return index
    if item == items[index + 1]
      return index + 1
    else if item < items[index]
      end = index
    else if item > items[index + 1]
      start = index + 1
    else
      items.splice index + 1, 0, item
      return index + 1
  return

exports.foreach = (items, callback) ->
  if !items
    return
  if isArray(items)
    result = []
    i = _i = 0
    _len = items.length
    while _i < _len
      item = items[i]
      result.push callback(item, i)
      i = ++_i
  else
    result = {}
    for key of items
      
      item = items[key]
      result[key] = callback(item, key)
  result

hasOwn = Object.hasOwnProperty

exports.mixin = (proto, mix) ->
  for key of mix
    
    value = mix[key]
    if hasOwn.call(proto, key)
      i = ++_i
      continue
    else
      proto[key] = value
  proto

exports.makeReactMap = (description) ->
  result = {}
  items = description.split(/\s*,\s*/)
  _i = 0
  _len = items.length
  while _i < _len
    item = items[_i]
    pair = item.trim().split(/\s*:\s*/)
    if pair.length == 1
      result[pair[0]] = ''
    else
      reactField = pair[1]
      _ref = pair[0].split(/\s+/)
      _j = 0
      _len1 = _ref.length
      while _j < _len1
        field = _ref[_j]
        result[field] = reactField
        _j++
    _i++
  result
