toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'

module.exports = class Func extends TransformComponent
  constructor: (func, options) ->
    super(options)
    content = null

    @init = ->

    @getVirtualTree = =>
      @content = content = toComponent(func()) #.inside(@, @)
      content.setParentNode @parentNode
      vtree = content.getVirtualTree()
      vtree.vtreeRootComponent = @
      vtree.srcComponents.unshift([@, null])
      @vtree = vtree

    @setParentNode = (node) ->
      @parentNode = node
      content and content.setParentNode node

    @clone = (options) -> (new Func((-> toComponent(func()).clone()), options or @options)).copyLifeCallback(@)

    @toString = (indent=2, noNewLine) -> newLine("<Func #{funcString(func)}/>",  indent, noNewLine)
    this