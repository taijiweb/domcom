# domcom demo
{select, see2, case_, list} = dc

{eachDemo1, eachDemo2, eachDemo3, eachDemo4} = require 'domcom/demo/demo-each'
{demoArrow, demoCombo} = require 'domcom/demo/demo-builtins'
splitterDemo = require 'domcom/demo/demo-splitter'
accordion = require 'domcom/demo/demo-accordion'

exports.demoMap = demoMap =
  accordion: accordion
  arrow:demoArrow
  combo:demoCombo
  "show hide": require 'domcom/demo/demo-show-hide'
  counter: require 'domcom/demo/demo-counter'
  dialog: require 'domcom/demo/demo-dialog'
  event: require 'domcom/demo/demo-event'
  controls: require 'domcom/demo/demo-controls'
  if: require 'domcom/demo/demo-if-component'
  each1: eachDemo1
  each2: eachDemo2
  each3: eachDemo3
  each4: eachDemo4
  'switch 1 2 3 4': require 'domcom/demo/demo-switch-1-2-3-4'
  splitter: splitterDemo
  sum: require 'domcom/demo/demo-sum'
  'text model': require 'domcom/demo/demo-text-model'
  'auto width edit': require 'domcom/demo/demo-auto-width-edit'
  'mount/unmount': require 'domcom/demo/demo-mount-unmount'

exports.makeDemoComponent = makeDemoComponent = (demoMap, initItem='arrow') ->
  currentItem = see2 initItem
  list demoSelect = select($options: [Object.keys(demoMap)], $model:currentItem),
    case_(currentItem, demoMap, accordion).updateWhen(demoSelect, 'change')

exports.runDomComDemo = window.runDomComDemo = ->
  comp = accordion()
#  comp = demoCombo()
#  comp = demoArrow()
#  comp = demoMap["show hide"]()
#  comp = demoMap["counter"]()
#  comp = demoMap["dialog"]()
#  comp = demoMap["event"]()
#  comp = demoMap["controls"]()
#  comp = demoMap["if"]()
#  comp = demoMap["each1"]()
#  comp = demoMap["each2"]()
#  comp = demoMap["each3"]()
#  comp = demoMap["each4"]()
  comp = demoMap["switch 1 2 3 4"]()
#  comp = demoMap["splitter"]()
#  comp = demoMap["sum"]()
#  comp = demoMap["text model"]()
#  comp = demoMap["auto width edit"]()
#  comp = demoMap["mount/unmount"]()
#  comp = makeDemoComponent(demoMap, demoArrow)
  comp.mount()

