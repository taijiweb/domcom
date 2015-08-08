{bindings, list, text, p} = dc

module.exports = demoSum = ->
  {$a, $b} = bindings({a: 1, b: 2})
  #comp = list(p(-> 1))
  comp = list(text({onchange:->comp.update()}, $a), text({onchange:->comp.update()}, $b), p(-> parseFloat($a())+parseFloat($b())))
#  comp.mount()
#  comp.update()
#  comp.update()
#  comp.update()
#  comp.update()
  #setInterval (-> comp.update()),  300