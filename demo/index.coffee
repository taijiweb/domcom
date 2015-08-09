# domcom demo
{select, options} = dc

{repeatDemo1, repeatDemo2, repeatDemo3} = require 'domcom/demo/demo-repeat'

exports.demoMap = demoMap =
  accordion: require 'domcom/demo/demo-accordion'
  builtins: require 'domcom/demo/demo-builtins'
  counter: require 'domcom/demo/demo-counter'
  dialog: require 'domcom/demo/demo-dialog'
  event: require 'domcom/demo/demo-event'
  controls: require 'domcom/demo/demo-controls'
  if: require 'domcom/demo/demo-if-component'
  repeat1: repeatDemo1
  repeat2: repeatDemo2
  repeat3: repeatDemo3
  splitter: require 'domcom/demo/demo-splitter'
  sum: require 'domcom/demo/demo-sum'
  'text model': require 'domcom/demo/demo-text-model'
  'auto width edit': require 'domcom/demo/demo-auto-width-edit'

current = 'accordion'
currentComp = demoMap[current]()

exports.runDomComDemo = window.runDomComDemo = ->
  demoSelect = select({
    directives: options(Object.keys(demoMap))
    value: 'accordion'
    onchange: ->
      if @value!=current
        currentComp.unmount()
        current = @value
        currentComp = demoMap[current]()
        currentComp.mount()
  })
  demoSelect.mount()
  currentComp.mount()

