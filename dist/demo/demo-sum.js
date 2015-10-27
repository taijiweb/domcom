var demoSum, flow, list, p, see, text;

see = dc.see, flow = dc.flow, list = dc.list, text = dc.text, p = dc.p;

module.exports = demoSum = function() {
  var a, b, comp, p1, t1, t2;
  a = see(1, parseFloat);
  b = see(2, parseFloat);
  comp = list(t1 = text({
    value: a,
    onchange: function() {
      return a(this.value);
    }
  }), t2 = text({
    value: b,
    onchange: function() {
      return b(this.value);
    }
  }), p1 = p(flow.add(a, b)));
  dc.updateWhen([t1, t2], 'change', p1);
  return comp.mount();
};

module.exports = demoSum = function() {
  demoSum = function() {
    var a, b, comp, p1, t1, t2;
    a = see(1);
    b = see(2);
    comp = list((t1 = text({
      value: a,
      onchange: (function() {
        return a(this.value * 1);
      })
    })), (t2 = text({
      value: b,
      onchange: (function() {
        return b(this.value * 1);
      })
    })), p1 = p(flow.add(a, b)));
    dc.updateWhen([t1, t2], 'change', p1);
    return comp.mount();
  };
  return demoSum();
};
