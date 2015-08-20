toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'

module.exports = class Case extends TransformComponent
  constructor: (test, map, else_, options={}) ->
    super(options)

    if typeof test != 'function'
      if map.hasOwnPoperty(test) then return toComponent(map[key])
      else return toComponent(else_)

    if options.convertToIf
      for key, value of map
        else_ = new  If((->test()==key), value, else_)
      return else_

    for key, value of map
      map[key] = toComponent(value)
    else_ = toComponent(else_)

    @getVirtualTree = =>
      content = (map[test()] or else_)
      vtree = content.getVirtualTree()
      vtree.vtreeRootComponent = @
      vtree.srcComponents.unshift([@, null])
      @vtree = vtree

    @setParentNode = (node) ->
      @parentNode = node
      for _, value of map then map[key].setParentNode.node
      else_.setParentNode node

    @clone = (options) ->
      cloneMap = Object.create(null)
      for key, value of map
        cloneMap[key] = value.clone()
      (new Case(test, cloneMap, else_clone(), options or @options)).copyLifeCallback(@)

    @toString = (indent=0, noNewLine) ->
      s = newLine(indent, noNewLine)+'<Case '+funcString(test)+'>'
      for key, comp of map
        s += newLine(key+': '+comp.toString(indent+2, true), indent+2)
      s += else_.toString(indent+2)+newLine('</Case>', indent)

    this
