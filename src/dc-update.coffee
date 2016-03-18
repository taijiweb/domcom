{isArray} = require('dc-util')

isComponent = require('./core/base/isComponent')

if typeof window != 'undefined'
  for vendor in  ['ms', 'moz','webkit','o']
    if window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame']
      window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] or window[vendor + 'CancelRequestAnimationFrame']
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

dc.dcidIndexMap = dcidIndexMap = {}
dc.parentNodes = parentNodes = []
dc.nextNodes = nextNodes = []
dc.listIndex = 0
dc.renderingMap = {}
dc.removingMap = {}

dc.reset = ->
  dc.listeners = {}
  dc.dcidIndexMap = {}
  dc.parentNodes = []
  dc.nextNodes = []
  dc.listIndex = 0
  dc.renderingMap = {}
  dc.removingMap = {}

dc.getChildParentNode = (child) ->
  parentNodes[dcidIndexMap[child.dcid]]

dc.getChildNextNode = (child) ->
  this.nextNodes[dcidIndexMap[child.dcid]]

dc.invalidate = ->
  dc.valid = false

dc.invalidateOffspring = (offspring) ->
  dc.valid = false
  dc.renderingMap[offspring.dcid] = [offspring, offspring.holder]

dc.refreshComponents = refreshComponents = ->
  this.valid = true
  renderingMap = this.oldRenderingMap = this.renderingMap
  this.renderingMap = {}
  for _, [component, holder] of renderingMap
    holder.updateChildHolder(component)
    component.renderDom(component.baseComponent)
  this.valid = false
  this

removeComponents = ->
  removingMap = this.removingMap
  this.removingMap = {}
  for dcid of removingMap
    removingMap[dcid].removeDom()
  this

dc.update = (force) ->
  dc.emit('willUpdate')
  if (force || dc.alwaysUpdate) && !dc.valid
    refreshComponents.call(this)
    removeComponents.call(this)
  dc.emit('didUpdate')

dc.updateChildHolder = (child) ->
  if child.holder != this
    child.invalidate()
    child.holder = this
    child.setParentNode(this.getChildParentNode(child))
    child.sinkNextNode(this.getChildNextNode(child))
  return

dc.raiseNode = ->

dc.raiseFirstNextNode = ->

dc.linkNextNode = ->

dc.rafUpdate = rafUpdate = ->
  if !dc.rafUpdateStop || !dc.rafUpdateStop()
    requestAnimFrame(rafUpdate)
    dc.update(true)
  return

# dc.updateWhen component, events, options
# dc.updateWhen setInterval, interval, {clear: -> clearInterval test}
dc.updateWhen =  (component, events, options) ->
  if component instanceof Array
    for comp in component
      if isArray(events)
        for event in events
          updateWhenComponentEvent(comp, event, options)
      else
        updateWhenComponentEvent(comp, events, options)

  else if isComponent(component)
    if isArray(events)
      for event in events
        updateWhenComponentEvent(component, event, options)
    else
      updateWhenComponentEvent(component, events, options)

  else if component == setInterval
    if typeof events == 'number'
      options = options || {}
      options.interval = events
    else
      options = events || {}

    {test, interval, clear} = options
    handler = null

    callback = ->
      if !test or test()
        dc.update()
      if clear and clear()
        clearInterval handler

    handler = setInterval(callback, interval or 16)

  else if component == dc.rafUpdate
    dc.rafUpdateStop = events
    dc.rafUpdate()

  return

updateWhenComponentEvent = (component, event, alwaysUpdate) ->
  if event[...2]!='on'
    event = 'on'+event
  component.eventUpdateConfig[event] = alwaysUpdate
