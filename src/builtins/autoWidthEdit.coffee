{see, pipe, div, text, extendAttrs, extend} = dc

exports.autoWidthEditController = autoWidthEditController = (options={}) ->

  controller = {}

  initialWidth = options.initialWidth or 48
  spaceWidth = options.spaceWidth or 40
  inputTextWidth$ = see initialWidth
  inputEvents = options.inputEvents and options.inputEvents.split(/\s+/) or ["onkeydown"]

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
    fontSize: -> controller.component.css('fontSize'),
    fontFamily: -> controller.component.css('fontFamily'),
    fontWeight: -> controller.component.css('fontWeight'),
    letterSpacing: -> controller.component.css('letterSpacing')
    visibility: 'hidden'

  testSubject = div({style:testSubjectStyle}, inputText$)

  inputAttrs =
    style:
      'z-index': '10',
      width: pipe inputTextWidth$, (w) -> Math.max(Math.floor(w)+spaceWidth, initialWidth)+'px'
      whiteSpace: 'nowrap'

  for inputEvent in inputEvents
    inputAttrs[inputEvent] = (event, comp) ->
      event.executeDefault = true
      inputText$ @value
      inputTextWidth$ testSubject.node.getBoundingClientRect().width
      controller.component.update()
      @focus()

  extend controller, {testSubject, inputAttrs}

exports.autoWidthEdit = (attrs, inputAttrs, options) ->
  controller =  autoWidthEditController(options)
  inputComp = text(extendAttrs(controller.inputAttrs, inputAttrs))
  div(attrs, [inputComp, controller.testSubject]).addController(controller)

