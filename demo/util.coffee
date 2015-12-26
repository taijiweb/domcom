# domcom demo
{select, see, if_, case_, list, func, each, div, p} = dc

dc.directives $options: dc.$options,  $model: dc.$model

{eachDemo1, eachDemo2, eachDemo3, eachDemo4} = require('./demo-each')
{demoTriangle, demoCombo, demoModelOnMultipleInput} = require './demo-builtins'
splitterDemo = require './demo-splitter'
accordion = require './demo-accordion'
chooseFramework = require('./demo-choose-web-framework')

{demoEachPush, demoIfEach, demoModelOnMultipleInput} = require('./demo-debug')

exports.demoMap =
  'choose web framework':chooseFramework()
  accordion: accordion()
  triangle: demoTriangle()
  combo: demoCombo()
  "show hide":  require('./demo-show-hide')()
  counter:  require('./demo-counter')()
  dialog:  require('./demo-dialog')()
  event:  require('./demo-event')()
  controls:  require('./demo-controls')()
  if:  require('./demo-if-component')()
  each1:  eachDemo1()
  each2:  eachDemo2()
  each3:  eachDemo3()
  each4:  eachDemo4()
  'switch 1 2 3 4':  require('./demo-switch-1-2-3-4')()
  splitter:  splitterDemo()
  sum:  require('./demo-sum')()
  'text model':  require('./demo-text-model')()
  'auto width edit':  require('./demo-auto-width-edit')()
  'mount/unmount':  require('./demo-mount-unmount')()

exports.makeDemoComponent = makeDemoComponent = (demoMap, initItem) ->
  currentItem = see initItem
  list demoSelect = select($options: [Object.keys(demoMap)], $model:currentItem),
    div case_(currentItem, demoMap, else_=demoMap[initItem]).updateWhen(demoSelect, 'change')

exports.runDemo = (demoMap, initItem, element) ->
  comp = makeDemoComponent(demoMap, initItem)
  comp.mount(element)