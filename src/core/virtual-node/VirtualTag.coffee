VirtualList = require './VirtualList'
VirtualNoop = require './VirtualNoop'
VirtualNode = require './VirtualNode'

module.exports = class VirtualTag extends VirtualNode

  constructor: (@baseComponent, @children) ->
    super
    @vtreeRootComponent = null
    @

  isActive: -> @baseComponent.activePropertiesCount or @vtreeRootComponent or @children

  createDom: ->
    {baseComponent, children} = @
    if baseComponent.namespace
      node = document.createElementNS(baseComponent.namespace, baseComponent.tagName)
    else node = document.createElement(baseComponent.tagName)
    baseComponent.node = @node = node
    baseComponent.renderProperties()
    @baseComponent.children.setParentNode(node)
    children and !children.isNoop and children.render()
    @isPlaceHolder = !baseComponent.activePropertiesCount and !@vtreeRootComponent and !@hasMountCallback()
    if children and children.isNoop then children = null
    @isNoop = @isPlaceHolder and !children
    @children = children
    @

  updateDom: ->
    {baseComponent, children} = @
    baseComponent.renderProperties()
    children and !children.isNoop and children.render()
    @isPlaceHolder = !baseComponent.activePropertiesCount and !@vtreeRootComponent and !@hasMountCallback()
    if children and children.isNoop then children = null
    @isNoop = @isPlaceHolder and !children
    @children = children
    @
