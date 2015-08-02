Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @options = options or {}
    return

  setParentNode: (node) ->
    @parentNode = node
    @content and @content.setParentNode(node)

  firstNode: -> @content.firstNode()
