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
    holder.invalidateContent(@)

  invalidateContent: (content) ->
    @invalidate()

  invalidateTransform: ->
    @transformValid = false
    @invalidate()

  invalidateAttachStatus: ->
    @invalidate()

  render: (oldBaseComponent) ->
    if @valid then return @node
    @valid = true
    if !oldBaseComponent
      if @mountCallbackList
        for cb in @mountCallbackList then cb()
    if !@transformValid then @content = @getContentComponent()
    @content.render(oldBaseComponent)

  xxxrender: (mounting) ->
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

