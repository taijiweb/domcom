{list, each
text, p
bindings} = dc

exports.eachDemo1 = ->
  lst = [1, 2]
  comp = list(lst)
  #comp.mount()

exports.eachDemo2 = ->
  lst = [1, 2]
  comp = each(lst, (item) -> p item)
  #comp.mount()

exports.eachDemo3 = ->
  lst = [1, 2, 3, 4, 5, 6]
  comp = each(lst, (item) -> p item)
  #comp.mount()
  setTimeout((-> lst.push 7; comp.update()), 1000)
  setTimeout((-> lst.setLength 4; comp.update()), 2000)
  comp
