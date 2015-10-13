Component = require './component'
isComponent = require './isComponent'
Text = require './Text'

module.exports = toComponent = (x) ->
  if isComponent(x) then x
  else if typeof x == 'function' then new Text(x)
  else if x instanceof Array
    List = require './List' # avoid loop require
    new List(for e in x then toComponent(e))
  else if !x? then new Text('')
  else new Text(x)