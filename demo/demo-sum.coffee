{see, see2, flow, list, text, p} = dc

module.exports = demoSum = ->
  toNumber = (x) -> x*1
  a = see2 1, toNumber; b = see2 2, toNumber
  comp = list(t1=text({value: a, onchange:-> a(@value)}), t2=text({value: b, onchange:-> b(@value)}), p1 = p(flow.add a, b))
  #comp = list(t1=text({$model: a}), t2=text({$model:b}), p1 = p(flow.add a, b))
#  comp = list(t1=text(a), t2=text(b), p1 = p(flow.add a, b))
  dc.updateWhen([t1, t2], 'change', p1)
#  t1.updateWhen('change', p1)
#  t2.updateWhen('change', p1)
  comp.mount()
