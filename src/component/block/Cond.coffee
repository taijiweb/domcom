import toComponent from '../toComponent'
import TranBlock from './TranBlock'
{funcString, newLine} = require 'dc-util'
{renew} = require 'lazy-flow'

export default module.exports = class Cond extends TranBlock
  constructor: (testComponentPairs, else_) ->
    super()

    i = 0; length = testComponentPairs.length
    while i<length
      test = testComponentPairs[i]
      if !test.invalidate
        test = renew test
      test.onInvalidate this.invalidateTransform.bind(this)
      testComponentPairs[i] = test
      testComponentPairs[i+1] = toComponent(testComponentPairs[i+1])
      i += 2
    else_ = toComponent else_


    i = 1
    families = []
    while i<length
      families.push  testComponentPairs[i].family
      i += 2
    families.push else_.family
    this.family = intersect(families)

    this

  getContentComponent: ->
    for [test, Component] in this.testComponentPairs
      if test()
        return Component
    this.else_

  clone: ->
    newCondComponentList = this.testComponentPairs.slice()
    i = 0; length = newCondComponentList.length
    while i<length
      newCondComponentList[i+1] = newCondComponentList[i+1].clone()
      i+=2
    new Cond(newCondComponentList, this.else_.clone()).copyEventListeners(this)

  toString: (indent=0, addNewLine) ->
    s = newLine('', indent, addNewLine)+'<Cond '+funcString(test)+'>'
    for test, comp in this.testComponentPairs
      s += newLine(funcString(test)+': '+comp.toString(indent+2), indent+2)
    s += this.else_.toString(indent+2)+newLine('</Cond>', indent, true)

  this
