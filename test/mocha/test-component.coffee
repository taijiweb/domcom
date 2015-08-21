{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, bibind
classFn, styleFrom
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe "component  ", ->
  describe 'construct component', ->
    it 'component shoud have children', ->
      comp = p(Object.create(null), [1, 2])
      expect(comp.children.children.length).to.equal 2

    it 'should construct component', ->
      p1 = new Tag('p', {}, [])
      d = new Tag('div', {}, [p1])
      expect(d.children.children[0]).to.equal p1

    it 'tag shoud have children 1', ->
      comp = new Tag('span', {}, [new Text('adf')])
      expect(comp.children.children.length).to.equal 1

    it 'tag shoud have children 2', ->
      span1 = new Tag('span', {}, [new Text('adf')])
      comp = new Tag('div', {className:classFn('some class'), style:styleFrom("width:1px;")}, [span1])
      expect(comp.children.children[0]).to.equal span1

  describe 'component.append', ->
    # Now components have the api for appending, etc...
    nit 'should append tag.children', ->
      d = div()
      p1 = p()
      d.append(p1)
      expect(d.children).to.equal p1

  describe 'component.create', ->
    it 'should create tag', ->
      comp = p()
      comp.mount()
      expect(comp.node.tagName).to.equal 'P'
      expect(comp.node.innerHTML).to.equal ''

    it 'should mount tag 1',  ->
      comp = new Tag('div', Object.create(null), [])
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
      comp.children.children[0].node.onclick()
      expect(spy.called).to.equal true

    it 'should create tag with attribute', ->
      comp = p({className:'some class', style:"width:1px;"}, [])
      comp.mount()
      elm = comp.node
      expect(elm.className).to.equal 'some class'
      expect(elm.getAttribute('className')).to.equal null

    it 'should process function value of text', ->
      {_a} = bindings({a: 1})
      comp = text(_a)
      elm = comp.mount()
      elm = comp.node
      expect(elm.value).to.equal '1'

    it 'component shoud have children 2', ->
      comp = span('adf')
      expect(comp.children.children.length).to.equal 1

    it 'should create tag with children', ->
      comp =  p({className:'some class', style:"width:1px;"}, span1=span(['adf']))
      expect(comp.children.children[0]).to.equal span1
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
      comp.update()
      expect(comp.node.innerHTML).to.equal '2'
      ++count
      comp.update()
      expect(comp.node.innerHTML).to.equal '3'

    it 'should process bidirectional bind', ->
      comp = new Tag('input', {value:$a}, [])
      comp.mount()
      expect(comp.node.value).to.equal "1"

    it 'should render tag 2', ->
      count = 1
      comp = p(txt(-> count))
      comp.mount()
      elm = comp.node
      expect(elm.innerHTML).to.equal '1'
      ++count
      comp.update()
      expect(elm.innerHTML).to.equal '2'
      ++count
      comp.update()
      expect(elm.innerHTML).to.equal '3'

    it 'should process bidirectional bind', ->
      {$a} = bindings({a: 1})
      comp = text($a)
      comp.mount('#demo')
      expect(comp.node.value).to.equal '1'
      comp.node.value = '2'
      comp.node.onchange()
      expect($a()).to.equal '2'

    it 'should render div(2) component', ->
      comp = div(2)
      comp.mount()
      expect(comp.node.innerHTML).to.equal '2'

    it 'should execute component.remove', ->
      comp = div(2)
      comp.mount()
      comp.remove()

  describe 'list', ->
    it 'list(txt(->12))', ->
      comp = list(txt(->12))
      comp.mount()
      comp.update()
      comp.update()
      comp.update()
      expect(comp.node.textContent).to.equal '12'

    it 'list(p(txt(->12))) ', ->
      comp = list(p(txt(->12)))
      comp.mount()
      comp.update()
      comp.update()
      comp.update()
      expect(comp.node.innerHTML).to.equal '12'

    it 'list(p(->12)) ', ->
      comp = list(p(->12))
      comp.mount()
      comp.update()
      comp.update()
      expect(comp.node.innerHTML).to.equal '12'

    it 'p(->12) ', ->
      comp = p(->12)
      comp.mount()
      expect(comp.node.innerHTML).to.equal '12'
      comp.update()
      expect(comp.node.innerHTML).to.equal '12'
      comp.update()
      expect(comp.node.innerHTML).to.equal '12'

    it 'func(->12) ', ->
      comp = func(->12)
      comp.mount()
      expect(comp.node.textContent).to.equal '12'
      comp.update()
      expect(comp.node.textContent).to.equal '12'
      comp.update()
      expect(comp.node.textContent).to.equal '12'

  describe 'demo', ->
    describe 'test for sum', ->
      it 'should construct and create components', ->
        {$a, $b, _a, _b} = bindings({a: 1, b: 2})
        x = text($a); y = text($b); z = p(txt(-> _a()+_b()))
        comp = list(x, y, z)
        comp.mount('#demo')
        expect(z.node.innerHTML).to.equal '3'
        x.node.value = '3'
        y.node.value = '4'
        x.node.onchange()
        y.node.onchange()
        comp.update()
        expect(z.node.innerHTML).to.equal '34'

    describe 'test for todomvc', ->
      it 'should construct and create components', ->
        comp = li(a({className:{selected: 1}, href:"#/"}, "All"))
        comp.mount('#demo')

    describe 'test for combobox', ->
      it 'should process event property of child component', ->
        x = 0
        comp = div({}, c0=input({ onmouseenter: -> x = 1}), div({}, 'wawa'))
        comp.mount()
        c0.node.onmouseenter()
        expect(x).to.equal 1

      it 'should process event property of child component with model directive', ->
        x = 0
        comp = div({}, c0=input({ $model:bibind({}, 'x'), onmouseenter: -> x = 1}), div({}, 'wawa'))
        comp.mount()
        c0.node.onmouseenter()
        expect(x).to.equal 1
