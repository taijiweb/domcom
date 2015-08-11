BaseComponent = require './BaseComponent'
DomNode = require './DomNode'
{newLine} = require '../../util'

# unfinished
module.exports = exports = class DomNodeList extends BaseComponent
  constructor: (@children, options) ->
    if children.length==0 then children.push new Text('')
    for child, i in children
      if child instanceof window.Node then child = new DomNode(child)
      children[i] = child
      child.container = @
      child.index = i
    super(options)
    return

  init: ->
    for child in @child then child.init()
    return

  setParentNode: (node) ->
    @parentNode = node
    for child in @children then child.setParentNode(node)
    return

  getVirtualTree: ->
    if @vtree then @vtree
    else @vtree = @_vtree = new VirtualDomNodeList(@, [])

  firstNode: -> @children[0].firstNode()
