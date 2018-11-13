{isArray} = require 'dc-util'

import isComponent from './component/isComponent'

if typeof window != 'undefined'
  if !window.requestAnimationFrame
    for vendor in  ['webkit', 'ms', 'moz','o']
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
  dc.removingChildren = {}

dc.reset()

dc.render = (force) ->
  if (force || dc.alwaysRender || !dc.renderBySystemLoop)
    dc.emit('willRender')
    if !dc.valid
      dc.valid = true
      rootComponentMap = dc.rootComponentMap
      dc.rootComponentMap = {}
      for dcid, component of rootComponentMap
        component.render(true)
      dc.clean()
    dc.emit('didRender')

dc.rafRender = rafRender = ->
  dc.renderBySystemLoop = true
  requestAnimFrame(rafRender)
  dc.render(true)
  return

# dc.renderWhen component, events, options
# dc.renderWhen setInterval, interval, {clear: -> clearInterval test}
# dc.renderWhen setTimeout, interval
dc.renderWhen =  (cause, events, options) ->

  components = options.target

  if typeof events == 'string'
    events = events.split(/\s+/)

  if isComponent(cause)
    cause = [cause]

  if cause instanceof Array
    for comp in cause
      for event in events
        renderWhenComponentEvent(comp, event, components)

  else if cause == window.setInterval

    {test, clear} = options
    handler = null

    callback = ->
      if !test || test()
        for component in components
          component.render()
        dc.clean()
      if clear && clear()
        clearInterval handler

    handler = setInterval(callback, events || 16)

  else if cause == setTimeout
    callback = ->
      for component in components
        component.render()
      dc.clean()

    setTimeout(callback, events)

  return

renderWhenComponentEvent = (component, event, components) ->
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

dc.rootComponentMap = {}
dc.blockMap = {}
dc.activeBlockMap = {}

dc.update = ->
  dc.activeBlockMap = {}
  for _, component of dc.rootComponentMap
    block = component.getBlock()
    dc.activeBlockMap[block.dcid] = block
  dc.refresh()

###
  refresh all the root blocks(including those should be disappearing from dom tree)
  used by dc.update
  should not be called directly
###
dc.refresh = ->
  for dcid, block of dc.blockMap
    if !dc.activeBlockMap[dcid]
      block = false
    block.refreshDom()

