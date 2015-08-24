{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{util
sibind, bibind
classFn, styleFrom, attrToPropName
Component, list, func, if_
a, p, span, text, li, div, checkbox
model, show, hide, splitter, options} = dc

describe 'properties ', ->
  describe 'utilities', ->
    it 'styleFrom ', ->
      x = styleFrom("display:none; zIndex:100; backgroundColor:white;")
      console.log(JSON.stringify(x))
      expect(x).to.deep.equal {display:'none', zIndex:'100', backgroundColor:'white'}
    it 'attrToPropName ', ->
      x = attrToPropName("background-color")
      expect(x).to.equal 'backgroundColor'

  describe "classFn", ->
    it 'get value of classFn', ->
      active = true
      x = classFn(['a', {b: -> active}])
      expect(x()).to.equal 'a b'
      active = false
      expect(x()).to.equal 'a'

    it 'should compute needUpdate', ->
      active = true
      x = classFn(['a'])
      expect(x.needUpdate).to.equal true
      expect(x()).to.equal('a')
      expect(x.needUpdate).to.equal false
      x.extend('a')
      expect(x.needUpdate).to.equal false
      expect(x()).to.equal('a')
      x.extend('b')
      expect(x.needUpdate).to.equal true
      expect(x()).to.equal('a b')
      x.extend('!b')
      expect(x.needUpdate).to.equal true
      expect(x()).to.equal('a')

    it 'should get class property in component', ->
      active = true
      comp = div({class:{a:1, b:-> active}})
      expect(comp.className()).to.equal 'a b'
      comp.className = classFn {a:1, b:-> active} # need be assign again before the call before affected the className and its needUpdate
      expect(comp.className.needUpdate).to.equal true
      comp.mount()
      expect(comp.className.needUpdate).to.equal true
      expect(comp.activePropertiesCount).to.equal 1
      expect(comp.node.className).to.equal 'a b'
      active = false
      comp.update()
      expect(comp.node.className).to.equal 'a'

  describe 'create', ->
    it 'should create properties', ->
      p1 = p({value:sibind({a: 1}, 'a')})
      p1.mount()
      expect(p1.node.value).to.equal(1)

  describe 'event', ->
    it 'click event ', ->
      x = 1
      comp = a({onclick: -> x = 2}, 'click me')
      comp.mount('#demo')
      comp.node.click()
      expect(x).to.equal(2)

    it 'multiple handlers for one event', ->
      $a = bibind(x={a:2}, 'a')
      spy1 = sinon.spy()
      comp = text({onchange:spy1, $model:$a})
      comp.mount()
      comp.node.value = 2
      comp.node.onchange()
      expect(spy1.called).to.equal true
      expect(x.a).to.equal '2'

    it 'multiple handlers for one event, with bound value', ->
      $a = bibind(x={a:1}, 'a')
      spy1 = sinon.spy()
      comp = text({onchange:spy1}, $a)
      comp.mount()
      comp.node.value = 2
      comp.node.onchange()
      expect(spy1.called).to.equal true
      expect(x.a).to.equal '2'

  describe 'style', ->
    it 'should set style property with string value', ->
      comp = a({style: "border:red 1px solid"}, 'red 1px solid')
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
        if not (hexStr.match /^\d/)  then return hexStr
        while (hexStr.length < 6)
          hexStr = '0' + hexStr
        '#'+hexStr
      color = "red"
      i = 0
      comp = a({style: {borderWidth: (-> i+"px"), borderStyle: "solid", borderColor: -> paddingColor(color.toString(16))}}, 'dynamic property')
      comp.mount('#demo')
      color = 0
      styleFn = ->
        color += 0x111111
        i++
        comp.render()
        if i==50
          #comp.element.style.borderColor = "blue"
          clearInterval handle
      handle = setInterval(styleFn, 5)

  it 'bidirectional bound checkbox', ->
    model1 = {a: 1}
    bb = bibind(model1, 'a')
    cbx = checkbox({$model:bb})
    cbx.mount('#demo')
    expect(cbx.node.onchange).to.be.defined
    cbx.node.checked = true
    cbx.node.onchange()
    expect(model1.a).to.equal true