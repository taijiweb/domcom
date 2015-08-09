{div, text} = require '../core'

editComp = inputComp = null
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
  fontSize: -> editComp.css('fontSize'),
  fontFamily: -> editComp.css('fontFamily'),
  fontWeight: -> editComp.css('fontWeight'),
  letterSpacing: -> editComp.css('letterSpacing')
  visibility: 'hidden'

testSubject = div({style:testSubjectStyle}, (-> editComp.value))

exports.contextEditAttrs = contextEditAttrs =
  onclick: (event, comp) -> @focus()

exports.inputKeyFn = (event, comp) ->
  event.executeDefault = true
  editComp.value = @value
  editWidth = testSubject.node.getBoundingClientRect().width
  editComp.update()
  inputComp.node.focus()

exports.inputAttrs = inputAttrs = {
  style: {
    position: 'absolute',
    'z-index': '10',
    width: -> Math.max(Math.floor(editWidth)+40, 48)+'px'
    whiteSpace: 'nowrap'}
  onkeydown: (event, comp) -> (exports.inputKeyFn.bind(@))(event, comp)
}

exports.makeComponent = ->
  exports.inputComp = inputComp = text(inputAttrs)
  editComp = div(contextEditAttrs, inputComp, testSubject)
