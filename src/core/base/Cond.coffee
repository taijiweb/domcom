toComponent = require('./toComponent')
TransformComponent = require('./TransformComponent')
{funcString, newLine} = require('dc-util')
{renew} = require('lazy-flow')

module.exports = class Cond extends TransformComponent
  constructor: (testComponentPairs, else_) ->
    super()

    i = 0; length = testComponentPairs.length
    while i<length
      test = testComponentPairs[i]
      if !test.invalidate
        test = renew test
      test.onInvalidate @invalidateTransform.bind(@)
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
    @family = intersect(families)

    this

  getContentComponent: ->
    for [test, component] in @testComponentPairs
      if test()
        return component
    @else_

  clone: ->
    newCondComponentList = @testComponentPairs.slice()
    i = 0; length = newCondComponentList.length
    while i<length
      newCondComponentList[i+1] = newCondComponentList[i+1].clone()
      i+=2
    new Cond(newCondComponentList, @else_.clone()).copyEventListeners(@)

  toString: (indent=0, addNewLine) ->
    s = newLine('', indent, addNewLine)+'<Cond '+funcString(test)+'>'
    for test, comp in @testComponentPairs
      s += newLine(funcString(test)+': '+comp.toString(indent+2), indent+2)
    s += @else_.toString(indent+2)+newLine('</Cond>', indent, true)

  this
