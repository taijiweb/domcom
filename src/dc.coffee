###* @api dc(element) - dc component constructor
 *
 * @param element
###
DomNode = require './DomNode'
{requestAnimationFrame, raf, isElement} = require  './dom-util'
{newDcid, isEven} = require './util'
{componentCache, readyFnList, _updateComponentMap, directiveRegistry, renderCallbackList, rootComponents} = require './config'
isComponent = require './core/base/isComponent'


module.exports = dc = (element, options={}) ->
  if typeof element == 'string'
    if options.noCache then querySelector(element, options.all)
    else componentCache[element] or componentCache[element] = querySelector(element, options.all)
  else if element instanceof Node or element instanceof NodeList or element instanceof Array
    if options.noCache then new DomNode(element)
    else
      if element.dcid then componentCache[element.dcid]
      else
        element.dcid = newDcid()
        componentCache[element.dcid] = new DomNode(element)
  else throw new Error('error type for dc')

querySelector = (selector, all) ->
  if all then new DomNode(document.querySelectorAll(selector))
  else new DomNode(document.querySelector(selector))

# register directive
# directiveHandlerGenerator: (...) -> (component) -> component
dc.directives = (directiveName, directiveHandlerGenerator) ->
  if arguments.length==1
    for name, generator of directiveName
      if name[0]!='$' then name = '$'+name
      directiveRegistry[name] = generator
  else
    if directiveName[0]!='$' then directiveName = '$'+directiveName
    directiveRegistry[directiveName] = directiveHandlerGenerator

dc.onReady = (callback) -> readyFnList.push callback

dc.offReady = (callback) ->
  readyFnList.indexOf(callback)>=0 and  readyFnList.splice(index, 1)

dc.ready = ->
  for callback in readyFnList then callback()
  return

document.addEventListener 'DOMContentLoaded', dc.ready, false

dc.render = render = ->
  for callback in renderCallbackList
    callback()

dc.onRender = (callback) ->
  renderCallbackList.push callback

dc.offRender = (callback) ->
  renderCallbackList.indexOf(callback)>=0 and  renderCallbackList.splice(index, 1)

dc.renderLoop = renderLoop = ->
  requestAnimFrame renderLoop
  render()
  return

window.dcid = newDcid()
# can not write window.$document = dc(document)
# why so strange? browser can predict the document.dcid=1, document.body.dcid=2 and assigns it in advance !!!!!!!
dcid = document.dcid = newDcid()
window.$document = dc.$document = componentCache[dcid] = new DomNode(document)
dcid = document.body.dcid = newDcid()
window.$body = dc.$body = componentCache[dcid] = new DomNode(document.body)

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

  else if components == raf
    if isComponent(events) then addRafUpdater(method, events, updateList) # updateList is options
    else if events instanceof Array
      for component in events then addRafUpdater(method, events, updateList)

  else if events instanceof Array
    if updateList not instanceof Array then updateList = [updateList]
    for event in events
      _renderComponentWhenBy(method, components, event, updateList)

  else
    if updateList not instanceof Array then updateList = [updateList]
    _renderComponentWhenBy(method, components, events, updateList)

  return

# mtehod: 'update' or 'render'
_renderComponentWhenBy = (method, component, event, updateList, options) ->
    if event[...2]!='on' then event = 'on'+event
    if options
      options.method = method
      component.eventUpdateConfig[event] = for comp in updateList then [comp, options]
    else
      for item, i in updateList
        updateList[i] = if isComponent(item) then [item, {method}] else item
      component.eventUpdateConfig[event] = updateList
    return

addSetIntervalUpdater = (method, component, options) ->
  handler = null
  {test, interval, clear} = options
  callback = ->
    if !test or test() then component[method]()
    if clear and clear() then clearInterval handler
  handler = setInterval(callback, interval or 16)

addRafUpdater = (method, component, options) ->
  {test, clear} = options
  callback = ->
    if !test or test() then component[method]()
    if clear and clear() then dc.offRender callback
  dc.onRender callback