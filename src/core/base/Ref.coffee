toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
Nothing = require './Nothing'
{funcString, newLine} = require '../../util'

module.exports = class Ref extends TransformComponent
  constructor: (content, container, listIndex) ->
    if content==new Nothing() then return content
    if content.isRef then return content
    super()
    @refComponent = content
    @family = content.family

    refs = content.refs or content.refs = Object.create(null)
    refs[container.dcid] = container
    content.holder = @

    @getBaseComponent = ->
      if !@invalid then return @baseComponent
      @invalid = false
      oldBaseComponent = @baseComponent
      content.mountBeforeNode = @mountBeforeNode
      @baseComponent = baseComponent = content.getBaseComponent()
      if baseComponent!=oldBaseComponent then return baseComponent
      if baseComponent.container
        if (baseComponent.container != @container or baseComponent.listPath!=@listPath) and !baseComponent.referable
          throw new Error 'do not mount unreferable component in mutlitple places'
      else
        baseComponent.container = @container
        baseCompnent.listPath = @listPath
      if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
      if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
      baseComponent = content.getBaseComponent()
      if !oldBaseComponent then return baseComponent
      if oldBaseComponent!=baseComponent then return baseComponent
      if !baseComponent.node
        baseComponent.ref = @
        baseComponent
      else if baseComponent.ref==@
        baseComponent
      else
        baseComponent.ref = @
        container = baseComponent.container
        if !refs=baseComonent.refs
          baseComonent.refs = refs = Object.create(null)
          container.activeOffspring = container.activeOffspring or Object.create(null)
        for ref in refs
          ref.invalidate()

    @clone = (options) ->
      throw new Error 'not implemented'
      #baseComponent.clone(options)

    @toString = (indent=0, noNewLine='') ->  baseComponent.toString(indent, noNewLine)

    this