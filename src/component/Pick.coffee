toComponent = require('./toComponent')

TranComponent = require('./TranComponent')

{newLine} = require('dc-util')

extend = require('extend')

export default class Pick extends TranComponent
  constructor: (@host, field, initialContent) ->

    super()

    me = this

    if !field?
      this.field = field = 'content'
    else this.field = field

    if initialContent
      this._content = host[field] = toComponent(initialContent)
    else
      this._content = host[field] = toComponent(host[field])

    this.family = family = extend {}, this._content.family
    family[this.dcid] = true

    if Object.defineProperty

      get = -> me._content

      set = (content) ->
        me.setContent(content)
        content

      Object.defineProperty(host, field, {get, set})

  setContent: (content) ->
    oldContent = this._content

    if content == oldContent
      this
    else
       this.invalidateTransform()
       this.onSetContent(content, oldContent)
       this._content = toComponent content
       this

  onSetContent: (content, oldContent) -> this

  getContentComponent: -> this._content

  # this probably should be overloaded by the subclass
  clone: ->
    (new this.constructor(this.host, this.field)).copyEventListeners(this)

  toString: (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<Pick:'+this.field+': '+this._content.toString(indent+2, true)+'>'