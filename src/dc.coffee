###* @api dc(element) - dc component constructor
 *
 * @param element
###
DomNode = require './DomNode'
{Component} = require './core'
{requestAnimationFrame} = require  './dom-util'
{newDcid} = require './util'

componentCache = {}
readyFnList = []

module.exports = dc = (element, options={}) ->
  if typeof element == 'string'
    if options.noCache then querySelector(element, options.all)
    else componentCache[element] or componentCache[element] = querySelector(element, options.all)
  else if element instanceof Node
    if options.noCache then new DomNode(element)
    else
      if element.dcid then componentCache[element.dcid]
      else
        element.dcid = newDcid()
        componentCache[element.dcid] = new DomNode(element)
  else if element instanceof DomNode then element
  else throw new Error('error type for dc')

querySelector = (selector, all) ->
  if all then new DomNode(document.querySelectorAll(selector))
  else new DomNode(document.querySelector(selector))

dc.ready = (fn) -> readyFnList.push fn

dc.onReady = ->
  for fn in readyFnList
    fn()
  return

dc.render = render = ->
  for comp in rootComponents
    comp.update()

dc.renderLoop = renderLoop = ->
  requestAnimFrame renderLoop
  render()
  return

window.dcid = newDcid()
# can not write window.$document = dc(document)
# why so strange? browser can predict the document.dcid=1, document.body.dcid=2 and assigns it in advance !!!!!!!
dcid = document.dcid = newDcid()
window.$document = componentCache[dcid] = new DomNode(document)
dcid = document.body.dcid = newDcid()
window.$body = componentCache[dcid] = new DomNode(document.body)

dc.updateWhen = (components, events, updateList, options) ->
  if components instanceof Array
    if events instanceof Array
      for component in events
        for event in events
          _updateWhen(components, event, updateList)
    else
      for component in components
        _updateWhen(component, events, updateList)
  else if events instanceof Array
    for event in events
      _updateWhen(components, event, updateList)
  else
    _updateWhen(components, events, updateList)

exports._updateComponentMap = _updateComponentMap = {}

_updateWhen = (component, event, updateList, options) ->
  triggerMap = updateTriggers[component.dcid] = updateTriggers[component.dcid] or Object.create(null)
  if isComponent(component) and event[...2]!='on'
    event = 'on'+event
  componentMap = triggerMap[event] = triggerMap[event] or []
  for comp in updateList
    dcid = comp.dcid
    if !componentMap[dcid]
      if !comp.findContainerParent(componentMap)
        componentMap[dcid] = comp
        comp.isUpdateRoot = true
        comp.removeChildren(componentMap)
      _updateComponentMap[dcid] = comp
  return

document.addEventListener 'DOMContentLoaded', dc.onReady, false