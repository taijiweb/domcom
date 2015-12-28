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

  renderDom: (oldBaseComponent) ->
    if @valid
      if oldBaseComponent==@baseComponent
        return @
      else
        baseComponent = @baseComponent
        baseComponent.renderDom(oldBaseComponent)
        @node = baseComponent.node
        @firstNode = baseComponent.firstNode
    else
      @valid = true
      if !@transformValid
        @transformValid = true
        oldContent = @content
        @content = content = @getContentComponent()
        if oldContent and oldContent.holder == @
          oldContent.holder = null
        content.holder = @
      else
        content = @content
      content.parentNode = @parentNode
      content.nextNode = @nextNode
      content.renderDom(oldBaseComponent)
      @baseComponent = baseComponent = content.baseComponent
      @node = baseComponent.node
      @firstNode = baseComponent.firstNode
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
    @baseComponent and @baseComponent.markRemovingDom(removing)

  removeDom: ->
    @baseComponent.removeDom()
    @

