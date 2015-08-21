VirtualNode = require './VirtualNode'

module.exports = class VirtualDomNode extends VirtualNode

  constructor: (baseComponent) ->
    @node = baseComponent.node

  isActive: -> @vtreeRootComponent or @children

  cacheDomProperties: ->
    {node, cacheProps, props, cacheStyle, style, events, cacheSpecials, specials} = @
    @cacheClassName = node.className
    for prop, value of props
      cachePros[prop] = node[prop]
    nodeStyle = node.style
    for prop, value of style
      cacheStyle[prop] = nodeStyle(node, prop)
    for key, value of specials
      cacheSpecials[key] = @getSpecialProp(key)
    @cacheClassName = node.className
    @

  createDom: -> @  # this should not be called, because @node exists

  updateDom: -> @baseComponent.renderProperties(); @
