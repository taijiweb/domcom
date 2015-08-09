{div, text} = require '../core'

editComp = inputComp = null
editWidth = 48

testSubject = div({
  style: {
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
  }}, (-> editComp.value))

exports.contextEditAttrs = contextEditAttrs = {
  onclick: (event, comp) -> @focus()
  onmouseenter: (event, comp) -> @focus()
  onmouseleave: (event, comp) -> comp.hide()
}

exports.keyFnMap =
  27: (event, comp) ->  # esc
    editComp.hide()
    editComp.update()

  13: (event, comp) -> #enter
    editComp.hide()
    editComp.update()

exports.inputKeyFn = (event, comp) ->
  event.executeDefault = true
  key = event.keyCode or event.which
  fn = exports.keyFnMap[key]
  if fn then fn(event)
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
  onkeydown: -> exports.inputKeyFn()
}

exports.makeComponent = ->
  exports.inputComp = inputComp = text(inputAttrs)
  editComp = div(contextEditAttrs, inputComp, testSubject)
