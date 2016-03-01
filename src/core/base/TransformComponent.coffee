Component = require('./component')

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

  renderDom: (oldBaseComponent) ->
    if !(attached=@attached)
      @emit('willAttach')
    if @valid
      if oldBaseComponent==@baseComponent
        if attached
          return @
        else
          @attached = true
          @baseComponent.attachNode(@parentNode, @nextNode)
      else
        @attached = true
        baseComponent = @baseComponent
        baseComponent.renderDom(oldBaseComponent)
        @node = baseComponent.node
        @firstNode = baseComponent.firstNode
    else
      @valid = true
      @attached = true
      if !@transformValid
        @transformValid = true
        oldContent = @content
        @content = content = @getContentComponent()
        if oldContent and oldContent != content and oldContent.holder == @ and oldContent != oldBaseComponent
          needRemoveOld = true
          oldContent.markRemovingDom(true)
        content.holder = @
      else
        content = @content
      content.parentNode = @parentNode
      content.nextNode = @nextNode
      content.renderDom(oldBaseComponent)
      if needRemoveOld
        oldContent.removeDom()
      @baseComponent = baseComponent = content.baseComponent
      @node = baseComponent.node
      @firstNode = baseComponent.firstNode
    if !attached
      @emit('didAttach')
    @

  setParentNode: (parentNode) ->
    if @parentNode!=parentNode
      @parentNode = parentNode
      @content and @content.setParentNode(parentNode)
    return

  setNextNode: (nextNode) ->
    @nextNode = nextNode
    @content and @content.setNextNode(nextNode)
    return

  getNode: -> @content and @content.getNode()

  markRemovingDom: (removing) ->
    @holder = null
    @baseComponent and @baseComponent.markRemovingDom(removing)

  removeDom: ->
    if !@attached
      return
    @emit('willDetach')
    @baseComponent.removeDom()
    @emit('didDetach')
    @attached = false
    @
