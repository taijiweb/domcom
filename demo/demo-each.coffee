{list, each
p, txt
bindings} = dc

exports.eachDemo1 = ->
  lst = [1, 2]
  comp = list(lst)

exports.eachDemo2 = ->
  lst = [1, 2]
  comp = each(lst, (item) -> p item)

exports.eachDemo3 = ->
  lst = [1, 2, 3, 4, 5, 6]
  comp = each(lst, (item) -> p item)
  setTimeout((-> lst.push 7; comp.update()), 1000)
  setTimeout((-> lst.setLength 4; comp.update()), 2000)
  comp

exports.eachDemo4 = ->
  lst = [1, 2, 3, 4, 5, 6]
  comp = each(lst, (item) -> txt item)
  setTimeout((-> lst.push 7; comp.update()), 1000)
  setTimeout((-> lst.setLength 4; comp.update()), 2000)
  comp
