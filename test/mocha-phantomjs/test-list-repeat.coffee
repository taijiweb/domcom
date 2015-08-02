{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, repeat
accordionGroup, accordion
a, p, span, text, div} = require('domcom/src/index')

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe 'list, repeat', ->
  describe 'List', ->
    it 'all of item in list should be  component', ->
      comp = list([1, 2])
      expect(comp.children[0]).to.be.an.instanceof(Component)

    it 'should create list component', ->
      comp =  list([span(['adf'])])
      comp.mount()
      expect(comp.node.tagName).to.equal 'SPAN'

    it 'component list should have length', ->
      lst = list([1, 2])
      expect(lst.children.length).to.equal 2

    it 'list can be constructructed  from mulitple argumnents', ->
      lst = list(1, 2)
      expect(lst.children.length).to.equal 2

    it 'should create list', ->
      lst = list(1, 2)
      lst.mount()
      expect(lst.node[0].textContent).to.equal '1'
      expect(lst.node[1].textContent).to.equal '2'

    it 'should create list with attrs', ->
      x = 2
      comp = list({class:'main', fakeProp:-> x}, 1, txt(->x))
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV'
      expect(comp.node.childNodes[0].textContent).to.equal '1'
      expect(comp.node.childNodes[1].textContent).to.equal '2'
      x = 3
      comp.update()
      expect(comp.node.fakeProp).to.equal 3
      expect(comp.node.childNodes[1].textContent).to.equal '3'

  describe 'Repeat', ->
    it  'should create  repeat component', ->
      comp = repeat(lst = ['repeat', 'simple'], (item, i) -> p(item))
      comp.mount()
      expect(comp.node).to.be.instanceof Array
      #expect(comp.node[0]).to.be.instanceof Element

    it 'should mount and render repeat  component',  ->
      document.getElementById('demo').innerHTML = ''
      comp = repeat(lst = ['repeat', 'simple'], (item, i) -> p(item))
      comp.mount("#demo")
      expect(comp.node[0].innerHTML).to.equal 'repeat'
      expect(comp.node[1].innerHTML).to.equal 'simple'
      lst[0] = 3; lst[1] = 4
      comp.update()
      expect(comp.node[0].innerHTML).to.equal '3'
      expect(comp.node[1].innerHTML).to.equal '4'
      lst[2] = 5
      comp.update()
      expect(comp.node[2].innerHTML).to.equal '5'
      lst.length = 0
      comp.update()
      # List Component never be empty, if length is 0, then generate txt('')
      expect(comp.node.length).to.equal 1

    it 'should process immutable template in repeat component', ->
      document.getElementById('demo').innerHTML = ''
      comp = repeat(lst = [{text:'a'}, {text:'b'}], ((item, i) -> p(txt(-> item.text))), {itemTemplateImmutable:true})
      comp.mount("#demo")
      expect(comp.node[0].textContent).to.equal 'a'
      expect(comp.node[1].textContent).to.equal 'b'
      lst[0].text = 'c'; lst[1].text = 'd'
      comp.update()
      expect(comp.node[0].textContent).to.equal 'c'
      expect(comp.node[1].textContent).to.equal 'd'
      lst[2] = {text: 'e'}
      comp.update()
      expect(comp.node[2].textContent).to.equal 'e'
      lst.length = 0
      comp.update()
      # List Component never be empty, if length is 0, then generate txt('')
      expect(comp.node.length).to.equal 1

    it 'should process itemTemplateImmutable repeat component ', ->
      comp = repeat(lst = ['a', 'b'], ((item, i, list) -> p(txt(-> list[i]))), {itemTemplateImmutable:true})
      comp.mount()
      lst[0] = 'c'
      comp.update()
      expect(comp.node[0].textContent).to.equal 'c'

    it 'should process tag with repeat', ->
      x = 1
      text1 = null
      comp = new Tag('div', {}, [repeat1=repeat([1], (item) -> text1 = txt(x))])
      comp.create()
      x = 2
      comp.update()
      expect(repeat1.node.parentNode).to.equal(comp.node)
      expect(text1.node.textContent).to.equal('2')
      expect(repeat1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '2'

    it  'should create and update deeper embedded repeat', ->
      x = 1
      comp =  div({}, span1=new Tag('span', {}, [repeat1=repeat((-> [x]), (item) -> txt(item))]))
      comp.mount()
      expect(repeat1.node.parentNode).to.equal(span1.node)
      expect(repeat1.node[0].textContent).to.equal '1'
      x = 2
      comp.update()
      expect(repeat1.node.parentNode).to.equal(span1.node)
      expect(repeat1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<span>2</span>'

    it  'should create and update embedded repeat in 3 layer', ->
      x = 1
      comp =  div({}, div({}, span1=new Tag('span', {}, [repeat1=repeat([1], (item) -> txt(x))])))
      comp.mount()
      expect(repeat1.node.parentNode).to.equal(span1.node)
      expect(repeat1.node[0].textContent).to.equal '1'
      x = 2
      comp.update()
      expect(repeat1.node.parentNode).to.equal(span1.node)
      expect(repeat1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<div><span>2</span></div>'

    it  'should create and update embedded repeat in 3  layer', ->
      x = 1
      comp =  div({}, div({}, span1=new Tag('span', {}, [repeat1=repeat((-> [x]), (item) -> txt(item))])))
      comp.mount()
      expect(repeat1.node.parentNode).to.equal(span1.node)
      expect(repeat1.node[0].textContent).to.equal '1'
      x = 2
      comp.update()
      expect(repeat1.node.parentNode).to.equal(span1.node)
      expect(repeat1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<div><span>2</span></div>'

    it  'should process repeat under repeat', ->
      x = 1
      repeat2 = null
      comp =  div({}, repeat1=repeat([1], -> repeat2=repeat((-> [x]), (item) -> item)))
      comp.mount()
      expect(repeat1.node.parentNode).to.equal(comp.node)
      expect(repeat2.node[0].textContent).to.equal '1'
      x = 2
      comp.update()
      expect(repeat1.node.parentNode).to.equal(comp.node)
      expect(repeat2.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '2'