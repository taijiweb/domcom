# domcom demo

eachDemo = require './demo-each'
import chooseFramework from './demo-choose-web-framework'

{demoEachPush, demoIfEach, demoModelOnMultipleInput} = require './demo-debug'

#export default
exports = {}

exports.demoMap =
  'choose web framework':chooseFramework,
  "show hide":  require('./demo-show-hide'),
  counter:  require('./demo-counter')
  event:  require('./demo-event'),
  controls:  require('./demo-controls'),
  'function lead item':  require('./demo-function-lead-item'),
  eachDemo,
  sum:  require('./demo-sum'),
  'text model':  require('./demo-text-model')

exports.makeDemoComponent = makeDemoComponent = (demoMap, initItem) ->
  currentItem = see initItem
  componentsMap = {}
  for key, comp of demoMap
    if typeof comp == 'function'
      componentsMap[key] = comp()
    else
      componentsMap[key] = comp
  view = (data) ->
    ['div',
       demoSelect = ['select', {'#':[[dc.options, Object.keys(demoMap)], [dc.model, currentItem]]}],
       ['div', [case_, currentItem, componentsMap, componentsMap[initItem]]]]

  comp = dc({view})

exports.runDemo = (demoMap, initItem, element) ->
  comp = makeDemoComponent(demoMap, initItem)
  comp.mount(element)

export default exports