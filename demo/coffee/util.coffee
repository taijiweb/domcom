# domcom demo
{select, see, if_, case_, list, func, each, div, p} = dc

dc.directive $options: dc.$options,  $model: dc.$model

import {eachDemo1, eachDemo2, eachDemo3, eachDemo4} from'./demo-each'
chooseFramework from'./demo-choose-web-framework'

import {demoEachPush, demoIfEach, demoModelOnMultipleInput} from './demo-debug'

#export default
exports = {}

exports.demoMap =
  'choose web framework':chooseFramework
  "show hide":  require('./demo-show-hide').default
  counter:  require('./demo-counter').default
  event:  require('./demo-event').default
  controls:  require('./demo-controls').default
  if:  require('./demo-if-component').default
  each1:  eachDemo1
  each2:  eachDemo2
  each3:  eachDemo3
  each4:  eachDemo4
  'switch 1 2 3 4':  require('./demo-switch-1-2-3-4').default
  sum:  require('./demo-sum').default
  'text model':  require('./demo-text-model').default
  'mount/unmount':  require('./demo-mount-unmount').default

exports.makeDemoComponent = makeDemoComponent = (demoMap, initItem) ->
  currentItem = see initItem
  componentsMap = {}
  for key, comp of demoMap
    if typeof comp == 'function'
      componentsMap[key] = comp()
    else
      componentsMap[key] = comp
  comp = list(demoSelect = select($options: [Object.keys(demoMap)], $model:currentItem),
    div case_(currentItem, componentsMap, else_=componentsMap[initItem])
  )
  comp.renderWhen(demoSelect, 'change')

exports.runDemo = (demoMap, initItem, element) ->
  comp = makeDemoComponent(demoMap, initItem)
  comp.mount(element)

export default exports