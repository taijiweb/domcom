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
    else if @!=oldBaseComponent
        @replace(oldBaseComponent, options)
    else if !@node
      if @mountCallbackList
        for cb in @mountCallbackList then cb()
      @createDom(options)
    else @updateDom(options)
    @

  attachNode: (parentNode, nextNode) ->
    node = @node
    if @parentNode = parentNode then return node
    parentNode.insertBefore(node, nextNode)
    node

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder.invalidateContent(@)

  replace: (oldBaseComponent, options) ->
    oldBaseComponent.removeNode()
    if oldBaseComponent.unmountCallbackList
      for cb in oldBaseComponent.unmountCallbackList then cb()
    if !@node then @createDom(options)
    else @updateDom(options)
    @attachNode(options.parentNode, options.nextNode)
    @

  remove: ->
    @removeNode()
    if @unmountCallbackList
      for cb in @unmountCallbackList then cb()
    return

  removeNode: ->
    if !@parentNode then return
    @parentNode.removeChild(@node)
    @parentNode = null
