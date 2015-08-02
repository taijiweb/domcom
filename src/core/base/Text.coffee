BaseComponent = require './BaseComponent'
{insertNode} = require '../../dom-util'
{VirtualNode, VirtualText} = require '../virtual-node'
{funcString, newLine} = require '../../util'

module.exports = class Text extends BaseComponent
  constructor: (text, options) ->
    if !text? then text = ''
    @text = text
    super(options)

  VirtualNodeClass: VirtualText

  firstNode: -> @node

  getVirtualTree: ->
    if vtree = @vtree
      vtree.srcComponents = []
      vtree
    else @vtree = @_vtree = new @VirtualNodeClass(@)

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, noNewLine) -> newLine(funcString(@text), indent, noNewLine)

module.exports.VirtualText = VirtualText