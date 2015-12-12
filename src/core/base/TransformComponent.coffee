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
        @content = content
      #else null # do nothing

    content.holder = @

    @baseComponent = content.getBaseComponent()

  renderDom: ->
    {parentNode, node} = @
    if !parentNode
      @holder = null
      return @removeDom()

    if @valid
      if parentNode and !node.parentNode
        {baseComponent} = @
        baseComponent.parentNode = parentNode
        baseComponent.nextNode = @nextNode
        baseComponent.attachNode()
      return @
    else
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
        oldBaseComponent.markRemovingDom(parentNode)
      #else null # have no oldBaseComponent, do nothing

      @setParentAndNextNode(baseComponent)
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
      # since baseComponent do not change,
      # so it is probably not necessary to do the thing below
      # @setParentAndNextNode(baseComponent)

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

  # while TransformComponent.renderDom(),
  # if oldBaseComponent is not the same as the new baseComponent
  # oldBaseComponent should be removed from dom
  # if and only if it's and its offspring's parentNode is equal to
  # the transformComponent's parentNode
  markRemovingDom: (parentNode) ->
    # if the parentNode of this component has changed to other parentNode
    # it should have bene moved to other places, or have been removed before
    if @parentNode != parentNode
      return
    else
      @parentNode = null
      while content = @content
        content.markRemovingDom(parentNode)
        if content.isBaseComponent
          break
      return

  removeDom: ->
    if @parentNode or !@node or !@node.parentNode
      @
    else
      @emit('removeDom')
      @baseComponent.removeDom()
      @

