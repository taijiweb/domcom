var Component, List, Tag, Text, a, button, classFn, ddescribe, div, duplex, expect, fakeEvent, func, idescribe, if_, iit, input, li, list, model, ndescribe, nit, p, see, show, span, styleFrom, text, txt;

({expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper'));

({fakeEvent} = require('./helper'));

({duplex, see, classFn, styleFrom, model, show, Tag, Text, List, Component, list, func, if_, txt, a, p, span, text, li, div, button, input} = dc);

describe("component event", function() {
  afterEach(function() {
    return dc.reset();
  });
  it('component shoud call listeners before mounting', function() {
    var comp, x;
    x = 0;
    comp = p();
    comp.on('willMount', function() {
      return x = 1;
    });
    comp.mount();
    return expect(x).to.equal(1);
  });
  it('component shoud call listeners before mounting if_', function() {
    var comp, x;
    x = 0;
    comp = if_(1, 2, 3);
    comp.on('willMount', function() {
      return x = 1;
    });
    comp.mount();
    return expect(x).to.equal(1);
  });
  it('component shoud call then_.listeners before updating if_', function() {
    var comp, t, x;
    x = see(0);
    comp = if_(x, t = txt(1), txt(2));
    t.on('willMount', function() {
      return x(1);
    });
    comp.mount();
    expect(x()).to.equal(0);
    x(1);
    comp.render();
    return expect(x()).to.equal(1);
  });
  it('component shoud not call embeded listeners before updating if_', function() {
    var comp, t, x;
    x = see(0);
    comp = if_(x, p(t = txt(1)), txt(2));
    t.on('willMount', function() {
      return x(1);
    });
    comp.mount();
    expect(x()).to.equal(0);
    x(1);
    comp.render();
    return expect(x()).to.equal(1);
  });
  it('component shoud call listeners after mounting', function() {
    var comp, x;
    x = see(0);
    comp = p();
    comp.on('willMount', function() {
      return x(1);
    });
    comp.on('willUnmount', function() {
      return x(2);
    });
    comp.mount();
    expect(x()).to.equal(1);
    comp.unmount();
    return expect(x()).to.equal(2);
  });
  it('component shoud call mount and unmount listeners', function() {
    var comp, x, y;
    x = 0;
    y = 0;
    comp = if_(1, 2, 3);
    comp.on('willMount', function() {
      return x = 1;
    });
    comp.on('willUnmount', function() {
      return y = 2;
    });
    comp.mount();
    expect(x).to.equal(1);
    comp.unmount();
    return expect(y).to.equal(2);
  });
  it('component shoud NOT call then_.listeners["mount"] before updating if_', function() {
    var comp, t, t2, x, y;
    x = see(0);
    y = 0;
    comp = if_(x, t = txt(1), t2 = txt(2));
    t.on('willMount', function() {
      return x(1);
    });
    t2.on('willUnmount', function() {
      return y = 2;
    });
    comp.mount();
    expect(x()).to.equal(0, 'mount');
    x(1);
    comp.render();
    expect(x()).to.equal(1);
    return expect(y).to.equal(0);
  });
  return it('component shoud NOT call embeded mountCallback before updating if_', function() {
    var comp, t, t2, x, y;
    x = see(0);
    y = 0;
    comp = if_(x, p(t = txt(1)), p(t2 = txt(2)));
    t.on('willMount', function() {
      return x(1);
    });
    comp.mount();
    expect(x()).to.equal(0);
    x(1);
    comp.render();
    expect(x()).to.equal(1);
    return expect(y).to.equal(0);
  });
});

describe("delegate event", function() {
  it('component should delegate click event', function() {
    var comp, x;
    x = 0;
    comp = p();
    comp.mount();
    comp.delegate('click');
    comp.do_click = function() {
      return x = 1;
    };
    comp.node.onclick(fakeEvent(comp.node));
    return expect(x).to.equal(1);
  });
  it('component should delegate click event to its holder', function() {
    var child, comp, x;
    x = 0;
    comp = list([child = p()]);
    comp.mount();
    child.delegateToHolder('click');
    comp.do_click = function() {
      return x = 1;
    };
    child.node.onclick(fakeEvent(child.node));
    return expect(x).to.equal(1);
  });
  it('component should delegate click event from tag ancestor to its holder', function() {
    var child, comp, lst, x;
    x = 0;
    comp = div(lst = list([child = p()]));
    comp.mount();
    comp.delegateToHolder('click');
    lst.do_click = function() {
      return x = 1;
    };
    comp.node.onclick(fakeEvent(child.node));
    expect(child.node.onclick).to.be.null;
    return expect(x).to.equal(1);
  });
  return it('component should delegate click event by given component', function() {
    var child, comp, lst, x;
    x = 0;
    comp = div(lst = list([child = p()]));
    comp.mount();
    comp.delegateToComponent('click', lst);
    lst.do_click = function() {
      return x = 1;
    };
    comp.node.onclick(fakeEvent(child.node));
    expect(child.node.onclick).to.be.null;
    return expect(x).to.equal(1);
  });
});
