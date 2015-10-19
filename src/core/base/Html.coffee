Text = require './Text'

{funcString, newLine} = require '../../util'

# !!! Warning:
# By default, Html does not escape to safe the html.
# So it's UNSAFE!!! to use Html class without a transform function.
# It's your responsibility to keep it in safe!
# Maybe a npm package like escape-html would help.

# this is for Html Component, which take some text as innerHTML
# for <html> ... </html>, please use tagHtml instead

module.exports = class Html extends Text
  constructor: (text, @transform) ->  super(text)

  createDom: ->
    @textValid = true
    node = document.createElement('DIV')
    node.innerHTML = @transform and @transform(@processText()) or @processText()
    # when the node in createElement('div').childNodes is inserted to dom, it is removed from the active childNodes
    # so they should be keep in an inative array
    @node = for node in node.childNodes then node
    @firstNode = @node[0]
    @

  updateDom: ->
    if !@textValid then return @
    @textValid = true
    if @parentNode then @removeNode()
    node = document.createElement('DIV')
    node.innerHTML = @transform and @transform(@processText()) or @processText()
    @node = node.childNodes
    @firstNode = @node[0]
    @

  attachNode: ->
    {node, parentNode} = @
    if parentNode == node.parentNode then return node
    node.parentNode = parentNode
    for childNode in node
      parentNode.insertBefore(childNode, @nextNode)
    node

  removeNode: ->
    parentNode = @node.parentNode
    for childNode in @node
      parentNode.removeChild(childNode)
    return

  toString: (indent=2, addNewLine) -> newLine("<Html #{funcString(@text)}/>", indent, addNewLine)
