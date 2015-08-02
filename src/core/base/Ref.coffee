toComponent = require './toComponent'
Component = require './component'
{newLine} = require '../../util'

module.exports = class Ref extends Component
  constructor: (content, options) ->
    super(options)
    @content = toComponent(content)
    @getVirtualTree = -> throw new Error 'just keep isComponent(me) to be true, should not call me'
    this

  isRef: true