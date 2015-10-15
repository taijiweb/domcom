Component = require './component'
{insertNode} = require '../../dom-util'

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

  renderDom: (oldBaseComponent, options) ->
    if @valid then return @node
    @valid = true
    if !@node and @mountCallbackList
      for cb in @mountCallbackList then cb()
    if !@transformValid
      content = @content = @getContentComponent()
      content.parentNode = @parentNode
    else content = @content
    content.renderDom(oldBaseComponent, options)
    @node = content.node
    @baseComponent = content.baseComponent