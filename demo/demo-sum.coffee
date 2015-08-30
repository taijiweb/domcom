{reative, flow, list, text, p} = dc

module.exports = demoSum = ->
  a = reative(1); b = reative(2)
  comp = list(t1=text({onchange:-> a(@value)}), t2=text({onchange:-> b(@value)}), p1 = p(flow(a, b, -> a()+b())))
  dc.updateWhen([t1, t2], 'change', p1)
  comp.mount()
