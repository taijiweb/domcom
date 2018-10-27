BaseComponent = require('./BaseComponent')
{funcString, newLine, value, dynamic} = require('dc-util')
{domField, domValue} = require('../dom-util')

{setText} = require('../property/attrs')

if 'textContent' of document.documentElement
  hasTextContent = true
else
  hasTextContent = false

exports = module.exports = class Text extends BaseComponent

  isText: true

  constructor: (text) ->
    super()
    this.setText(text)

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

  setText: setText

  createDom: ->
    this.valid = true
    text = domValue(this.text, this)
    node = document.createTextNode(text)
    node.component = this
    this.node = node
    this.firstNode = node
    node

  updateDom: ->
    node = this.node
    this.valid = true
    text = domValue(this.text, this)
    if hasTextContent
      if text != node.textContent
        node.textContent = text
    else
      if text != node.innerText
        node.innerText = text
    node
    
  clone: ->
    result = new this.constructor(this.text)
    result.copyEventListeners(this)

  toString: (indent=2, addNewLine) -> newLine(funcString(this.text), indent, addNewLine)
