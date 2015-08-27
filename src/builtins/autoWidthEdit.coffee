{div, text, overAttrs, Tag} = dc

exports.AutoWidthEdit = class AutoWidthEdit extends Tag
  constructor: (contextEditAttrs, inputAttrs, inputKeyFn=@inputKeyFn) ->
    self = this
    editWidth = 48
    testSubjectStyle =
      position:'absolute'
      top:'30px'
      width: 'auto',
      height:'20px'
      whiteSpace: 'nowrap',
      display: 'inline-block',
      margin: '0',
      padding: '0',
      fontSize: -> self.css('fontSize'),
      fontFamily: -> self.css('fontFamily'),
      fontWeight: -> self.css('fontWeight'),
      letterSpacing: -> self.css('letterSpacing')
      visibility: 'hidden'
    testSubject = div({style:testSubjectStyle}, (=> @value))
    @inputKeyFn = (event, comp) ->
      event.executeDefault = true
      node = comp.node
      self.value = node.value
      editWidth = testSubject.node.getBoundingClientRect().width
      self.update()
      node.focus()
    _inputAttrs =
      style:
        position: 'absolute',
        'z-index': '10',
        width: -> Math.max(Math.floor(editWidth)+40, 48)+'px'
        whiteSpace: 'nowrap'
      onkeydown: (event, comp) -> self.inputKeyFn(event, comp)
    @inputComp = text(overAttrs _inputAttrs, inputAttrs)
    contextEditAttrs = overAttrs {onclick: (event, comp) -> @focus()}, contextEditAttrs
    super('div', contextEditAttrs, [@inputComp, testSubject])

exports.autoWidthEdit = (contextEditAttrs, inputAttrs, inputKeyFn) ->
  new AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn)