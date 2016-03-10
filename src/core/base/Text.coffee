BaseComponent = require('./BaseComponent')
{funcString, newLine, value, dynamic} = require('dc-util')
{domField, domValue} = require('../../dom-util')

if 'textContent' of document.documentElement
  hasTextContent = true
else
  hasTextContent = false

exports = module.exports = class Text extends BaseComponent
  constructor: (text) ->
    super()
    this.text = text = domField(text)

    me = this
    if typeof text == 'function'
      text.onInvalidate ->
        me.textValid = false
        me.invalidate()

    this.isText = true

    this.family = {}
    this.family[this.dcid] = true
    this

  invalidateOffspring: (offspring) ->
    holder = this.holder
    if !holder
      # while the component is not mounted, the holder may be undefined
      this
    else
      if holder == dc
        dc.invalidateOffspring(offspring)
      else
        if holder.isBaseComponent
          holder.invalidateOffspring(offspring)
        else
          holder.invalidate()
    this

  createDom: ->
    this.textValid = true
    text = domValue(this.text)
    node = document.createTextNode(text)
    this.node = node
    this.firstNode = node
    this.cacheText = text
    node

  refreshDom: ->
    this.valid = true
    node = this.node
    if this.textValid
      return node
    else
      this.textValid = true
      text = domValue(this.text)
      if text!=this.cacheText
        if hasTextContent
          node.textContent = text
        else
          node.innerText = text
        this.cacheText = text
      node

  clone: -> (new this.constructor(this.text)).copyEventListeners(this)

  toString: (indent=2, addNewLine) -> newLine(funcString(this.text), indent, addNewLine)
