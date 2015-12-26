BaseComponent = require './BaseComponent'
Text = require './Text'
{funcString, newLine} = require 'dc-util'
{domValue} = require '../../dom-util'

# !!! Warning:
# By default, Html does not escape to safe the html.
# So it's UNSAFE!!! to use Html class without a transform function.
# It's your responsibility to keep it in safe!
# Maybe a npm package like escape-html would help.

# this is for Html Component, which take some text as innerHTML
# for <html> ... </html>, please use tagHtml instead

module.exports = class Html extends Text
  constructor: (text, @transform) ->
    super(text)

  createDom: ->
    @textValid = true
    node = document.createElement('DIV')
    text = @transform and @transform(domValue(@text)) or domValue(@text)
    node.innerHTML = text
    @cacheText = text
    # when the node in createElement('div').childNodes is inserted to dom,
    # it is removed from the active childNodes
    # so they should be keep in an array
    @node = for node in node.childNodes then node
    @firstNode = @node[0]
    @

  updateDom: ->
    if @textValid
      return @

    @textValid = true

    text = @transform and @transform(domValue(@text)) or domValue(@text)

    if text!=@cacheText
      if @node.parentNode then @removeNode()
      node = document.createElement('DIV')
      node.innerHTML =  text
      # when the node in createElement('div').childNodes is inserted to dom,
      # it is removed from the active childNodes
      # so they should be keep in an array
      node = for n in node.childNodes then n
      @setNode(node)
      @setFirstNode = node[0]
      @cacheText = text
    # else null # text do not change, do nothing

    @

  attachNode: ->
    {node, parentNode, nextNode} = @

    if parentNode == node.parentNode and nextNode == node.nextNode
      node
    else
      node.parentNode = parentNode
      node.nextNode = nextNode

      for childNode in node
        try
          parentNode.insertBefore(childNode, @nextNode)
        catch e
          dc.error(e)
        # do not need set nextNode for every childNode
        # domcom do not care about them

      node

  removeNode: ->
    {node} = @
    parentNode = node.parentNode
    node.parentNode = null
    for childNode in node
      parentNode.removeChild(childNode)
    return

  toString: (indent=2, addNewLine) -> newLine("<Html #{funcString(@text)}/>", indent, addNewLine)

# todo: implement another WrapHtml, which is always wraped in a tag