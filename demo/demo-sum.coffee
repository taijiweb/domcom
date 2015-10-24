{see, flow, list, text, p} = dc

module.exports = demoSum = ->
  a = see 1, parseFloat; b = see 2, parseFloat
  comp = list(t1=text({value: a, onchange:-> a(@value)}), t2=text({value: b, onchange:-> b(@value)}), p1 = p(flow.add a, b))
  #comp = list(t1=text({$model: a}), t2=text({$model:b}), p1 = p(flow.add a, b))
#  comp = list(t1=text(a), t2=text(b), p1 = p(flow.add a, b))
  dc.updateWhen([t1, t2], 'change', p1)
#  t1.updateWhen('change', p1)
#  t2.updateWhen('change', p1)
  comp.mount()

module.exports = demoSum = ->
#    {list, text, p, flow, see} = require 'domcom'
    demoSum = ->
      a = see 1; b = see 2
      comp = list \
        (t1 = text value: a, onchange: (-> a @value*1)),
        (t2 = text value: b, onchange: (-> b @value*1)),
        p1 = p flow.add a, b
      dc.updateWhen [t1, t2], 'change', p1
      comp.mount()

    demoSum()

