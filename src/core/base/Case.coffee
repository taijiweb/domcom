toComponent = require('./toComponent')
TestComponent = require('./TestComponent')
{foreach, funcString, newLine, intersect} = require('dc-util')
{renew} = require('lazy-flow')

module.exports = class Case extends TestComponent
  constructor: (test, @map, else_, forceCase=false) ->

    if !forceCase && typeof test != 'function'
      if map.hasOwnPoperty(test)
        return toComponent(map[key])
      else
        return toComponent(else_)

    foreach map, (value, index) ->
      map[index] = toComponent(value)
    this.else_ = toComponent(else_)

    families = []
    foreach map, (value) -> families.push(value.family)
    families.push this.else_.family
    this.family = family = intersect(families)
    family[this.dcid] = true

    super(test)

  getContentComponent: ->
    this.map[this.getTestValue()] || this.else_

  clone: ->
    cloneMap = foreach this.map, (value) -> value.clone()
    (new Case(this.test, cloneMap, this.else_.clone())).copyEventListeners(this)

  toString: (indent=0, addNewLine) ->
    s = newLine('', indent, addNewLine)+'<Case '+funcString(this.test)+'>'
    foreach this.map, (value, index) ->
      s += newLine(index+': '+value.toString(indent+2, false), indent+2, true)
    s += this.else_.toString(indent+2, true)+newLine('</Case>', indent, true)

