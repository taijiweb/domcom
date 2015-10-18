toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'
{renew} = require '../../flow'

module.exports = class Cond extends TransformComponent
  constructor: (condComponentList, else_) ->
    super()

    i = 0; length = condComponentList.length
    while i<length
      test = condComponentList[i]
      if !test.invalidate then test = renew test
      test.onInvalidate @invalidateTransform.bind(@)
      condComponentList[i] = test
      condComponentList[i+1] = toComponent(condComponentList[i+1])  #comp =
      i += 2
    else_ = toComponent else_


    i = 1
    families = []
    while i<length
      families.push  condComponentList[i].family
      i += 2
    families.push else_.family
    @family = family = intersect(families)

    @getContentComponent = ->
      for [test, component] in condComponentList
        if test() then return component
      else_

    @clone = ->
      newCondComponentList = condComponentList.slice()
      i = 0; length = newCondComponentList.length
      while i<length
        newCondComponentList[i+1] = newCondComponentList[i+1].clone()
        i+=2
      newElse = else_.clone()
      new Cond(newCondComponentList, else_).copyEventListeners(@)

    @toString = (indent=0, addNewLine) ->
      s = newLine('', indent, addNewLine)+'<Cond '+funcString(test)+'>'
      for test, comp in condComponentList
        s += newLine(funcString(test)+': '+comp.toString(indent+2), indent+2)
      s += else_.toString(indent+2)+newLine('</Cond>', indent, true)

    this
