###*test-virtual-tree
###

{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{
bindings,
Tag, Text, List, txt, list
p, div,
classFn, styleFrom,
VirtualNode
} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe "test base component", ->
  describe 'getBaseComponent', ->
    it 'should have getBaseComponent of List', ->
      comp = list([1, 2])
      expect(comp.baseComponent).to.equal comp

    it 'should have correct children', ->
      comp = p(0)
      expect(comp.baseComponent.children.text).to.equal 0

  describe 'process getBaseComponent of Tag',  ->

    it 'should getBaseComponent of two tags', ->
      p1 = new Tag('p', Object.create(null), [])
      d = new Tag('div', Object.create(null), [p1])
      expect(d.baseComponent).to.equal d
      expect(d.baseComponent.children).to.be.instanceof Tag
      d.mount()
      expect(d.baseComponent.baseComponent).to.equal d

    it 'should text.noop to be true', ->
      comp = txt(1)
      comp.mount()
      expect(!!comp.valid).to.equal true

  describe 'process creatDom',  ->
    it 'should creatDom of p(1)', ->
      comp = p(1)
      comp.createDom()
      expect(comp.node.innerHTML).to.equal '1'
      expect(comp.baseComponent.valid).to.equal true

    it 'should creatDom of p(->1)', ->
      comp = p(-> 1)
      comp.createDom()
      expect(comp.node.innerHTML).to.equal '1'
      expect(!!baseComponent.noop).to.equal false

    it 'should creatDom of p(p(p(t=txt(->1))))', ->
      comp = p(p(p(t=txt(->1))))
      comp.createDom()
      expect(comp.node.innerHTML).to.equal '<p><p>1</p></p>'
      expect(!!baseComponent.noop).to.equal false

    it 'should createDom Text with text is  0', ->
      n = new Text(0)
      n.createDom()
      expect(n.node.textContent).to.equal '0'

    it 'should createDom tag',  ->
      p = new Tag('p', {}, [])
      p.createDom()
      expect(p.node.tagName).to.equal 'P'

    it 'should createDom  tag with attribute', ->
      p = new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [])
      p.createDom()
      expect(p.node.className).to.equal 'some class'
      expect(p.node.getAttribute('className')).to.equal null

    it 'process bind as value', ->
      comp = new Tag('input', {type:'text', value:  _a}, [new Text(_a)])
      comp.createDom()
      expect(comp.node.value).to.equal '1'

    it 'tag shoud createDom and calc prev/nextNodeCompnoent', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3)]) #
      expect(comp.children.children.length).to.equal 3
      comp.createDom()
      expect(comp.node.childNodes.length).to.equal 3

    it 'tag shoud createDom and calc prev/nextNodeCompnoent with empty Text', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3), t4=new Text('')]) #
      expect(comp.children.children.length).to.equal 4
      comp.createDom()
      expect(comp.node.childNodes.length).to.equal 4

    it 'should create  tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.createDom()
      expect(comp.node.getElementsByTagName('span').length).to.equal 1

    it 'should createDom tag 2', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.createDom()
      expect(comp.node.className).to.equal 'some class'

    it 'should createDom for tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')]), new Text(->)])
      comp.createDom()
      expect(comp.node.className).to.equal 'some class'

    it 'should createDom list with children', ->
      comp =  new List([new Tag('span',  {}, [new Text('adf')]), new Text(-> undefined)])
      comp.createDom()
      expect(comp.node[0].tagName).to.equal 'SPAN'
