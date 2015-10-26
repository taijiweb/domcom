# domcom demo
{select, see, case_, list, func, each, p} = dc

dc.directives $options: dc.$options,  $model: dc.$model

demoEachPush = ->
  lst = [1, 2]
  comp = list each(lst, (item) -> p item), 'some other thing'
  comp.mount()
  lst.push 3
  comp.render()

{eachDemo1, eachDemo2, eachDemo3, eachDemo4} = require 'domcom/demo/demo-each'
{demoTriangle, demoCombo} = require 'domcom/demo/demo-builtins'
splitterDemo = require 'domcom/demo/demo-splitter'
accordion = require 'domcom/demo/demo-accordion'

exports.demoMap = demoMap =
  accordion: func accordion
  arrow: func demoTriangle
  combo: func demoCombo
  "show hide":  func require 'domcom/demo/demo-show-hide'
  counter:  func require 'domcom/demo/demo-counter'
  dialog:  func require 'domcom/demo/demo-dialog'
  event:  func require 'domcom/demo/demo-event'
  controls:  func require 'domcom/demo/demo-controls'
  if:  func require 'domcom/demo/demo-if-component'
  each1:  func eachDemo1
  each2:  func eachDemo2
  each3:  func eachDemo3
  each4:  func eachDemo4
  'switch 1 2 3 4':  func require 'domcom/demo/demo-switch-1-2-3-4'
  'choose web framework':  func require 'domcom/demo/demo-choose-web-framework'
  splitter:  func splitterDemo
  sum:  func require 'domcom/demo/demo-sum'
  'text model':  func require 'domcom/demo/demo-text-model'
  'auto width edit':  func require 'domcom/demo/demo-auto-width-edit'
  'mount/unmount':  func require 'domcom/demo/demo-mount-unmount'

exports.makeDemoComponent = makeDemoComponent = (demoMap, initItem='arrow') ->
  currentItem = see initItem
  list demoSelect = select($options: [Object.keys(demoMap)], $model:currentItem),
    case_(currentItem, demoMap, accordion).updateWhen(demoSelect, 'change')

exports.runDomComDemo = window.runDomComDemo = ->
#  comp = accordion()
#  comp = demoCombo()
#  comp = demoTriangle()
#  comp = demoMap["show hide"]
#  comp = demoMap["counter"]
#  comp = demoMap["dialog"]
#  comp = demoMap["event"]
#  comp = demoMap["controls"]
#  comp = demoMap["if"]
#  comp = demoMap["each1"]
#  comp = demoMap["each2"]
#  comp = demoMap["each3"]
#  comp = demoMap["each4"]
#  comp = demoMap["switch 1 2 3 4"]
#  comp = demoMap["splitter"]
#  comp = demoMap["sum"]
#  comp = demoMap["text model"]
#  comp = demoMap["auto width edit"]
#  comp = demoMap["mount/unmount"]
#  comp = makeDemoComponent(demoMap, demoTriangle)

  comp = makeDemoComponent(demoMap)
  comp.mount()
