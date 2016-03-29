BaseComponent = require('./BaseComponent')
{funcString, newLine, value, dynamic} = require('dc-util')
{domField, domValue} = require('../../dom-util')

{setText} = require('../property/attrs')

if 'textContent' of document.documentElement
  hasTextContent = true
else
  hasTextContent = false

exports = module.exports = class Text extends BaseComponent
  constructor: (text) ->
    super()
    this.setText(text)
    this.isText = true

    if Object.defineProperty
      me = this

      get = -> me._text
      set = (text) ->
        me.setText(text)
        text

      Object.defineProperty(this, 'text', {get, set})

    this.family = {}
    this.family[this.dcid] = true
    this

  setText:setText

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
    text = domValue(this.text, this)
    node = document.createTextNode(text)
    node.component = this
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
      text = domValue(this.text, this)
      if text!=this.cacheText
        if hasTextContent
          node.textContent = text
        else
          node.innerText = text
        this.cacheText = text
      node

  clone: ->
    result = new this.constructor(this.text)
    result.copyEventListeners(this)

  toString: (indent=2, addNewLine) -> newLine(funcString(this.text), indent, addNewLine)
