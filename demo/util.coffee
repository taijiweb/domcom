# domcom demo

eachDemo = require './demo-each'
import chooseFramework from './demo-choose-web-framework'

{demoEachPush, demoIfEach, demoModelOnMultipleInput} = require './demo-debug'

export default module.exports = exports = {}

exports.demoMap =
  'choose web framework':chooseFramework,
  "show hide":  require('./demo-show-hide'),
  counter:  require('./demo-counter')
  controls:  require('./demo-controls'),
  'function lead item':  require('./demo-function-lead-item'),
  sum:  require('./demo-sum'),
  'text model':  require('./demo-text-model')

exports.makeDemoComponent = makeDemoComponent = (demoMap, initItem) ->
  componentsMap = {}
  for key, comp of demoMap
    if typeof comp == 'function'
      componentsMap[key] = comp()
    else
      componentsMap[key] = comp
  console.log(' componentsMap: ', componentsMap)
  view = ->
    ['div',
        ['select', {$options:Object.keys(demoMap), $model:'select'}],
        ['div', componentsMap[comp.select]]]

  comp = dc({view, select:initItem})

exports.runDemo = (demoMap, initItem, element) ->
  comp = makeDemoComponent(demoMap, initItem)
  comp.mount(element)