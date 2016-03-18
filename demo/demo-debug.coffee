{see, if_, list, each, div, p, text, duplex} = dc

exports.demoEachPush = ->
  lst = [1, 2]
  comp = list each(lst, (item) -> p item), 'some other thing'
  comp.mount()
  lst.push 3
  dc.update()

exports.demoIfEach = ->
  showingEach$ = see true
  lst4 = [1, 2]
  comp = if_ showingEach$, each(lst4, (item) -> div item)
  comp.mount()
  showingEach$ false
  dc.update()
  showingEach$ true
  dc.update()

exports.demoModelOnMultipleInput =  ->
  a = {}
  #a_x$ = duplex(a, 'x')
  text1 = text($model:duplex(a, 'x'))
  text2 = text($model:duplex(a, 'x'))
  comp = list(text1, text2)
  dc.updateWhen([text1, text2], 'change')
  comp.mount()