Component = require './component'
{mountMode} = require '../../constant'
{UNMOUNT} = mountMode

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
    if !@node and @mountCallbackList
      for cb in @mountCallbackList then cb()
    if !@transformValid
      @transformValid = true
      content = @getContentComponent()
      if @content and content!=@content
        @content.parentNode = null
        @content.removeDom()
      @content = content
    else content = @content
    content.holder = @
    content.parentNode = @parentNode
    content.nextNode = @nextNode
    content.renderDom()
    @node = content.node
    @firstNode = content.firstNode
    @baseComponent = content.baseComponent
    @

  removeDom: ->
    if !@node or !@node.parentNode or @parentNode then return @
    content = @content
    if content.holder==@
      content.parentNode = null
      content.removeDom()
    if @unmountCallbackList
      for cb in @unmountCallbackList then cb()
    @

