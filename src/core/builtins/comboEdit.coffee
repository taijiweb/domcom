{list} = require '../instantiate'
{input, select} = require '../tag'
{model, options} = require '../directives'
{extendAttrs} = require '../property'

module.exports = (attrs, modelValue, valueList) ->
  # this is not finished and not tested
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
