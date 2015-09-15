{func, see2, flow, each, list, div, number} = dc

module.exports = ->
  x = 0
  comp = null
  indexInput = number({onchange: -> x = parseInt(@value); comp.update()})
  lst = each [0, 1, 2, 3], (item) ->
    div style: {display: -> if item==x then 'block' else 'none'},
      item
  comp = list(indexInput, lst)

# The above is just for demonstration
# it can be implemented like below:
module.exports = ->
  x = 0
  comp = null
  indexInput = number({onchange: -> x = parseInt(@value); comp.update()})
  comp = list(indexInput, func(-> if x>=0 and x<=3 then div x))

# by using flow, it can be improved like below
module.exports = ->
  x = see2 0
  #comp = list(number(x).bind('change', -> pane.update()), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))
  #  comp = list(number(x).bind('change', pane.update.bind(pane)), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))
  #list(num=number(x), func(flow x, -> v = x(); if v>=0 and v<=3 then div v)).updateWhen(num, 'change')
  list(num=number(x), func(flow x, -> v = x(); if v>=0 and v<=3 then div v).updateWhen(num, 'change'))
