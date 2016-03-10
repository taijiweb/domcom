{see, pipe} = require('lazy-flow')
{extend} = require('extend')
{text, div} = require('../core/tag')
{extendAttrs} = require('../core/property')

#  options.inputComponent is not given, container.children[0] will be used as inputComponent <input type="text">
# options.inputEvents can be like "onkeydown onkeyup ...", the default value is "onkeydown"
exports.setAutoWidth = setAutoWidth = (container, options={}) ->

  initialWidth = options.initialWidth or 48
  spaceWidth = options.spaceWidth or 40
  inputTextWidth$ = see initialWidth
  inputEvents = options.inputEvents or "onkeydown"
  inputComponent = options.inputComponent or container.children[0]

  inputText$ = see ""

  testSubjectStyle =
    position:'absolute'
    top:'30px'
    width: 'auto',
    height:'20px'
    whiteSpace: 'nowrap',
    display: 'inline-block',
    margin: '0',
    padding: '0',
    fontSize: -> container.css('fontSize'),
    fontFamily: -> container.css('fontFamily'),
    fontWeight: -> container.css('fontWeight'),
    letterSpacing: -> container.css('letterSpacing')
    visibility: 'hidden'

  testSubject = div({style:testSubjectStyle}, inputText$)

  inputAttrs =
    style:
      'z-index': '10',
      width: pipe inputTextWidth$, (w) -> Math.max(Math.floor(w)+spaceWidth, initialWidth)+'px'
      whiteSpace: 'nowrap'

  inputEventHandler = (event, comp) ->
    event.executeDefault = true
    inputText$ @value
    inputTextWidth$ testSubject.node.getBoundingClientRect().width
    dc.update()
    @focus()

  inputComponent.extendAttrs(inputAttrs)
  inputComponent.bind inputEvents, inputEventHandler

  container.pushChild testSubject

  container

exports.autoWidthEdit = (attrs, inputAttrs, options) ->
  component = div(attrs, inputComp = text())
  setAutoWidth(component, options)
