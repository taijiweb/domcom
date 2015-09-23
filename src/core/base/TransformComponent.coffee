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
      if @listIndex? then @holder.removeChild(@listIndex)
      @mountMode = null
      @node
    baseComponent = @getBaseComponent()
    baseComponent.parentNode = @parentNode
    if oldBaseComponent and baseComponent!=oldBaseComponent
      oldBaseComponent.replace(baseComponent, @) # pass the root holder
      @node = node = baseComponent.node
      @listIndex? and @container.node[@listIndex] = node
      holder = @holder
      while holder and holder.isTransformComponent
        holder.node = node
        holder = holder.holder
      @node
    else
      created = baseComponent.created
      if !created
        nextNode = oldBaseComponent and oldBaseComponent.nextLeaf and oldBaseComponent.nextLeaf.node or @mountBeforeNode
        baseComponent.executeMountCallback()
        baseComponent.createDom(mounting)
        baseComponent.attachNode(nextNode)
        baseComponent.created = true
        @firstLeaf = baseComponent.firstLeaf
        @lastLeaf = baseComponent.lastLeaf
        @node = baseComponent.node
      else
        mounting = @mountMode=='mounting' or mounting
        if mounting
          nextNode = oldBaseComponent and oldBaseComponent.nextLeaf and oldBaseComponent.nextLeaf.node or @mountBeforeNode
          baseComponent.executeMountCallback()
          if !baseComponent.noop then baseComponent.updateDom(mounting)
          baseComponent.attachNode(nextNode)
          @mountMode = null
          @node
        else if !baseComponent.noop then baseComponent.updateDom(mounting)

  getBaseComponent: ->
    if @valid then return @baseComponent
    @valid = true
    content = @content = @getContentComponent()
    content.holder = @
    content.container = @container
    content.mountBeforeNode = @mountBeforeNode
    content.listIndex = @listIndex
    baseComponent = content.getBaseComponent()
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    @baseComponent = baseComponent

