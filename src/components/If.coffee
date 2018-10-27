toComponent = require('./toComponent')
TestComponent = require('./TestComponent')
{funcString, newLine, intersect} = require('dc-util')
{renew} = require('lazy-flow')
mergeIf = require('../mergeIf')

ObjectDefineProperty = Object.defineProperty

module.exports = class If extends TestComponent
  constructor: (test, then_, else_, merge, recursive, forceIf=false) ->
    if then_ == else_
      return toComponent then_

    then_ = toComponent(then_)
    else_ = toComponent(else_)

    if !forceIf
      if typeof test != 'function'
        if test
          return then_
        else
          return else_
      else if merge
        return mergeIf(test, then_, else_, recursive)

    super(test)

    this.then_ = then_
    this.else_ = else_

    this.family = family = intersect([then_.family, else_.family])
    family[this.dcid] = true

    return this

  getContentComponent: ->
    if this.getTestValue()
      this.then_
    else
      this.else_

  clone: -> (new If(this.test, this.then_.clone(), this.else_.clone())).copyEventListeners(this)

  toString: (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<if '+funcString(this.test)+'>' + \
        this.then_.toString(indent+2, true) + \
        this.else_.toString(indent+2, true) + \
        newLine('</if>', indent, true)