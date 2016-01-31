{pairListDict} = require('dc-util')
{classFn} = require('../core/property')
{div, span, option} = require('../core/tag')
Component = require('../core/base/Component')

module.exports = (direction) -> (comp) ->

  dc.directives $show: dc.$show

  props = comp.props
  direction = direction or 'vertical'

  if direction == 'vertical'
    left = "top"; right = "bottom"; width = "height"; clientX = "clientY"; splitbarClass =  "splitbarH"; buttonClass = "splitbuttonH"; cursor = "s-resize"
  else
    left = "left"; right = "right"; width = "width"; clientX = "clientX"; splitbarClass =  "splitbarV"; buttonClass = "splitbuttonV"; cursor = "e-resize"

  pos = 200; percent = 0.5; size = null; drag = false;

  getSize = -> size or 600

  children = comp.children
  paneA = children[0]; paneB = children[1]
  minAWidth = props.minAWidth or 0; minBWidth = props.minBWidth or 0
  splitBarAttr = {
    "class": splitbarClass,  unselectable: "on",
    style: splitBarAttrCss = {
      "cursor": cursor, "user-select": "none", "-webkit-user-select": "none",
      "-khtml-user-select": "none", "-moz-user-select": "none" } }
  splitBarAttrCss[left] =  -> pos+'px'
  splitBarAttrCss[width] = barsize = 6

  arrowAHovering = false
  arrawAAttr =  {
    "class": classFn(buttonClass, {'inactive': -> arrowAHovering}),
    unselectable: "on",
    style: {cursor: 'pointer'}
    onmouseover: -> arrowAHovering = true; comp.update()
    onmouseleave: -> arrowAHovering = false; comp.update()
    onclick: (e) -> pos = minAWidth; comp.update()
    $show: -> pos > minAWidth
  }
  arrowBHovering = false
  arrawBAttr =  {
    "class": classFn(buttonClass+' invert', {'inactive': -> arrowBHovering}),
    unselectable: "on"
    style:{cursor: 'pointer'}
    onmouseover: -> arrowBHovering = true; comp.update()
    onmouseleave: -> arrowBHovering = false; comp.update()
    onclick: (e) -> pos = getSize()-minBWidth; comp.update()
    $show: -> getSize()-pos>minBWidth
  }
  arrowA = div(arrawAAttr)
  arrowB = div(arrawBAttr)

  splitBar = div(splitBarAttr, span(), arrowA, arrowB)
  comp.setChildren 1, splitBar, paneB

  splitBar.bind 'mousedown', (event) -> drag = true
  dc(document).bind 'mouseup', -> drag = false
  comp.bind 'mousemove', (event) ->
    event.continuePropagation = true
    event.executeDefault = true
    if (!drag) then return
    event.continuePropagation = false
    event.executeDefault = false
    bounds = comp.node.getBoundingClientRect()
    size = w = bounds[right] - bounds[left]
    pos = Math.max(event[clientX] - bounds[left], 0)
    pencent = pos/w
    comp.update()

  paneA.css pairListDict('position', 'absolute', width, (-> pos+'px'))
  paneB.css pairListDict('position', 'absolute', left, (-> (pos+barsize)+'px'), width, (-> getSize()-(pos+barsize)+'px') )
  comp.css pairListDict 'position', 'absolute'

  comp.bind 'resize', (event) ->
    event.preventDefault()
    event.stopPropagation()
    bounds = comp.node.getBoundingClientRect()
    w = bounds[right] - bounds[left]
    pos = percent*w
    if pos < minAWidth
      pos = minAWidth
    else if w-pos < minBWidth
      pos = w-minBWidth
    comp.update()

  comp