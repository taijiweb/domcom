Component = require './component'
{insertNode} = require '../../dom-util'
{cloneObject} = require '../../util'

module.exports = class BaseComponent extends Component
  constructor: (options) ->
    super(options)
    @isBaseComponent = true
    @baseComponent = @

  render: (oldBaseComponent) ->
    mountMode = @mountMode
    if mountMode=='unmounting'
      @remove()
      if @listIndex? then @holder.removeChild(@listIndex) #notSetFirstLast
      @mountMode = null
      return
    if !@node
      if @mountCallbackList
        for cb in @mountCallbackList then cb()
      @createDom(parentNode, nextNode)
      @attachNode(parentNode, nextNode)
      @created = true
      @node
    else if baseComponent!=oldBaseComponent
      oldBaseComponent.replace(baseComponent, @) # pass the root holder
      @node
    else
      mounting = @mountMode=='mounting' or mounting
      if mounting
        if @mountCallbackList
          for cb in @mountCallbackList then cb()
        if !@noop then @updateDom(parentNode, nextNode)
        @attachNode(parentNode, nextNode)
        @mountMode = null
        @node
      else if !@noop then @updateDom(mounting)

  getBaseComponent: -> @

  attachNode: (parentNode, nextNode) ->
    @unmounted = false
    detached = @detached
    @detached = false
    node = @node

    # propogating node: set node of all holder which is TransformCompnent or List
    child = @; holder = @holder
    while 1
      if child.listIndex?
        holder.node[child.listIndex] = node
        break
      if !holder then break
      if !holder.isTransformComponent then break
      holder.node = node
      child = holder; holder = holder.holder

    if !@parentNode then return

    # if below, then should wait List holder to attach
    if holder and  holder.isList and (!holder.created or holder.detached)
      @parentNode = holder.parentNode
      return node

    if @isList
      if @created and !detached
        # child component should have attached themself
        return node
      else
        insertNode(@parentNode, node, nextNode)
        @setUnmounted(false)
    else @parentNode.insertBefore(node, nextNode)

    node

  setUnmounted: (value) -> @unmounted = value

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder.invalidateContent(@)

  replace: (newBaseComponent, rootContainer) ->
    @removeNode()
    @detached = true
    if @unmountCallback
      for cb in @unmountCallback then cb()
    if !newBaseComponent.node
      newBaseComponent.createDom(@parentNode, @nextNode)
      newBaseComponent.attachNode(nextLeaf and nextLeaf.node or rootContainer.mountBeforeNode)
      newBaseComponent.detached = false
      newBaseComponent.created = true
    else
      if !newBaseComponent.noop then newBaseComponent.updateDom(true) # mounting = true
      newBaseComponent.attachNode(nextLeaf and nextLeaf.node or rootContainer.mountBeforeNode)
      newBaseComponent.detached = false
    return

  remove: ->
    @removeNode()
    if @unmountCallback
      for cb in @unmountCallback then cb()
    return

  removeNode: ->
    if !@parentNode or @unmounted then return
    @parentNode.removeChild(@node)
    @unmounted = true
