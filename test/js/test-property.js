var Component, a, attrToPropName, bind, checkbox, classFn, ddescribe, div, duplex, expect, extendAttrs, func, hide, idescribe, if_, iit, li, list, model, ndescribe, nit, options, p, see, show, span, splitter, styleFrom, text, util;

({expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper'));

({util, bind, duplex, see, classFn, styleFrom, attrToPropName, extendAttrs, Component, list, func, if_, a, p, span, text, li, div, checkbox, model, show, hide, splitter, options} = dc);

describe('domcom/properties/utilities', function() {
  it('styleFrom', function() {
    var x;
    x = styleFrom("display:none; zIndex:100; backgroundColor:white;");
    return expect(x).to.deep.equal({
      display: 'none',
      zIndex: '100',
      backgroundColor: 'white'
    });
  });
  it('attrToPropName', function() {
    var x;
    x = attrToPropName("background-color");
    return expect(x).to.equal('backgroundColor');
  });
  it('cssAdd 1', function() {
    var comp, result;
    comp = p({
      style: {
        width: '1px'
      }
    });
    result = comp.cssAdd('width', 2);
    expect(result).to.equal(comp);
    return expect(comp.css('width')).to.equal('3px');
  });
  it('cssAdd 2', function() {
    var comp, result;
    comp = p({
      style: {
        width: '0.5%'
      }
    });
    result = comp.cssAdd('width', 3.6);
    expect(result).to.equal(comp);
    return expect(comp.css('width')).to.equal('4.1%');
  });
  return it('cssMul', function() {
    var comp, result;
    comp = p({
      style: {
        width: '2px'
      }
    });
    result = comp.cssMul('width', 3);
    expect(result).to.equal(comp);
    return expect(comp.css('width')).to.equal('6px');
  });
});

describe('domcom/properties/extendAttrs', function() {
  it('extendAttrs({class{a:1}}, className({b:1})', function() {
    var attrs;
    attrs = extendAttrs({
      class: {
        a: 1
      }
    }, {
      className: {
        b: 1
      }
    });
    return expect(classFn(attrs.className).call()).to.equal("a b");
  });
  return it('extendAttrs({style:{width:1}}, {style:{height:2}})', function() {
    var attrs;
    attrs = extendAttrs({
      style: {
        width: 1
      }
    }, {
      style: {
        height: 2
      }
    });
    expect(attrs.style.width).to.equal(1);
    return expect(attrs.style.height).to.equal(2);
  });
});

describe("domcom/properties/classFn", function() {
  it('get value of classFn', function() {
    var active, x;
    active = see(true);
    x = classFn([
      'a',
      {
        b: active
      }
    ]);
    expect(x()).to.equal('a b');
    active(false);
    return expect(x()).to.equal('a');
  });
  it('should compute valid', function() {
    var x;
    x = classFn(['a']);
    expect(x.valid).to.equal(false);
    expect(x()).to.equal('a');
    expect(x.valid).to.equal(true);
    x.extend('a');
    expect(x.valid).to.equal(true);
    expect(x()).to.equal('a');
    x.extend('b');
    expect(x.valid).to.equal(false);
    expect(x()).to.equal('a b');
    x.extend('!b');
    expect(x.valid).to.equal(false);
    return expect(x()).to.equal('a');
  });
  it('should get class property in component', function() {
    var active, comp;
    active = see(true);
    comp = div({
      class: {
        a: 1,
        b: active
      }
    });
    expect(comp.className.call(comp)).to.equal('a b', 'first');
    comp.className = classFn({
      a: 1,
      b: active // need be assign again before the call before affected the className and its invalid
    });
    expect(comp.className.valid).to.equal(false, 'className.valid 1');
    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 1');
    comp.mount();
    expect(comp.className.valid).to.equal(true, 'className.valid 2');
    expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties 2');
    expect(comp.node.className).to.equal('a b', 'second');
    active(false);
    expect(comp.className.valid).to.equal(false, 'className.valid 3');
    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 3');
    comp.render();
    return expect(comp.node.className).to.equal('a', '3');
  });
  it('should get functional class property in component', function() {
    var active, comp;
    active = see(true);
    comp = div({
      class: function() {
        return {
          a: 1,
          b: active
        };
      }
    });
    return expect(comp.className.call(comp)).to.equal('a b', 'first');
  });
  return it('should get false class property in component', function() {
    var active, comp;
    active = see(true);
    comp = div({
      class: function() {
        return {
          a: false
        };
      }
    });
    return expect(comp.className.call(comp)).to.equal('', 'first');
  });
});

describe('domcom/properties/create', function() {
  return it('should create properties', function() {
    var comp;
    comp = p({
      value: bind({
        a: 1
      }, 'a')
    });
    expect(comp.className.valid).to.equal(true, 'className.valid');
    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
    comp.mount();
    return expect(comp.node.value).to.equal(1);
  });
});

describe('domcom/properties/event', function() {
  it('click event ', function() {
    var comp, x;
    x = 1;
    comp = a({
      onclick: function() {
        return x = 2;
      }
    }, 'click me');
    comp.mount('#demo');
    comp.node.onclick({
      type: 'click'
    });
    return expect(x).to.equal(2);
  });
  it('multiple handlers for one event', function() {
    var $a, comp, spy1, x;
    $a = duplex(x = {
      a: 1
    }, 'a');
    spy1 = sinon.spy();
    comp = text({
      onchange: spy1,
      $model: $a
    });
    comp.mount();
    comp.node.value = 2;
    comp.node.onchange({
      type: 'change'
    });
    expect(spy1.called).to.equal(true);
    return expect(x.a).to.equal('2');
  });
  return it('multiple handlers with bind value', function() {
    var $a, comp, spy1, x;
    $a = duplex(x = {
      a: 1
    }, 'a');
    spy1 = sinon.spy();
    comp = text({
      onchange: spy1
    }, $a);
    comp.mount();
    comp.node.value = 2;
    comp.node.onchange({
      type: 'change'
    });
    expect(spy1.called).to.equal(true);
    return expect(x.a).to.equal('2');
  });
});

describe('domcom/properties/style', function() {
  it('should set style property with string value', function() {
    var comp, elm;
    comp = a({
      style: "border:red 1px solid"
    }, 'red 1px solid');
    expect(comp.className.valid).to.equal(true, 'className.valid');
    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
    elm = comp.mount('#demo');
    return expect(comp.node.style.border).to.equal("1px solid red");
  });
  it('should set style property', function() {
    var comp, elm;
    comp = a({
      style: {
        border: "red 1px solid"
      }
    }, 'red 1px solid');
    elm = comp.mount('#demo');
    return expect(comp.node.style.border).to.equal("1px solid red");
  });
  it('value of property of style could be dc expression', function() {
    var comp, elm;
    comp = a({
      style: {
        border: function() {
          return "red 1px solid";
        }
      }
    }, 'red 1px solid');
    elm = comp.mount('#demo');
    return expect(comp.node.style.border).to.equal("1px solid red");
  });
  return nit('change style dynamically', function() {
    var color, comp, handle, i, i$, paddingColor, styleFn;
    paddingColor = function(hexStr) {
      if (!(hexStr.match(/^\d/))) {
        return hexStr;
      }
      while (hexStr.length < 6) {
        hexStr = '0' + hexStr;
      }
      return '#' + hexStr;
    };
    color = see("red");
    i$ = see(i = 0);
    comp = a({
      style: {
        borderWidth: flow(i$, function() {
          return i$() + "px";
        }),
        borderStyle: "solid",
        borderColor: flow(color, function() {
          return paddingColor(color().toString(16));
        })
      }
    }, 'dynamic property');
    comp.mount('#demo');
    color = 0;
    styleFn = function() {
      color += 0x111111;
      i$(i++);
      comp.render();
      if (i === 50) {
        return clearInterval(handle);
      }
    };
    return handle = setInterval(styleFn, 5);
  });
});

describe('domcom/properties/bind checkbox', function() {
  return it('bidirectional bind checkbox', function() {
    var bb, cbx, model1;
    dc.directives({
      $model: dc.$model
    });
    model1 = {
      a: 1
    };
    bb = duplex(model1, 'a');
    cbx = checkbox({
      $model: bb
    });
    cbx.mount('#demo');
    expect(cbx.node.onchange).to.be.defined;
    cbx.node.checked = true;
    cbx.node.onchange({
      type: 'change'
    });
    return expect(model1.a).to.equal(true);
  });
});
