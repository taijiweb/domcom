{expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{newDemoNode} = require('./helper')

{bindings, duplex, flow
classFn, styleFrom
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

describe "component  ", ->
  afterEach ->
    dc.clear()

  describe 'construct component', ->
    it 'component shoud have children', ->
      comp = p({}, [1, 2])
      expect(comp.children.length).to.equal 2

    it 'should construct component', ->
      p1 = new Tag('p', {}, [])
      d = new Tag('div', {}, [p1])
      expect(d.children[0]).to.equal p1

    it 'tag shoud have children 1', ->
      comp = new Tag('span', {}, [new Text('adf')])
      expect(comp.children[0].text).to.equal 'adf'

    it 'tag shoud have children 2', ->
      span1 = new Tag('span', {}, [new Text('adf')])
      comp = new Tag('div', {className:classFn('some class'), style:styleFrom("width:1px;")}, [span1])
      expect(comp.children[0]).to.equal span1

  describe 'component.create', ->
    it 'should create tag', ->
      comp = p()
      comp.mount()
      expect(comp.node.tagName).to.equal 'P'
      expect(comp.node.innerHTML).to.equal ''

    it 'should mount tag 1',  ->
      comp = new Tag('div', {}, [])
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV'

    it 'should correctly create TextNode with 0 as content', ->
        comp = txt(0)
        comp.mount()
        expect(comp.node.textContent).to.equal '0'

    it 'should correctly create tag with 0 as content', ->
      comp = p(0)
      comp.mount()
      expect(comp.node.innerHTML).to.equal '0'

    it 'should mount Text with flow value', ->
      {a_, b_} = bindings({a: 1, b: 2})
      comp = txt(flow.add a_, b_)
      comp.mount('#demo')
      expect(comp.node.textContent).to.equal '3',  'mount'

    it 'should not run event hanlder while creating tag', ->
      spy = sinon.spy()
      comp = p({onclick:spy})
      comp.mount()
      expect(spy.called).to.equal false
      comp.node.onclick()
      expect(spy.called).to.equal true

    it 'should process event name without on', ->
      spy = sinon.spy()
      comp = p({onclick:spy})
      comp.mount()
      expect(spy.called).to.equal false
      comp.node.onclick()
      expect(spy.called).to.equal true

    it 'should not run event hanlder while rendering tag', ->
      spy = sinon.spy()
      comp = p({onclick:spy})
      comp.mount()
      expect(spy.called).to.equal false
      comp.node.onclick()
      expect(spy.called).to.equal true

    it 'should not run event hanlder while rendering button tag', ->
      spy = sinon.spy()
      comp =  button({id:"search-ok", type:"submit", onclick:spy})
      comp.mount()
      expect(spy.called).to.equal false
      comp.node.onclick()
      expect(spy.called).to.equal true

    it 'should not run event hanlder while rendering div > button tag', ->
      spy = sinon.spy()
      comp =  div button({id:"search-ok", type:"submit", onclick:spy})
      comp.mount()
      expect(spy.called).to.equal false
      comp.children[0].node.onclick()
      expect(spy.called).to.equal true

    it 'should create tag with attribute', ->
      comp = p({className:'some class', style:"width:1px;"}, [])
      comp.mount()
      elm = comp.node
      expect(elm.className).to.equal 'some class'
      expect(elm.getAttribute('className')).to.equal null

    it 'should process function value of text', ->
      {a_} = bindings({a: 1})
      comp = text(a_)
      elm = comp.mount()
      elm = comp.node
      expect(elm.value).to.equal '1'

    it 'component shoud have children 2', ->
      comp = span('adf')
      expect(comp.children[0].text).to.equal 'adf'

    it 'should create tag with children', ->
      comp =  p({className:'some class', style:"width:1px;"}, span1=span(['adf']))
      expect(comp.children[0]).to.equal span1
      comp.mount()
      expect(comp.node.getElementsByTagName('span').length).to.equal 1

    it 'should mount tag 2', ->
      comp =  p({className:'some class', style:"width:1px;"}, [span(['adf'])])
      elm = comp.mount('#demo')
      expect(comp.parentNode.id).to.equal 'demo'
      expect(comp.node.parentNode.id).to.equal('demo')

    it 'should mount tag with undefined as child', ->
      comp =  p({className:'some class', style:"width:1px;"}, span(['adf']), txt(->))
      comp.mount('#demo')
      expect(comp.parentNode.id).to.equal 'demo'
      expect(comp.node.parentNode.id).to.equal('demo')

    it 'should mount list with undefined as child', ->
      comp =  list(span(['adf']), txt(-> undefined))
      elm = comp.mount('#demo')
      expect(comp.parentNode.id).to.equal 'demo'
      expect(comp.node[0].parentNode.id).to.equal('demo')

  describe 'component update', ->
    it 'should render tag 1', ->
      count = 1
      comp = new Tag('p',  {}, [new Text(-> count)])
      comp.mount()
      expect(comp.node.innerHTML).to.equal '1'
      ++count
      dc.update()
      expect(comp.node.innerHTML).to.equal('2', 'update 2')
      ++count
      dc.update()
      expect(comp.node.innerHTML).to.equal('3', 'update 3')

    it 'should update bidirectional bind', ->
      {a$} = bindings({a: 1})
      comp = new Tag('input', {value:a$}, [])
      comp.mount()
      expect(comp.node.value).to.equal "1"

    it 'should render tag 2', ->
      count = 1
      comp = p(txt(-> count))
      comp.mount()
      elm = comp.node
      expect(elm.innerHTML).to.equal '1'
      ++count
      dc.update()
      expect(elm.innerHTML).to.equal '2'
      ++count
      dc.update()
      expect(elm.innerHTML).to.equal '3'

    it 'should process text with bind', ->
      {a_, b_} = bindings({a: 1, b: 2})
      comp = p(txt(flow.add a_, b_))
      comp.mount('#demo')
      expect(comp.node.innerHTML).to.equal '3',  'mount'
      a_ 3; b_ 4
      expect(a_()).to.equal(3, 'a_')
      expect(b_()).to.equal(4, 'b_')
      dc.update()
      expect(comp.node.innerHTML).to.equal '7', 'update'

    it 'should process bidirectional bind', ->
      {a$} = bindings({a: 1})
      comp = text(a$)
      comp.mount('#demo')
      expect(comp.node.value).to.equal '1'
      comp.node.value = '2'
      comp.node.onchange()
      expect(a$()).to.equal '2'

    it 'should render div(2) component', ->
      comp = div(2)
      comp.mount()
      expect(comp.node.innerHTML).to.equal '2'

    it 'should execute component.unmount', ->
      comp = div(2)
      comp.mount()
      comp.unmount()

    it 'should execute component.remove', ->
      comp = div(1)
      comp.mount(newDemoNode('replace-demo3'))
      comp.remove()
      expect(document.getElementById('replace-demo3').innerHTML).to.equal('')

    it 'should execute component.remove child component', ->
      comp1 = div(comp3=(div(3)))
      comp1.mount(newDemoNode('replace-demo4'))
      comp3.remove()
      expect(document.getElementById('replace-demo4').innerHTML).to.equal('<div></div>')

    it 'should execute component.replace', ->
      comp1 = div(1)
      comp1.mount(newDemoNode('replace-demo'))
      comp2 = div(2)
      comp2.replace(comp1)
      expect(document.getElementById('replace-demo').innerHTML).to.equal('<div>2</div>')

    it 'should execute component.replace child component', ->
      comp1 = div(comp3=(div(3)))
      comp1.mount(newDemoNode('replace-demo2'))
      comp2 = div(2)
      comp2.replace(comp3)
      expect(document.getElementById('replace-demo2').innerHTML).to.equal('<div><div>2</div></div>')

    it 'p(->12) ', ->
      comp = p(->12)
      comp.mount()
      expect(comp.node.innerHTML).to.equal '12'
      dc.update()
      expect(comp.node.innerHTML).to.equal '12'
      dc.update()
      expect(comp.node.innerHTML).to.equal '12'
