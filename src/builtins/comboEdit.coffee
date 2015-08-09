{list, input, select, extendAttrs} = require '../core'
{model, options} = require '../directives'

# this is not finished and not tested
module.exports = (attrs, modelValue, valueList) ->
  if modelValue
    attrs = extendAttrs(attrs, {directives:[model(modelValue), options(valueList)]})
  else attrs = extendAttrs({directives:(options(valueList))})
  sel = select(attrs)
  inputAttrs = {
    style:{
      position:'absolute'
      top: -> sel.top()      # component has no metheod top(), left(), height(), width()
      left: -> sel.left()
      height: -> (sel.height()-10)+'px'
      width: -> (sel.width()-10)+'px'
    }
    value: -> modelValue.value
    onchange: -> modelValue.set(@.value)
  }
  list(sel, input(inputAttrs))
