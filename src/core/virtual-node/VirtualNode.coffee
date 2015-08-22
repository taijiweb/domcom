{insertNode} = require '../../dom-util'
{newLine} = require '../../util'

module.exports = class VirtualNode
  constructor: ->
    @componentChain = []

  clone: -> new @constructor(@baseComponent)

  create: ->
    @executeMountCallback()
    @createDom()
    @attachNode()
    @

  update: ->
    {replacingBaseComponent} = @
    if replacingBaseComponent and @!=replaceingVTree
      oldBaseComponent = replacingBaseComponent.baseComponent
      if @baseComponent!=oldBaseComponent
        oldBaseComponent.remove()
        @baseComponent.parentNode = oldBaseComponent.parentNode
        if !@node then @create()
        else
          @executeMountCallback()
          if !@isNoop then @updateDom()
          @attachNode()
    if !@isNoop then @updateDom()

  attachNode: ->
    {baseComponent, node} = @
    baseParentNode = baseComponent.parentNode
    insertNode(baseParentNode, node, baseComponent.nextDomNode())
    for [container, index] in @componentChain
      if index? then container.node[index] = node
      else container.node = node
    node

  executeMountCallback: ->
    for [src, _] in @componentChain.concat([[@baseComponent]])
      if src.mountCallbackList
        for cb in src.mountCallbackList then cb()

  executeUnmountCallback: ->
    for [src, _] in @componentChain.concat([[@baseComponent]])
      if src.unmountCallbackList
        for cb in src.unmountCallbackList then cb()
    if @children
      if @children.executeUnmountCallback then @children.executeUnmountCallback()
      else
        for child in @children
          child.executeUnmountCallback()
    @

  hasMountCallback: ->
    baseComponent = @baseComponent
    if baseComponent.mountCallbackList or baseComponent.unmountCallbackList then return true
    for [src, _] in @componentChain
      if src.unmountCallbackList or src.unmountCallbackList then return true
    false

  toString: (indent=0, noNewLine) ->
    s = newLine(indent, noNewLine)
    s += '@'+@baseComponent.toString(indent, true)
    s