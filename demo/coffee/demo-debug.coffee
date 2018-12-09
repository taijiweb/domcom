exports = {}

exports.demoEachPush = ->
  list = [1, 2]
  view = ['div', ['div', this.list.map((item) => ['p', item])], 'some other thing']
  comp = dc({view, list})
  comp.mount()
  lst.push 3
  comp.update()

exports.demoIfEach = ->
  view = ->
    if this.showing
      this.list.map (item) -> ['div', {}, item]
    else
      null
  comp = {view, list:[1, 2]}
  comp.mount()
  comp.showing = false
  comp.showing = true
  comp

exports.demoModelOnMultipleInput =  ->
  view = ->
    ['div', ['text', {'#':[[dc.model,'x']]}], ['text', {'#':[[dc.model,'x']]}]]
  comp = dc({view, x:'input some text'})

export default exports