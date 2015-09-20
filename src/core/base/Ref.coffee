toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
Nothing = require './Nothing'
{funcString, newLine} = require '../../util'

module.exports = class Ref extends TransformComponent
  constructor: (content, container, listIndex) ->
    if content==new Nothing() then return content
    if content.isRef then return content
    super()
    @isRef = true
    @refComponent = content
    @family = content.family

    if !refs = content.refs
      refs =  content.refs = Object.create(null)
      refs[content.container.dcid] = content.container
    refs[container.dcid] = container
    content.holder = @

    @getBaseComponent = ->
      if @valid then return @baseComponent
      @valid = true
      oldBaseComponent = @baseComponent
      content.mountBeforeNode = @mountBeforeNode
      @baseComponent = baseComponent = content.getBaseComponent()
      if baseComponent!=oldBaseComponent then return baseComponent
      baseComponent.container = @container
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

    @clone = (options) -> throw new Error 'not implemented'

    @toString = (indent=0, noNewLine='') ->  baseComponent.toString(indent, noNewLine)

    this