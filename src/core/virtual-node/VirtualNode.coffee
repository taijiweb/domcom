{insertNode} = require '../../dom-util'
{newLine} = require '../../util'

module.exports = class VirtualNode
  constructor: ->
    @srcComponents = []

  clone: -> new @constructor(@baseComponent)

  render: ->
    if !@node then creating = true; vtree = @
    else
      vtreeRootComponent = @vtreeRootComponent
      if vtreeRootComponent
        oldBaseComponent = @baseComponent
        vtree = vtreeRootComponent.getVirtualTree()
        if vtreeRootComponent.listIndex
          vtree.srcComponents.unshift(vtreeRootComponent.listIndex)
        if vtree.baseComponent!=oldBaseComponent
          oldBaseComponent.remove()
          if !vtree.node then creating = true; replacing = true
      else vtree = @
    if creating or replacing
      for [src, _] in vtree.srcComponents.concat([[vtree.baseComponent]])
        if src.mountCallbackList
          for cb in src.mountCallbackList then cb()
    if creating then vtree.createDom()
    else if !vtree.isNoop then vtree.updateDom()
    vtree.attachNode()
    vtree

  attachNode: ->
    {baseComponent, node} = @
    baseParentNode = baseComponent.parentNode
    insertNode(baseParentNode, node, baseComponent.nextNode())
    for [container, index] in @srcComponents
      if index? then container.node[index] = node
      else container.node = node
    node

  executeUnmountCallback: ->
    for [src, _] in @srcComponents.concat([[@baseComponent]])
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
    for [src, _] in @srcComponents
      if src.unmountCallbackList or src.unmountCallbackList then return true
    false

  toString: (indent=0, noNewLine) ->
    s = newLine(indent, noNewLine)
    s += '@'+@baseComponent.toString(indent, true)
    s