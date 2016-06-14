{isArray} = require('dc-util')

isComponent = require('./core/base/isComponent')

if typeof window != 'undefined'
  for vendor in  ['ms', 'moz','webkit','o']
    if window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame']
      window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame']
      break
  if !window.requestAnimationFrame
    lastTime = 0
    window.requestAnimationFrame = (callback) ->
      currTime = (new Date).getTime()
      timeToCall = Math.max(0, 16 - (currTime - lastTime))
      id = window.setTimeout((->
        callback currTime + timeToCall
        return
      ), timeToCall)
      lastTime = currTime + timeToCall
      id

  if !window.cancelAnimationFrame
    window.cancelAnimationFrame = (id) ->
      clearTimeout id
      return

dc.reset = ->
  dc.renderBySystemLoop = false
  dc.listeners = {}
  dc.rootComponentMap = {}

dc.reset()

dc.render = (force) ->
  dc.emit('willRender')
  if !dc.valid
    dc.valid = true
    rootComponentMap = dc.rootComponentMap
    dc.rootComponentMap = {}
    for dcid, component in rootComponentMap
      component.render(true)
  dc.emit('didRender')

dc.rafRender = rafRender = ->
  dc.renderBySystemLoop = true
  requestAnimFrame(rafRender)
  dc.render(true)
  return

# dc.renderWhen component, events, options
# dc.renderWhen setInterval, interval, {clear: -> clearInterval test}
dc.renderWhen =  (component, events, options) ->
  if typeof events == 'string'
    events = events.split(/\s+/)
  if isComponent(component)
    component = [component]
  if component instanceof Array
    for comp in component
      for event in events
        renderWhenComponentEvent(comp, event, options)

  else if component == window.setInterval
    {test, clear, components} = options
    for component in components
      component.asRenderHolder()
    handler = null

    callback = ->
      if !test || test()
        for component in components
          component.render()
      if clear && clear()
        clearInterval handler

    handler = setInterval(callback, events || 16)

  else if component == setTimeout
    for component in options.component
      component.asRenderHolder()
    callback = ->
      for component in options.component
        component.render()
    setTimeout(callback, events)

  return

renderWhenComponentEvent = (component, event, components) ->
  component.asRenderHolder()
  if event[...2]!='on'
    event = 'on'+event
  componentMap = component.eventUpdateConfig[event] || component.eventUpdateConfig[event] = {}
  for component in components
    componentMap[component.dcid] = component
  return

dc.stopRenderWhen = (component, event, components) ->
  if event[...2]!='on'
    event = 'on'+event
  if components
    if componentMap = component.eventUpdateConfig[event]
      for dcid, component of components
        delete componentMap[dcid]
  else
    delete component.eventUpdateConfig[event]
  return

dc.invalidate = ->
  dc.valid = false

dc.invalidateContent = (component) ->
  dc.valid = false
  dc.rootComponentMap[component.dcid] = component
  return

dc.invalidateAttach = ->

dc.propagateChildNextNode = (child, nextNode) ->

dc.invalidateAttachOnRemove = (child) ->
  firstNode = child.firstNode
  if (prevNode = firstNode.previousSibling) && prevComponent = prevNode.component
    prevComponent.setNextNode(this.nextNode)
  return

