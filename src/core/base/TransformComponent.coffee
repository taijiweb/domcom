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

    # assure getBaseComponent only be called in renderDom()
    # otherwise beforeAttach will be emitted multiple times
    if !@node
      @emit('beforeAttach')

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
        if oldContent and oldContent.holder == this
          oldContent.holder = null
        @content = content
      #else null # do nothing

    content.holder = @

    @baseComponent = content.getBaseComponent()

  renderDom: ->
    {parentNode, node} = @

    if @valid
      if parentNode and !node.parentNode
        {baseComponent} = @
        baseComponent.markRemovingDom(false)
        baseComponent.parentNode = parentNode
        baseComponent.nextNode = @nextNode
        baseComponent.attachNode()
      return @

    @valid = true
    oldBaseComponent = @baseComponent
    baseComponent = @getBaseComponent()

    # removeDom if necessary
    # and renderDom() for new baseComponent
    if baseComponent != oldBaseComponent

      # mark remoing oldBaseComponent at first
      # and then render baseComponent
      # and tnen oldBaseComponent.removeDom()
      # to avoid unnecessary remove and insert
      if oldBaseComponent
        oldBaseComponent.markRemovingDom(true)
      #else null # have no oldBaseComponent, do nothing

      baseComponent.setParentNode(parentNode)
      baseComponent.setNextNode(@nextNode)

      baseComponent.renderDom()

      if @node != baseComponent.node
        @setNode baseComponent.node
      if @firstNode != baseComponent.firstNode
        @setFirstNode baseComponent.firstNode

      # really removeDom()
      # if it has not been recalled, it will be removed from dom
      # otherwise do nothing
      if oldBaseComponent
        oldBaseComponent.removeDom()
      #else null # have no oldBaseComponent, do nothing

    else
      baseComponent.renderDom()

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

  markRemovingDom: (removing) ->
    @baseComponent and @baseComponent.markRemovingDom(removing)

  removeDom: ->
    @baseComponent.removeDom()
    @

