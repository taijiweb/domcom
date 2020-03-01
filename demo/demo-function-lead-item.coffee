if_ = (test, then_, else_) ->
  if test
    then_
  else
    else_


export default  module.exports = ->
  view  = -> ['div',
              ['text', 'x'],
              [if_, !(this.x*1), ['div', 'It is 0 or NaN.'], ['div', 'it is other number']]]
  dc({view, x:1})
