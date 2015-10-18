Component = require './component'

module.exports = class TransformComponent extends Component
  constructor: (options) ->
    super(options)
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

  renderDom: ->
    if !@parentNode
      if @node and @node.parentNode
        return @removeDom()
      else return @
    if @valid then return @
    @valid = true
    if !@parentNode and @node.parentNode
      @removeDom()
    !@node and @emit('beforeAttach')
    oldContent = @content
    if !@transformValid
      @transformValid = true
      content = @getContentComponent()

      if oldContent and content!=oldContent
        @emit('contentChanged', oldContent, content)
        oldContent.parentNode = null
        if oldContent.node and oldContent.node.parentNode
          oldContent.removeDom()
      @content = content
    else content = oldContent
    content.holder = @
    content.parentNode = @parentNode
    content.nextNode = @nextNode
    content.renderDom()
    @node = content.node
    @firstNode = content.firstNode
    @baseComponent = content.baseComponent
    @

  removeDom: ->
    content = @content
    if content.holder==@
      content.parentNode = null
      content.removeDom()
    @emit('afterRemoveDom')
    @

