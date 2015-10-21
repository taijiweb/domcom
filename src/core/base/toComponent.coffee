Component = require './component'
isComponent = require './isComponent'
Nothing = require './Nothing'
Text = require './Text'
{react} = require '../../flow/index'

module.exports = toComponent = (x) ->
  if isComponent(x) then x

  else if typeof x == 'function' then new Text(x)

  else if x instanceof Array
    List = require './List' # avoid loop require
    new List(for e in x then toComponent(e))

  else if !x? then new Nothing()

  else if x.then and x.catch
    Func = require './Func' # avoid loop require
    component = new Func react -> component.promiseResult

    x.then (value) ->
      component.promiseResult = value
      component.invalideTransform()

    x.catch (error) ->
      component.promiseResult = error
      component.invalideTransform()

    component

  else new Text(x)