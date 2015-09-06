toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
{checkContainer} = require '../../util'
{newLine} = require '../../util'

module.exports = exports = class List extends BaseComponent
  constructor: (@children, options) ->
    options = options or {}
    if children.length==0 then children.push new Text('')
    for child, i in children
      child = toComponent(child)
      children[i] = child
      child.container = @
      child.listIndex = i
    @isList = true
    super(options)
    return

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  firstDomNode: -> @children[0].firstDomNode()

  setParentNode: (node) ->
    @parentNode = node
    for child in @children then child.setParentNode node
    return

  createDom: ->
    @node = node = []
    @resetHolderHookUpdater()
    for child, i in @children
      child.render(true)
      node[i] = child.node
      if compList=child.baseComponent.unmountCallbackComponentList
        @unmountCallbackComponentList = compList.concat(@unmountCallbackComponentList)
    return

  updateDom: (mounting) ->
    @resetHolderHookUpdater()
    @updateOffspring(mounting)

  toString: (indent=0, noNewLine) ->
    s = newLine("<List>", indent, noNewLine)
    for child in @children
      s += child.toString(indent+2)
    s += newLine('</List>', indent)