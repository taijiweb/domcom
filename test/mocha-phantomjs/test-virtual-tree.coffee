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

describe "test virtual  tree ", ->
  describe 'initVirtualTree', ->
    it 'should have getVirtualTree of List', ->
      comp = list([1, 2])
      vtree = comp.getVirtualTree()
      expect(vtree.baseComponent.isList).to.equal true
      expect(vtree.children.length).to.equal 2

    it 'should have correct children', ->
      comp = p(0)
      vtree = comp.getVirtualTree()
      expect(vtree.children.baseComponent.isList).to.equal true
      expect(vtree.children.children.length).to.equal 1

  describe 'process getVirtualTree of Tag',  ->

    it 'should getVirtualTree of two tags', ->
      p1 = new Tag('p', Object.create(null), [])
      d = new Tag('div', Object.create(null), [p1])
      vtree = d.getVirtualTree()
      expect(vtree.baseComponent).to.equal d
      expect(vtree.children.children.length).to.equal 1
      expect(VirtualNode.vtreeMap[vtree.children.children[0]].baseComponent).to.equal p1
      d.vtree = null # otherwise d.mount() will do d.update(), not d.create()
      d.mount()
      vtree = d.getVirtualTree()

    it 'should process tag with  nonempty child tag ', ->
      d = new Tag('div',{}, [p1 = new Tag('p', {fakeProp: ->}, [])])
      d.mount()
      vtree = d.getVirtualTree()
      expect(vtree.baseComponent).to.equal d

    it 'should process tag with mulit level nonempty child tag', ->
      d = div(div(p1=p({fakeProp: ->})))
      d.mount()
      vtree = d.getVirtualTree()
      expect(vtree.baseComponent).to.equal d

    it 'should set Text.vtree to VirtualNoop', ->
      comp = txt(1)
      comp.mount()
      expect(comp.vtree.isNoop).to.equal true

  describe 'process   creatDom',  ->
    it 'should creatDom of p(1)', ->
      comp = p(1)
      vtree = comp.getVirtualTree()
      vtree.createDom()
      expect(comp.node.innerHTML).to.equal '1'
      expect(comp.vtree.isNoop).to.equal true

    it 'should creatDom of p(->1)', ->
      comp = p(-> 1)
      vtree = comp.getVirtualTree()
      vtree.createDom()
      expect(comp.node.innerHTML).to.equal '1'
      expect(comp.vtree.isNoop).to.equal false

    it 'should creatDom of p(p(p(t=txt(->1))))', ->
      comp = p(p(p(t=txt(->1))))
      vtree = comp.getVirtualTree()
      vtree.createDom()
      expect(comp.node.innerHTML).to.equal '<p><p>1</p></p>'
      expect(comp.vtree.isNoop).to.equal false
      expect(comp.vtree.isPlaceHolder).to.equal true
      expect(comp.vtree.children.children[0]).to.equal t.vtree.vtreeId

    it 'should createDom Text with text is  0', ->
      n = new Text(0)
      n.getVirtualTree()
      n.vtree.createDom()
      expect(n.node.textContent).to.equal '0'

    it 'should createDom tag',  ->
      p = new Tag('p', {}, [])
      p.getVirtualTree()
      p.vtree.createDom()
      expect(p.vtree.node.tagName).to.equal 'P'

    it 'should createDom  tag with attribute', ->
      p = new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [])
      p.init()
      p.getVirtualTree()
      p.vtree.createDom()
      expect(p.node.className).to.equal 'some class'
      expect(p.node.getAttribute('className')).to.equal null

    it 'process sibind as value', ->
      comp = new Tag('input', {type:'text', value:  _a}, [new Text(_a)])
      comp.init()
      comp.getVirtualTree()
      comp.vtree.createDom()
      expect(comp.node.value).to.equal '1'

    it 'tag shoud have children', ->
      comp = new Tag('p', {}, [new Text(1), new Text(2)])
      comp.init()
      expect(comp.children.children.length).to.equal 2
      comp.getVirtualTree()
      comp.vtree.createDom()
      expect(comp.node.childNodes.length).to.equal 2

    it 'should create  tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.init()
      comp.getVirtualTree()
      comp.vtree.createDom()
      expect(comp.node.getElementsByTagName('span').length).to.equal 1

    it 'should createDom tag 2', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.init()
      comp.getVirtualTree()
      comp.vtree.createDom()
      expect(comp.node.className).to.equal 'some class'

    it 'should createDom for tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')]), new Text(->)])
      comp.init()
      comp.getVirtualTree()
      comp.vtree.createDom()
      expect(comp.node.className).to.equal 'some class'

    it 'should createDom list with  children', ->
      comp =  new List([new Tag('span',  {}, [new Text('adf')]), new Text(-> undefined)])
      comp.init()
      comp.getVirtualTree()
      comp.vtree.createDom()
      expect(comp.node[0].tagName).to.equal 'SPAN'
