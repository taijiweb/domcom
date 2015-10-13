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
    holder.invalidateContent(@)

  invalidateContent: (content) ->
    @invalidate()

  invalidateTransform: ->
    @transformValid = false
    @invalidate()

  renderDom: (oldBaseComponent, options) ->
    if @valid then return @node
    @valid = true
    if !@node
      if @mountCallbackList
        for cb in @mountCallbackList then cb()
    if !@transformValid then @content = @getContentComponent()
    @content.renderDom(oldBaseComponent, options)