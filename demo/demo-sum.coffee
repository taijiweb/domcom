{see, flow, list, text, p} = dc

module.exports = demoSum = ->
  a = see 1, parseFloat; b = see 2, parseFloat
  comp = list(t1=text({value: a, onchange:-> a(this.value)}), t2=text({value: b, onchange:-> b(this.value)}), p1 = p(flow.add a, b))
  #comp = list(t1=text({$model: a}), t2=text({$model:b}), p1 = p(flow.add a, b))
#  comp = list(t1=text(a), t2=text(b), p1 = p(flow.add a, b))
  comp.renderWhen([t1, t2], 'change')

module.exports = demoSum = ->
  a = see 1; b = see 2
  list(
    (t1 = text value: a, onchange: (-> a this.value*1)),
    (t2 = text value: b, onchange: (-> b this.value*1)),
    p1 = p flow.add a, b
  ).renderWhen([t1, t2], 'change')