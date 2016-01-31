if typeof window != 'undefined'
  _raf = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame

  exports.requestAnimationFrame = exports.raf = _raf or (callback) ->
    window.setInterval callback, 1000 / 60
    return

  exports.normalizeDomElement = (domElement) ->
    if typeof domElement == 'string'
      domElement = document.querySelector(domElement)
    domElement

exports.getBindProp = (component)  ->
  {tagName} = component
  if !tagName then throw new Error 'trying to bind a Component which is not a Tag'
  else if tagName=='textarea' or tagName=='select' then return 'value'
  else if component.props.type=='checkbox' then return 'checked'
  else return 'value'

if typeof window != 'undefined'
  # add browser compatability for addEventListener and removeEventListener in ie 6, 7, 8
  if document.addEventListener
    exports.addEventListener = (node, name, handler) ->
      node.addEventListener(name, handler, false)
      return
    exports.removeEventListener = (node, name, handler) ->
      node.removeEventListener(name, handler)
      return

  else
    exports.addEventListener = (node, name, handler) ->
      node.attachEvent(name, handler)
      return
    exports.removeEventListener = (node, name, handler) ->
      node.detachEvent(name, handler)
      return

  # Returns true if it is a DOM element
  exports.isElement = (item) ->
    if typeof HTMLElement == "object" then item instanceof HTMLElement
    else item and typeof item == "object" and item != null && item.nodeType == 1 && typeof item.nodeName=="string"

{renew} = require('lazy-flow')

exports.domField = (value) ->

  if !value? then return ''

  if typeof value != 'function'

   if value.then and value.catch
     fn = react -> fn.promiseResult

     value
     .then (result) ->
        fn.promiseResult = result
        fn.invalidate()
     .catch (error) ->
        fn.promiseResult = error
        fn.invalidate()

     return fn

   else return value

  if !value.invalidate then return renew(value)

  value

exports.domValue = (value) ->
  if !value? then return ''
  else if typeof value != 'function' then value
  else
    value = value()
    if !value? then return ''
    else value

# family do not consider exceeding TransformComponent
# a BaseComponent can have only one reference of one component in all of its family
# it's the responsiblility of the user program of domcom to keep no conflicting reference while exceeding TransformComponent
exports.extendChildFamily = (family, child) ->
  for dcid of child.family
    if family[dcid]
      throw new Error 'do not allow to have the same component to be referenced in different location of one List'
    family[dcid] = true
  return
