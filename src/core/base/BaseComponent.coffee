Component = require './component'
{insertNode} = require '../../dom-util'
{cloneObject} = require '../../util'

module.exports = class BaseComponent extends Component
  constructor: ->
    super()
    @isBaseComponent = true
    @baseComponent = @

  renderDom: ->
    if !@parentNode
      if @node and @node.parentNode
        @valid = true
        return @removeDom()
      else return @
    if !@node
      @valid = true
      @emit('beforeAttach')
      @createDom()
    else if !@valid
      @valid = true
      @updateDom()
    @attachNode(@parentNode, @nextNode)
    @

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder and @holder.invalidateContent(@)
