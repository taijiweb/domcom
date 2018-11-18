import toComponent from '../toComponent'
import TranBlock from './TranBlock'
{foreach, funcString, newLine, intersect} = require 'dc-util'
{renew} = require 'lazy-flow'

export default module.exports = class Case extends TranBlock
  constructor: (test, @map, else_, forceCase=false) ->
    super(test)

    foreach map, (value, index) ->
      map[index] = toComponent(value)
    this.else_ = toComponent(else_)
    return

  getContent: ->
    return this.map[this.test] || this.else_

  clone: ->
    cloneMap = foreach this.map, (value) -> value.clone()
    (new Case(this.test, cloneMap, this.else_.clone())).copyEventListeners(this)

  toString: (indent=0, addNewLine) ->
    s = newLine('', indent, addNewLine)+'<Case '+funcString(this.test)+'>'
    foreach this.map, (value, index) ->
      s += newLine(index+': '+value.toString(indent+2, false), indent+2, true)
    s += this.else_.toString(indent+2, true)+newLine('</Case>', indent, true)

