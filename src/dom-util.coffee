_raf = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame

exports.requestAnimationFrame = exports.raf = _raf or (callback) ->
  window.setInterval callback, 1000 / 60
  return

exports.normalizeDomElement = (domElement) ->
  if typeof domElement == 'string'
    domElement = document.querySelector(domElement)
  domElement

exports.insertNode = insertNode = (parent, child, beforeNode) ->
  if !parent then return
  if parent instanceof Array then parent.push(child)
  else if child instanceof Array
    child.parentNode = parent
    for item in child then insertNode(parent, item, beforeNode)
  else
    if child instanceof Node
      if beforeNode and beforeNode.parentNode==parent then parent.insertBefore(child, beforeNode)
      #else if !child.parentNode then parent.appendChild(child)
      else parent.appendChild(child)
  return

exports.removeNode = removeNode = (parent, child) ->
  if child instanceof Array
    for node in child then removeNode(parent, node)
  else
    # todo: fix the bug about the child parentNode
    if child and child.parentNode==parent then parent.removeChild(child)
  return

createHtmlFragment =  (html) ->
  node = document.createDocumentFragment()
  node.innerHtml = html
  node

createUpdateHtml = ->
  node = document.createDocumentFragment()
  html = @html
  if typeof html == 'function'
    value = html()
    if !value? then value = ''
    node.innerHtml = domFnValue(value)
    @fistChild = node.firstChild
    @lastChild = node.lastChild
    parentNode = @parentNode
    if parentNode
      parentNode.appendChild(node)
    else parentNode = node
    renderParent = @renderParent()
    renderParent.push (@renderTask = {type: UPDATE_HTML, cache: value, html, parentNode:parentNode, fistChild:@firstChild, lastChild:@lastChild})
  else
    if !html? then html = ''
    node.innerHtml = domFnValue(@html)
    @fistChild = node.firstChild
    @lastChild = node.lastChild
    parentNode = @parentNode
    if parentNode
      parentNode.appendChild(node)
    else parentNode = node
  node

exports.getBindProp = (component)  ->
  {tagName} = component
  if !tagName then throw new Error 'trying to bind a Component which is not a Tag'
  else if tagName=='textarea' or tagName=='select' then return 'value'
  else if component.attrs.type=='checkbox' then return 'checked'
  else return 'value'

{renew} = require './flow'

exports.domValue = (val) ->
  if !val? then return ''
  if typeof val != 'function' then return val
  if !val.invalidate then return renew(val)
  val

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
