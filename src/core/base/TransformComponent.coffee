Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @valid = false
    @isTransformComponent = true

  setRefContainer: (container) ->
    @container = container
    @holder = container
    @

  invalidate: ->
    if !@valid then return
    @valid = false
    activeChild = @
    holder = @holder
    while holder and !holder.isContainer
      if holder.isTransformComponent
        holder.valid = false
        activeChild = holder
      holder = holder.holder
    if holder and holder.isContainer
      holder.activeOffspring = holder.activeOffspring or Object.create(null)
      holder.activeOffspring[activeChild.dcid] = activeChild
      holder.invalidate()

  render: (mounting) ->
    oldBaseComponent = @baseComponent
    mountMode = @mountMode
    if mountMode=='unmounting'
      oldBaseComponent.remove()
      if @listIndex? then @holder.removeChild(@listIndex) #notSetFirstLast
      @mountMode = null
      return
    baseComponent = @getBaseComponent()
    baseComponent.parentNode = @parentNode
    if oldBaseComponent and baseComponent!=oldBaseComponent
      oldBaseComponent.replace(baseComponent, @) # pass the root holder
    else
      if !baseComponent.node
        nextNode = oldBaseComponent and oldBaseComponent.nextNodeComponent and oldBaseComponent.nextNodeComponent.node or @mountBeforeNode
        baseComponent.executeMountCallback()
        baseComponent.createDom(mounting)
        baseComponent.attachNode(nextNode)
      else
        mounting = @mountMode=='mounting' or mounting
        if mounting
          nextNode = oldBaseComponent and oldBaseComponent.nextNodeComponent and oldBaseComponent.nextNodeComponent.node or @mountBeforeNode
          baseComponent.executeMountCallback()
          if !baseComponent.noop then baseComponent.updateDom(mounting)
          baseComponent.attachNode(nextNode)
          @mountMode = null
        else if !baseComponent.noop then baseComponent.updateDom(mounting)

  getBaseComponent: ->
    if @valid then return @baseComponent
    @valid = true
    content = @content = @getContentComponent()
    content.holder = @
    content.mountBeforeNode = @mountBeforeNode
    @baseComponent = baseComponent = content.getBaseComponent()
    if baseComponent.container
      if (baseComponent.container != @container or baseComponent.listPath!=@listPath) and !baseComponent.referable
        throw new Error 'do not mount unreferable component in mutlitple places'
    else
      baseComponent.container = @container
      content.container = @container
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    baseComponent

  getNode: -> @content and @content.getNode()


