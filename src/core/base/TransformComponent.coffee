Component = require './component'
{insertNode} = require '../../dom-util'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
    @valid = false
    @isTransformComponent = true

  invalidate: ->
    if !@valid then return
    @valid = false
    activeChild = @
    holder = @holder
    while holder and !holder.isUpdateHook
      if holder.isTransformComponent
        holder.valid = false
        activeChild = holder
      holder = holder.holder
    if holder and holder.isUpdateHook
      holder.activeOffspring = holder.activeOffspring or Object.create(null)
      holder.activeOffspring[activeChild.dcid] = [activeChild, activeChild.holder, activeChild.listIndex]
      holder.invalidate()

  render: (mounting) ->
    oldBaseComponent = @baseComponent
    mountMode = @mountMode
    if mountMode=='unmounting'
      # this is only for the child of listComponent of Each Component
      oldBaseComponent.remove()
      @mountMode = null
      @node
    baseComponent = @getBaseComponent()
    baseComponent.parentNode = @parentNode
    if oldBaseComponent and baseComponent!=oldBaseComponent
      oldBaseComponent.replace(baseComponent, @) # pass the root holder
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
    content = @getContentComponent()
    baseComponent = content.getBaseComponent()
    content.holder = @
    content.mountBeforeNode = @mountBeforeNode
    @content = content
    if @mountCallbackList then baseComponent.mountCallbackComponentList.unshift @
    if @unmountCallbackList then baseComponent.unmountCallbackComponentList.push @
    @baseComponent = baseComponent

