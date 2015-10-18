toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine, intersect} = require '../../util'
{renew} = require '../../flow'

module.exports = class Case extends TransformComponent
  constructor: (test, map, else_) ->
    if typeof test != 'function'
      if map.hasOwnPoperty(test) then return toComponent(map[key])
      else return toComponent(else_)

    super()

    families = for _, value of map then value.family
    families.push else_.family
    @family = family = intersect(families)
    family[@dcid] = true

    if !test.invalidate then test = renew(test)
    test.onInvalidate(@invalidateTransform.bind(@))

    for key, value of map
      map[key] = toComponent(value) #comp =
    else_ = toComponent(else_)

    @getContentComponent = -> map[test()] or else_

    @clone = ->
      cloneMap = Object.create(null)
      for key, value of map
        cloneMap[key] = value.clone()
      (new Case(test, cloneMap, else_clone())).copyEventListeners(@)

    @toString = (indent=0, addNewLine) ->
      s = newLine('', indent, addNewLine)+'<Case '+funcString(test)+'>'
      for key, comp of map
        s += newLine(key+': '+comp.toString(indent+2, false), indent+2, true)
      s += else_.toString(indent+2, true)+newLine('</Case>', indent, true)

    this
