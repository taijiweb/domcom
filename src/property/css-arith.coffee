import Tag from '../component/Tag'

#export default
exports = {}

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

Tag.prototype.cssAdd = (prop, value) ->
  v = unitAdd(this.css(prop), value)
  this.css(prop, v)

Tag.prototype.cssSub = (prop, value) ->
  this.css(prop, unitSub(this.css(prop), value))

Tag.prototype.cssMul = (prop, value) ->
  this.css(prop, unitMul(this.css(prop), value))

Tag.prototype.cssDiv = (prop, value) ->
  this.css(prop, unitDiv(this.css(prop), value))

export default exports