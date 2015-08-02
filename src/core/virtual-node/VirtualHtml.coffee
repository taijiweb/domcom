VirtualText = require  './VirtualText'

module.exports = class VirtualHtml extends VirtualText
  createDom: -> @baseComponent.node = @node = document.createDocumenutFragment(@processText()); @
  updateDom: ->
    if !@text then return @
    @baseComponent.node = @node = document.createDocumenutFragment @processText()
    @

