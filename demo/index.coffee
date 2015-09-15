# domcom demo
{select, options} = dc

{eachDemo1, eachDemo2, eachDemo3} = require 'domcom/demo/demo-each'
{demoArrow, demoCombo} = require 'domcom/demo/demo-builtins'
splitterDemo = require 'domcom/demo/demo-splitter'

exports.demoMap = demoMap =
  accordion: require 'domcom/demo/demo-accordion'
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
  'switch 1 2 3 4': require 'domcom/demo/demo-switch-1-2-3-4'
  splitter: splitterDemo
  sum: require 'domcom/demo/demo-sum'
  'text model': require 'domcom/demo/demo-text-model'
  'auto width edit': require 'domcom/demo/demo-auto-width-edit'


exports.runDemo = runDemo = (demoMap, initItem='accordion') ->
  current = initItem
  currentComp = demoMap[current]()
  demoSelect = select({
    $options: [Object.keys(demoMap)]
    value: current
    onchange: ->
      if @value!=current
        currentComp.unmount()
        current = @value
        currentComp = demoMap[current]()
        currentComp.mount()
  })
  demoSelect.mount()
  currentComp.mount()

exports.runDomComDemo = window.runDomComDemo = ->
#  runDemo demoMap, 'accordion'
  comp = splitterDemo()
  comp.mount()

