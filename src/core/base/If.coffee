toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'

module.exports = class If extends TransformComponent
  constructor: (test, then_, else_, options) ->
    super(options)
    @then_ = then_ = toComponent(then_) #.inside(@, @)
    @else_ = else_ = toComponent(else_) #.inside(@, @)
    if typeof test == 'function'
      @getVirtualTree = =>
        content = if test() then then_ else else_
        vtree = content.getVirtualTree()
        vtree.vtreeRootComponent = @
        vtree.srcComponents.unshift([@, null])
        @vtree = vtree
      @setParentNode = (node) ->
        @parentNode = node
        then_.setParentNode node
        else_.setParentNode node
    else
      content = if test then then_ else else_
      @getVirtualTree = ->
        vtree = content.getVirtualTree()
        vtree.srcComponents.unshift([@, null])
        @vtree = vtree
      @setParentNode = (node) ->
        @parentNode = node
        content.setParentNode node
    @clone = (options) -> (new If(test, then_.clone(), else_clone(), options or @options)).copyLifeCallback(@)



    @toString = (indent=0, noNewLine='') ->
      newLine(indent, noNewLine)+'<if '+funcString(test)+'>' + then_.toString(indent+2) + else_.toString(indent+2)+newLine('</if>', indent)

    this

