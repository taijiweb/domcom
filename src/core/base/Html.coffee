Tag = require('./Tag')
{funcString, newLine, mixin} = require('dc-util')
{domValue, domField} = require('../../dom-util')
{setText} = require('../property/attrs')

# !!! Warning:
# By default, Html does not escape to safe the html.
# So it's UNSAFE to use Html class without a transform function!!!
# It's the responsibilityn of user program to keep it in safe!
# Maybe a npm package like escape-html will help.

# this is Html Component, which take some text as innerHTML
# for <html> ... </html>, please use tagHtml instead

module.exports = class Html extends Tag

  constructor: (attrs, text, transform) ->
    if typeof attrs == 'string' || typeof attrs == 'function'
      transform = text
      text = attrs
      attrs = {}
    else
      attrs = attrs || {}

    if attrs.tagName
      tagName = attrs.tagName
      delete attrs.tagName
    else tagName = 'div'

    this.initHtmlComponent(text, transform)

    super(tagName, attrs, [])

  toString: (indent=2, addNewLine) ->
    newLine("<Html #{funcString(@_text)}/>", indent, addNewLine)

Html.HtmlMixin = HtmlMixin = {

  setText: setText

  initHtmlComponent: (text, transform) ->
    @transform = transform

    this.setText(text)

    if Object.defineProperty
      me = this

      get = -> me._text
      set = (text) ->
        me.setText(text)
        text

      Object.defineProperty(this, 'text', {get, set})

  # initListMixin is called by the constructor of Tag class
  # so put a empty definition here
  initListMixin: ->

  createDom: ->
    @textValid = true
    @node = @firstNode = node = document.createElement(this.tagName)
    node.component = this
    this.updateProperties()
    this.cacheText = node.innerHTML = @transform and @transform(domValue(@_text, this)) or domValue(@_text, this)
    @

  refreshDom: ->
    this.valid = true

    if @textValid
      return @

    @textValid = true
    text = @transform and @transform(domValue(@_text, this)) or domValue(@_text, this)

    node = @node

    if text!=@cacheText
      if node.childNodes.length >=2
        if node.parentNode
          @removeNode()
        @node = @firstNode = node = node.cloneNode(false)
        this.attachNode()
        node.component = this
      node.innerHTML =  text

      @cacheText = text
    # else null # text do not change, do nothing

    # this should be done after this.node is processed
    # because may be cloneNode
    this.updateProperties()

    @

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
}

ListMixin = require('./ListMixin')
for method of ListMixin
  do (method=method) ->
    Html.prototype[method] = ->
      dc.error("Html component has no children components, do not call ListMixin method(#{method}) on it")

extend = require('extend')

extend(Html.prototype, HtmlMixin)
