{see, if_, list, each, div, p, text, duplex} = dc

exports.demoEachPush = ->
  lst = [1, 2]
  comp = list each(lst, (item) -> p item), 'some other thing'
  comp.mount()
  lst.push 3
  comp.render()

exports.demoIfEach = ->
  showingEach$ = see true
  lst4 = [1, 2]
  comp = if_ showingEach$, each(lst4, (item) -> div item)
  comp.mount()
  showingEach$ false
  comp.render()
  dc.clean()
  showingEach$ true
  comp.render()
  dc.clean()

exports.demoModelOnMultipleInput =  ->
  a = {}
  #a_x$ = duplex(a, 'x')
  text1 = text($model:duplex(a, 'x'))
  text2 = text($model:duplex(a, 'x'))
  list(text1, text2)
    .renderWhen([text1, text2], 'change')
    .mount()