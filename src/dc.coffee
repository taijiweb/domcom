###* @api dc(element) - dc component constructor
 *
 * @param element
###
DomNode = require './DomNode'
{requestAnimationFrame} = require  './dom-util'
{newDcid} = require './util'
{componentCache, readyFnList, _updateComponentMap} = require './config'

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
  for fn in readyFnList then fn()
  return

document.addEventListener 'DOMContentLoaded', dc.onReady, false

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

# dc.updateWhen components, events, updateComponentList, options
# dc.updateWhen setInterval, interval, components..., {clear: -> clearInterval test}
dc.updateWhen =  (components, events, updateList, options) ->
  dc._renderWhenBy('update', components, events, updateList, options)

dc.renderWhen =  (components, events, updateList, options) ->
  dc._renderWhenBy('render', components, events, updateList, options)

dc._renderWhenBy = (method, components, events, updateList, options) ->
  if components instanceof Array
    if updateList not instanceof Array then updateList = [updateList]
    if events instanceof Array
      for component in components
        for event in events
          _renderComponentWhenBy(method, component, event, updateList)
    else
      for component in components
        _renderComponentWhenBy(method, component, events, updateList)
  else if components == setInterval
    if isComponent(events) then addSetIntervalUpdater(method, events, updateList) # updateList is options
    else if events instanceof Array
      for component in events then addSetIntervalUpdater(method, events, updateList)
    else if typeof events == 'number'
      options = options or {}
      options.interval = events
      addSetIntervalUpdater(method, updateList, options)
  else if events instanceof Array
    if updateList not instanceof Array then updateList = [updateList]
    for event in events
      _renderComponentWhenBy(method, components, event, updateList)
  else
    if updateList not instanceof Array then updateList = [updateList]
    _renderComponentWhenBy(method, components, events, updateList)
  return

isComponent = require './core/base/isComponent'

_renderComponentWhenBy = (method, component, event, updateList, options) ->
    if event[...2]!='on' then event = 'on'+event
    if options
      component.eventUpdateConfig[event] = for comp in updateList
        comp.setUpdateRoot()
        [comp, options]
    else
      for item, i in updateList
        updateList[i] = if isComponent(item) then [item, {}] else item
      component.eventUpdateConfig[event] = updateList
      for [comp, _] in updateList
        comp.setUpdateRoot()
    return

addSetIntervalUpdater = (method, component, options) ->
  handler = null
  {test, interval, clear} = options
  fn = ->
    if !test or test() then component[method]()
    if clear and clear() then clearInterval handler
  handler = setInterval(fn, interval or 16)

