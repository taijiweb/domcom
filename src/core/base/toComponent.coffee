Component = require './component'
isComponent = require './isComponent'
Text = require './Text'

module.exports = toComponent = (x) ->
  if arguments.length!=1 then throw new Error('toComponent: wrong arguments length')
  if !x? then new Text('')
  else if isComponent(x) then x
  else if typeof x == 'function'
    Func = require './Func'
    new Func(x)
  else if x instanceof Array
    if x.length==1 then toComponent(x[0])
    else
      List = require './List' # avoid loop require
      new List(for e in x then toComponent(e))
  else new Text(x)