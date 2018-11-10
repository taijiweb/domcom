{func, see, flow, each, list, div, number} = dc

->
  x = 0
  comp = null
  indexInput = number({onchange: -> x = parseInt(this.node.value); comp.render(); dc.clean() })
  lst = each [0, 1, 2, 3], (item) ->
    div style: {display: -> if item==x then 'block' else 'none'},
      item
  comp = list(indexInput, lst)

# The above is just for demonstration
# it can be implemented like below:
->
  x = 0
  comp = null
  indexInput = number({onchange: -> x = parseInt(this.node.value); comp.render(); dc.clean() })
  comp = list(indexInput, func(-> if x>=0 && x<=3 then div x))

# by using flow, it can be improved like below
export default  ->
  x = see 0
  #comp = list(number(x).bind('change', -> comp.render()), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))
  #  comp = list(number(x).bind('change', pane.update.bind(pane)), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))
  #list(num=number(x), func(flow x, -> v = x(); if v>=0 and v<=3 then div v)).renderWhen(num, 'change')
  comp = list(num=number(x), func(flow x, -> v = x(); if v>=0 && v<=3 then div v))
  comp.renderWhen(num, 'change')
