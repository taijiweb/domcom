{list, input, span, div, extendAttrs} = require '../core'
{model, show} = require '../directives'

exports.combobox = combobox = (attrs, modelValue, valueList, direction) ->
  showingItems = false
  disp = if direction=='v' or direction=='vertical' then 'block' else 'inline-block'
  comp = null # do NOT remove this line, because comp is referenced in attrs
  opts = for item in valueList then do(item=item) -> span({
    style:{display:disp, border:"1px solid blue", "min-width":"40px"}
    onclick:(-> modelValue(item); comp.update())
  }, item)
  attrs = extendAttrs attrs, {
    onmouseleave:(-> showingItems = false; comp.update())
  }
  comp = div(attrs,
    input({
      directives: model(modelValue),
      onmouseenter:(-> showingItems = true; comp.update())}),
    div({style:{display: -> if showingItems then 'block' else 'none'}}, opts)
  )

exports.vcombo = (attrs, modelValue, valueList) -> combobox(attrs, modelValue, valueList, 'vertical')

exports.hcombo = (attrs, modelValue, valueList) -> combobox(attrs, modelValue, valueList, 'horizontal')
