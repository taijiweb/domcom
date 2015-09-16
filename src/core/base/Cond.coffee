toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'
{renew} = require '../../flow'

module.exports = class Cond extends TransformComponent
  constructor: (condComponentList, else_, options={}) ->
    super(options)

    i = 0; length = condComponentList.length
    while i<length
      test = condComponentList[i]
      if !test.invalidate then test = renew test
      test.onInvalidate @invalidate.bind(@)
      condComponentList[i] = test
      condComponentList[i+1] = toComponent(condComponentList[i+1])
      i += 2
    else_ = toComponent else_

    @getContentComponent = ->
      for [test, component] in condComponentList
        if test() then return component
      else_

    @clone = (options) ->
      newCondComponentList = condComponentList.slice()
      i = 0; length = newCondComponentList.length
      while i<length
        newCondComponentList[i+1] = newCondComponentList[i+1].clone()
        i+=2
      newElse = else_.clone()
      new Cond(newCondComponentList, else_, options or @options).copyLifeCallback(@)

    @toString = (indent=0, noNewLine) ->
      s = newLine(indent, noNewLine)+'<Cond '+funcString(test)+'>'
      for test, comp in condComponentList
        s += newLine(funcString(test)+': '+comp.toString(indent+2, true), indent+2)
      s += else_.toString(indent+2)+newLine('</Cond>', indent)

    this
