Component = require './component'

module.exports = class TransformComponent extends Component
  constructor: ->
    super()
    @valid = false
    @transformValid = false
    @isTransformComponent = true

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder and @holder.invalidateContent(@)

  invalidateContent: (content) ->
    @invalidate()

  invalidateTransform: ->
    @transformValid = false
    @invalidate()

  getBaseComponent: ->
    if @transformValid
      content = @content
    else
      @transformValid = true

      # should let @valid be true
      # otherwise invalidate will stop propagate in this component
      # especially for invalidate event in getContentComponent
      # e.g. div({}, each1=each([1], -> each2=each((-> [x]), (item) -> item)))
      # the invalidation caused by -> [x] was stopped! if without the code below
      @valid = true

      oldContent = @content
      content = @getContentComponent()

      if content!=oldContent
        @emit('contentChanged', oldContent, content)
        @content = content
      #else null # do nothing

    content.holder = @

    @baseComponent = content.getBaseComponent()

  renderDom: ->
    {parentNode, node} = @
    if !parentNode
      @holder = null
      if node and node.parentNode
        return @removeDom()
      else return @

    if @valid
      if parentNode and !node.parentNode
        {baseComponent} = @
        baseComponent.parentNode = parentNode
        baseComponent.nextNode = @nextNode
        baseComponent.attachNode()
      return @
    else
      @valid = true

    !@node and @emit('beforeAttach')

    oldBaseComponent = @baseComponent
    baseComponent = @getBaseComponent()

    # removeDom if necessary
    # and renderDom() for new baseComponent
    if baseComponent != oldBaseComponent

      if oldBaseComponent
        oldBaseComponent.parentNode = null
        if oldBaseComponent.node and oldBaseComponent.node.parentNode
          oldBaseComponent.removeDom()
        #else null # do nothing
      #else null # do nothing
      @setParentAndNextNode(baseComponent)
      baseComponent.renderDom()
      if @node != baseComponent.node
        @setNode baseComponent.node
      if @firstNode != baseComponent.firstNode
        @setFirstNode baseComponent.firstNode

    else
      @setParentAndNextNode(baseComponent)
      baseComponent.renderDom()

    @

  # set parentNode and nextNode field for transformComponent and its offspring, till baseComponent
  setParentAndNextNode: (baseComponent) ->
    {content, parentNode, nextNode} = @
    loop
      content.parentNode = parentNode
      content.nextNode = nextNode
      if content == baseComponent then break
      else content = content.content
    return

  removeDom: ->
    content = @content
    content.holder = null
    content.parentNode = null
    content.removeDom()
    @emit('afterRemoveDom')
    @

