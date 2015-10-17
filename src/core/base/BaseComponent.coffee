Component = require './component'
{insertNode} = require '../../dom-util'
{cloneObject} = require '../../util'

{mountMode} = require '../../constant'
{UNMOUNT} = mountMode

module.exports = class BaseComponent extends Component
  constructor: (options) ->
    super(options)
    @isBaseComponent = true
    @baseComponent = @

  renderDom: ->
    if !@parentNode
      if @node and @node.parentNode
        @valid = true
        return @removeDom()
      else return @
    if !@node
      @valid = true
      if @mountCallbackList
        for cb in @mountCallbackList then cb()
      @createDom()
    else if !@valid
      @valid = true
      @updateDom()
    @attachNode(@parentNode, @nextNode)
    @

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder and @holder.invalidateContent(@)

  replace: (oldBaseComponent, options) ->
    @valid = true
    oldBaseComponent.removeNode()
    if oldBaseComponent.unmountCallbackList
      for cb in oldBaseComponent.unmountCallbackList then cb()
    if !@node then @createDom({})
    else @updateDom({})
    @attachNode(@parentNode,@nextNode)
    @