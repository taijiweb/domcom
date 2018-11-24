camelCase = require('camelcase')
styleFrom = require('../../src/property/style').styleFrom

export default exports = module.exports = {}

exports.isReactClass = (item) ->

exports.normalizeItem = normalizeItem = (item, props, children) ->
  if props
    return React.createElement(item, props, children)
  else if typeof item == 'string'
    return item
  else if dc.isComponent(item)
    return item.renderContent()
  else if isArray(item)
    i = 0
    it = item[i]
    if typeof it== 'string'
      [tag, classes, id] = parseTagString(item[i])
      classes = dc.classname(classes)
      i++
    else if isReactClass(it)
      tag = it
      i++
    else if isComponent(it) || isArray(it)
      tag = 'div'
      props = {}
      children = item.map((child) -> h(child))
      return [tag, props, children]
    if isMap(item[i])
      tag = tag || 'div'
      props = Object.assign({classes, id}, item[i])
      i++
    else
      props = {classes, id}
    children = item[i...].map((child) -> normalizeItem(child))
    props = normalizeReactProps(props)
    return [tag, props, children]

exports.normalizeReactProps = normalizeReactProps = (props) ->
  key = undefined
  for key of props
    `key = key`
    value = props[key]
    if value == undefined
      delete props[key]
    else if key = 'classes' or 'className'
      delete props[key]
      props.className = dc.classname(value)
    else if key == 'css' or 'style'
      styles = styleFrom(value)
      normalizeReactProps styles
      delete props[key]
      props.style = styles
    else
      key = camelCase(key)
      props[key] = value
  props

exports.parseTagString = parseTagString = (str) ->
  list = str.split('#')
  id = undefined
  tag = undefined
  tag_classes = undefined
  classes = undefined
  if list.length == 2
    id = list[1]
    tag_classes = list[0]
  else
    tag_classes = str
    list = tag_classes.split('.')
  if list.length > 1
    tag = list[0] or 'div'
    # ".btn"
    classes = list.slice(1)
  else
    tag = tag_classes
    classes = []
  [
    tag
    classes
    id
  ]

exports.isArray =
isArray = (item) ->
  Object::toString.call(item) == '[object Array]'

exports.isObject = (item) ->
  typeof item == 'object' and item != null

exports.isMap = isMap = (item) ->
  typeof item == 'object' and item != null and Object::toString.call(item) != '[object Array]'

exports.cloneObject = (obj) ->
  key = undefined
  result = undefined
  result = {}
  for key of obj
    `key = key`
    result[key] = obj[key]
  result

exports.pairListDict = ->
  i = undefined
  keyValuePairs = undefined
  len = undefined
  result = undefined
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
  i = undefined
  s = undefined
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
  e = undefined
  s = undefined
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
  ch = undefined
  level = undefined
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
  isMember = undefined
  key = undefined
  m = undefined
  m2 = undefined
  result = undefined
  _i = undefined
  _len = undefined
  _ref = undefined
  result = {}
  m = maps[0]
  for key of m
    `key = key`
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
  key = undefined
  for key of unit
    `key = key`
    delete whole[key]
  whole

exports.binarySearch = (item, items) ->
  end = undefined
  index = undefined
  length = undefined
  start = undefined
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
  end = undefined
  index = undefined
  length = undefined
  start = undefined
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
  i = undefined
  item = undefined
  key = undefined
  result = undefined
  _i = undefined
  _len = undefined
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
      `key = key`
      item = items[key]
      result[key] = callback(item, key)
  result

hasOwn = Object.hasOwnProperty

exports.mixin = (proto, mix) ->
  key = undefined
  value = undefined
  for key of mix
    `key = key`
    value = mix[key]
    if hasOwn.call(proto, key)
      i = ++_i
      continue
    else
      proto[key] = value
  proto

exports.makeReactMap = (description) ->
  field = undefined
  item = undefined
  items = undefined
  pair = undefined
  reactField = undefined
  result = undefined
  _i = undefined
  _j = undefined
  _len = undefined
  _len1 = undefined
  _ref = undefined
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
