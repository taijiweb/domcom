toComponent = require('./toComponent')
TestComponent = require('./TestComponent')
{foreach, funcString, newLine, intersect} = require('dc-util')
{renew} = require('lazy-flow')

module.exports = class Case extends TestComponent
  constructor: (test, @map, else_, forceCase=false) ->

    if !forceCase and typeof test != 'function'
      if map.hasOwnPoperty(test)
        return toComponent(map[key])
      else
        return toComponent(else_)

    foreach map, (value, index) ->
      map[index] = toComponent(value)
    @else_ = toComponent(else_)

    families = []
    foreach map, (value) -> families.push(value.family)
    families.push @else_.family
    @family = family = intersect(families)
    family[@dcid] = true

    super(test)

  getContentComponent: ->
    @map[@getTestValue()] or @else_

  clone: ->
    cloneMap = foreach @map, (value) -> value.clone()
    (new Case(@test, cloneMap, @else.clone())).copyEventListeners(@)

  toString: (indent=0, addNewLine) ->
    s = newLine('', indent, addNewLine)+'<Case '+funcString(@test)+'>'
    foreach @map, (value, index) ->
      s += newLine(index+': '+value.toString(indent+2, false), indent+2, true)
    s += @else_.toString(indent+2, true)+newLine('</Case>', indent, true)

