{div, text, overAttrs, Tag} = dc

exports.AutoWidthEdit = class AutoWidthEdit extends Tag
  constructor: (contextEditAttrs, inputAttrs, inputKeyFn=@inputKeyFn) ->
    me = this
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
      fontSize: -> me.css('fontSize'),
      fontFamily: -> me.css('fontFamily'),
      fontWeight: -> me.css('fontWeight'),
      letterSpacing: -> me.css('letterSpacing')
      visibility: 'hidden'
    testSubject = div({style:testSubjectStyle}, (=> @value))
    @inputKeyFn = (event, comp) ->
      event.executeDefault = true
      node = comp.node
      me.value = node.value
      editWidth = testSubject.node.getBoundingClientRect().width
      me.update()
      node.focus()
    _inputAttrs =
      style:
        'z-index': '10',
        width: -> Math.max(Math.floor(editWidth)+40, 48)+'px'
        whiteSpace: 'nowrap'
      onkeydown: (event, comp) -> me.inputKeyFn(event, comp)
    @inputComp = text(overAttrs _inputAttrs, inputAttrs)
    contextEditAttrs = overAttrs {onclick: (event, comp) -> @focus()}, contextEditAttrs
    super('div', contextEditAttrs, [@inputComp, testSubject])

exports.autoWidthEdit = (contextEditAttrs, inputAttrs, inputKeyFn) ->
  new AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn)