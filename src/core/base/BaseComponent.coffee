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

  renderDom: (oldBaseComponent, options) ->
    if options.mountMode==UNMOUNT then @removeNode()
    else if oldBaseComponent and @!=oldBaseComponent
      @valid = true
      @replace(oldBaseComponent, options)
    else if !@node
      @valid = true
      if @mountCallbackList
        for cb in @mountCallbackList then cb()
      @createDom(options)
      @attachNode(@parentNode, @nextNode)
    else if !@valid
      @valid = true
      @updateDom(options)
    @

  attachNode: ->
    node = @node
    if @parentNode == node.parentNode then return node
    @parentNode.insertBefore(node, @nextNode)
    node

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder and @holder.invalidateContent(@)

  replace: (oldBaseComponent, options) ->
    oldBaseComponent.removeNode()
    if oldBaseComponent.unmountCallbackList
      for cb in oldBaseComponent.unmountCallbackList then cb()
    if !@node then @createDom({})
    else @updateDom({})
    @attachNode(@parentNode,@nextNode)
    @

  remove: ->
    @removeNode()
    if @unmountCallbackList
      for cb in @unmountCallbackList then cb()
    return

  removeNode: ->
    if @node and !@node.parentNode then return
    @node.parentNode.removeChild(@node)
