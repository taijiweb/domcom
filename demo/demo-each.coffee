{list, each
p, txt} = dc

exports.eachDemo1 = ->
  lst1 = [1, 2]
  comp = list(lst1)

exports.eachDemo2 = ->
  lst2 = [1, 2]
  comp = each(lst2, (item) -> p item)

exports.eachDemo3 = ->
  lst3 = [1, 2, 3, 4, 5, 6]
  comp = each(lst3, (item) -> p item)
  comp.on 'willAttach', ->
    setTimeout((-> lst3.push 7; comp.update()), 1000)
    setTimeout((-> lst3.setLength 4; comp.update()), 2000)
  comp

exports.eachDemo4 = ->
  lst4 = [1, 2, 3, 4, 5, 6]
  comp = each(lst4, (item) -> txt item)
  comp.on 'willAttach', ->
    setTimeout((-> lst4.push 7; comp.update()), 1000)
    setTimeout((-> lst4.setLength 4; comp.update()), 2000)
  comp
