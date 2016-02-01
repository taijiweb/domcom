toComponent = require('./toComponent')

TransformComponent = require('./TransformComponent')

{newLine} = require('dc-util')

extend = require('extend')

module.exports = class Pick extends TransformComponent
  constructor: (@host, field, initialContent) ->

    super()

    me = this

    if !field?
      @field = field = 'content'
    else @field = field

    if initialContent
      @_content = host[field] = toComponent(initialContent)
    else
      @_content = host[field] = toComponent(host[field])

    @family = family = extend {}, @_content.family
    family[@dcid] = true

    if Object.defineProperty

      get = -> me._content

      set = (content) ->
        me.setContent(content)
        content

      Object.defineProperty(host, field, {get, set})

  setContent: (content) ->
    oldContent = @_content

    if content == oldContent
      @
    else
       @invalidateTransform()
       @onSetContent(content, oldContent)
       @_content = toComponent content
       @

  onSetContent: (content, oldContent) -> @

  getContentComponent: -> @_content

  # this probably should be overloaded by the subclass
  clone: ->
    (new @constructor(@host, @field)).copyEventListeners(@)

  toString: (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<Pick:'+@field+': '+@_content.toString(indent+2, true)+'>'


