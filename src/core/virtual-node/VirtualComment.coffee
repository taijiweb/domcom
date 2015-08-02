VirtualText = require './VirtualText'

module.exports = class VirtualComment extends VirtualText
  createDom: -> @baseComponent.node = @node = document.createComment(@processText()); @
  updateDom: -> @text and @node.data = @processText(); @

