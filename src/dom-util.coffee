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
  else if component.attrs.type=='checkbox' then return 'checked'
  else return 'value'

{renew} = require './flow/index'

exports.domValue = (value) ->

  if !value? then return ''

  if typeof value != 'function'

   if value.then and x.catch
     fn = react -> fn.promiseResult

     value.then (value) ->
        fn.promiseResult = value
        fn.invalidate()

     .catch (error) ->
        fn.promiseResult = error
        fn.invalidate()

     return fn

   else return value

  if !value.invalidate then return renew(value)

  value

# family do not consider exceeding TransformComponent
# a BaseComponent can have only one reference of one component in all of its family
# it's the responsiblility of the user program of domcom to keep no conflicting reference while exceeding TransformComponent
exports.checkConflictOffspring = (family, child) ->
  childDcid = child.dcid
  for dcid of child.family
    if family[dcid]
      throw new Error 'do not allow to have the same component to be referenced in different location of one List'
    family[dcid] = true
  return
