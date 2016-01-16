{Tag} = dc

reNonUnit = /[\d\s\.-]/g

exports.unitAdd = unitAdd = (x, y) ->
  num = parseFloat(x)
  if isNaN(num)
    console.log('wrong type in unitAdd(prop, value)')
  num + parseFloat(y) + x.replace(reNonUnit, '')

exports.unitSub= unitSub = (x, y) ->
  num = parseFloat(x)
  if isNaN(num)
    console.log('wrong type in unitSub(prop, value)')
  num - parseFloat(y) + x.replace(reNonUnit, '')

exports.unitMul = unitMul = (x, y) ->
  num = parseFloat(x)
  if isNaN(num)
    console.log('wrong type in unitMul(prop, value)')
  num * parseFloat(y) + x.replace(reNonUnit, '')

exports.unitDiv = unitDiv = (x, y) ->
  num = parseFloat(x)
  if isNaN(num)
    console.log('wrong type in unitDiv(prop, value)')
  num / parseFloat(y) + x.replace(reNonUnit, '')

Tag::cssAdd = (prop, value) ->
  @css(prop, unitAdd(@css(prop), value))

Tag::cssSub = (prop, value) ->
  @css(prop, unitSub(@css(prop), value))

Tag::cssMul = (prop, value) ->
  @css(prop, unitMul(@css(prop), value))

Tag::cssDiv = (prop, value) ->
  @css(prop, unitDiv(@css(prop), value))

