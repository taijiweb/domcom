{expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{util
bind, duplex, see
classFn, styleFrom, attrToPropName
extendAttrs
Component, list, func, if_
a, p, span, text, li, div, checkbox
model, show, hide, splitter, options} = dc

describe 'domcom/properties/utilities', ->

  it 'styleFrom', ->
    x = styleFrom("display:none; zIndex:100; backgroundColor:white;")
    expect(x).to.deep.equal {display:'none', zIndex:'100', backgroundColor:'white'}

  it 'attrToPropName', ->
    x = attrToPropName("background-color")
    expect(x).to.equal 'backgroundColor'

  it 'cssAdd 1', ->
    comp = p({style:{width:'1px'}})
    result = comp.cssAdd('width', 2)
    expect(result).to.equal(comp)
    expect(comp.css('width')).to.equal('3px')

  it 'cssAdd 2', ->
    comp = p({style:{width:'0.5%'}})
    result = comp.cssAdd('width', 3.6)
    expect(result).to.equal(comp)
    expect(comp.css('width')).to.equal('4.1%')

  it 'cssMul', ->
    comp = p({style:{width:'2px'}})
    result = comp.cssMul('width', 3)
    expect(result).to.equal(comp)
    expect(comp.css('width')).to.equal('6px')

describe 'domcom/properties/extendAttrs', ->

  it 'extendAttrs({class{a:1}}, className({b:1})', ->
    attrs = extendAttrs({class:{a:1}}, {className:{b:1}})
    expect(classFn(attrs.className).call()).to.equal("a b")

  it 'extendAttrs({style:{width:1}}, {style:{height:2}})', ->
    attrs = extendAttrs({style:{width:1}}, {style:{height:2}})
    expect(attrs.style.width).to.equal(1)
    expect(attrs.style.height).to.equal(2)

describe "domcom/properties/classFn", ->
  it 'get value of classFn', ->
    active = see true
    x = classFn(['a', {b: active}])
    expect(x()).to.equal 'a b'
    active false
    expect(x()).to.equal 'a'

  it 'should compute valid', ->
    x = classFn(['a'])
    expect(x.valid).to.equal false
    expect(x()).to.equal('a')
    expect(x.valid).to.equal true
    x.extend('a')
    expect(x.valid).to.equal true
    expect(x()).to.equal('a')
    x.extend('b')
    expect(x.valid).to.equal false
    expect(x()).to.equal('a b')
    x.extend('!b')
    expect(x.valid).to.equal false
    expect(x()).to.equal('a')

  it 'should get class property in component', ->
    active = see true
    comp = div({class:{a:1, b:active}})
    expect(comp.className.call(comp)).to.equal('a b', 'first')
    comp.className = classFn {a:1, b:active} # need be assign again before the call before affected the className and its invalid
    expect(comp.className.valid).to.equal false, 'className.valid 1'
    expect(comp.hasActiveProperties).to.equal true, 'hasActiveProperties 1'
    comp.mount()
    expect(comp.className.valid).to.equal true, 'className.valid 2'
    expect(comp.hasActiveProperties).to.equal false, 'hasActiveProperties 2'
    expect(comp.node.className).to.equal('a b', 'second')
    active false
    expect(comp.className.valid).to.equal false, 'className.valid 3'
    expect(comp.hasActiveProperties).to.equal true, 'hasActiveProperties 3'
    comp.render()
    expect(comp.node.className).to.equal('a', '3')

describe 'domcom/properties/create', ->
  it 'should create properties', ->
    comp = p({value:bind({a: 1}, 'a')})
    expect(comp.className.valid).to.equal true, 'className.valid'
    expect(comp.hasActiveProperties).to.equal true, 'hasActiveProperties'
    comp.mount()
    expect(comp.node.value).to.equal(1)

describe 'domcom/properties/event', ->
  it 'click event ', ->
    x = 1
    comp = a({onclick: -> x = 2}, 'click me')
    comp.mount('#demo')
    comp.node.onclick({type:'click'})
    expect(x).to.equal(2)

  it 'multiple handlers for one event', ->
    $a = duplex(x={a:1}, 'a')
    spy1 = sinon.spy()
    comp = text({onchange:spy1, $model:$a})
    comp.mount()
    comp.node.value = 2
    comp.node.onchange({type:'change'})
    expect(spy1.called).to.equal true
    expect(x.a).to.equal '2'

  it 'multiple handlers with bind value', ->
    $a = duplex(x={a:1}, 'a')
    spy1 = sinon.spy()
    comp = text({onchange:spy1}, $a)
    comp.mount()
    comp.node.value = 2
    comp.node.onchange({type:'change'})
    expect(spy1.called).to.equal true
    expect(x.a).to.equal '2'

describe 'domcom/properties/style', ->
  it 'should set style property with string value', ->
    comp = a({style: "border:red 1px solid"}, 'red 1px solid')
    expect(comp.className.valid).to.equal true, 'className.valid'
    expect(comp.hasActiveProperties).to.equal true, 'hasActiveProperties'
    elm = comp.mount('#demo')
    expect(comp.node.style.border).to.equal "1px solid red"

  it 'should set style property', ->
    comp = a({style: {border:"red 1px solid"}}, 'red 1px solid')
    elm = comp.mount('#demo')
    expect(comp.node.style.border).to.equal "1px solid red"

  it 'value of property of style could be dc expression', ->
    comp = a({style: {border: -> "red 1px solid"}}, 'red 1px solid')
    elm = comp.mount('#demo')
    expect(comp.node.style.border).to.equal "1px solid red"

  nit 'change style dynamically', ->
    paddingColor = (hexStr) ->
      if !(hexStr.match /^\d/)  then return hexStr
      while (hexStr.length < 6)
        hexStr = '0' + hexStr
      '#'+hexStr
    color = see "red"
    i$ = see i=0
    comp = a({style: {borderWidth: (flow i$, -> i$()+"px"), borderStyle: "solid", borderColor: flow color, -> paddingColor(color().toString(16))}}, 'dynamic property')
    comp.mount('#demo')
    color = 0
    styleFn = ->
      color += 0x111111
      i$ i++
      comp.render()
      if i==50
        clearInterval handle
    handle = setInterval(styleFn, 5)

describe 'domcom/properties/bind checkbox', ->
  it 'bidirectional bind checkbox', ->
    dc.directives $model: dc.$model
    model1 = {a: 1}
    bb = duplex(model1, 'a')
    cbx = checkbox({$model:bb})
    cbx.mount('#demo')
    expect(cbx.node.onchange).to.be.defined
    cbx.node.checked = true
    cbx.node.onchange({type:'change'})
    expect(model1.a).to.equal true