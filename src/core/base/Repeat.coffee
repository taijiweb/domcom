{isArray} = require '../../util'
toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
List = require './List'
{funcString, newLine} = require '../../util'

module.exports = class Repeat extends TransformComponent
  constructor: (list, itemFn, options) ->
    super(options)

    if typeof list != 'function' and !isArray(list)
      throw new Error 'children for List should be array like or a function'
    if typeof list != 'function'
      items = list
      if !isArray(items) then throw new Error 'Repeat Component need a list'

    @getVirtualTree = =>
      if typeof list == 'function'
        items = list()
        if !isArray(items) then throw new Error 'Repeat Component need a list'
      children = []
      for item, i in items
        child = toComponent(itemFn(item, i, items, @))
        children.push child
      @content = content = new List(children)  #, {dynamicList:true}
      @parentNode and content.setParentNode @parentNode
      vtree = content.getVirtualTree()
      vtree.vtreeRootComponent = @
      vtree.srcComponents.unshift([@, null])
      @vtree = vtree

    @clone = (options) ->
      (new Repeat(list, ((item, index, list, comp) -> itemFn(item, index, list, comp).clone()), options or @options)).copyLifeCallback(@)

    @toString = (indent=0, noNewLine) -> newLine("<Repeat #{funcString(list)} #{funcString(itemFn)}/>", indent, noNewLine)

    this