toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'

module.exports = class Referable extends TransformComponent
  constructor: (component) ->
    super(options)
    @refs = Object.create(null)
    @ref = null

    @getContentComponent = ->
      if !baseComponent.node
        baseComponent.ref = @
        baseComponent
      else if baseComponent.ref==@ then baseComponent
      else
        baseComponent.ref = @
        for ref in baseComponent.refs
          ref.invalidate()

    @clone = (options) ->
      throw new Error 'not implemented'
    #baseComponent.clone(options)

    @toString = (indent=0, noNewLine='') ->  baseComponent.toString(indent, noNewLine)

    this