###*test-virtual-tree
###

{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{
bindings,
Nothing
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
      baseComponent = comp.getBaseComponent()
      expect(baseComponent.isList).to.equal true
      expect(baseComponent.children.length).to.equal 2

    it 'should have correct children', ->
      comp = p(0)
      baseComponent = comp.getBaseComponent()
      expect(baseComponent.children.text).to.equal 0

  describe 'process getBaseComponent of Tag',  ->

    it 'should getBaseComponent of two tags', ->
      p1 = new Tag('p', Object.create(null), [])
      d = new Tag('div', Object.create(null), [p1])
      baseComponent = d.getBaseComponent()
      expect(baseComponent).to.equal d
      expect(baseComponent.children).to.be.instanceof Tag
      d.mount()
      baseComponent = d.getBaseComponent()
      expect(baseComponent.baseComponent).to.equal d

    it 'should process tag with nonempty child tag', ->
      d = new Tag('div',{}, [p1 = new Tag('p', {fakeProp: ->}, [])])
      d.mount()
      baseComponent = d.getBaseComponent()
      expect(baseComponent).to.equal d

    it 'should process tag with mulit level nonempty child tag', ->
      d = div(div(p1=p({fakeProp: ->})))
      d.mount()
      baseComponent = d.getBaseComponent()
      expect(baseComponent).to.equal d

    it 'should text.noop to be true', ->
      comp = txt(1)
      comp.mount()
      expect(comp.noop).to.equal true

  describe 'process creatDom',  ->
    it 'should creatDom of p(1)', ->
      comp = p(1)
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.innerHTML).to.equal '1'
      expect(baseComponent.noop).to.equal true

    it 'should creatDom of p(->1)', ->
      comp = p(-> 1)
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.getNode().innerHTML).to.equal '1'
      expect(!!baseComponent.noop).to.equal false

    it 'should creatDom of p(p(p(t=txt(->1))))', ->
      comp = p(p(p(t=txt(->1))))
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.innerHTML).to.equal '<p><p>1</p></p>'
      expect(!!baseComponent.noop).to.equal false

    it 'should createDom Text with text is  0', ->
      n = new Text(0)
      baseComponent = n.getBaseComponent()
      baseComponent.createDom()
      expect(n.node.textContent).to.equal '0'

    it 'should createDom tag',  ->
      p = new Tag('p', {}, [])
      baseComponent = p.getBaseComponent()
      baseComponent.createDom()
      expect(baseComponent.node.tagName).to.equal 'P'

    it 'should createDom  tag with attribute', ->
      p = new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [])
      baseComponent = p.getBaseComponent()
      baseComponent.createDom()
      expect(p.node.className).to.equal 'some class'
      expect(p.node.getAttribute('className')).to.equal null

    it 'process bind as value', ->
      comp = new Tag('input', {type:'text', value:  _a}, [new Text(_a)])
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.value).to.equal '1'

    it 'tag shoud createDom and calc prev/nextNodeCompnoent', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3)]) #
      expect(comp.children.children.length).to.equal 3
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(t1.nextNodeComponent).to.equal t2, 't1.nextNodeComponent'
      expect(t2.prevNodeComponent).to.equal t1, 't2.prevNodeComponent'
      expect(t2.nextNodeComponent).to.equal t3, 't2.nextNodeComponent'
      expect(t3.prevNodeComponent).to.equal t2, 't2.prevNodeComponent'
      expect(comp.node.childNodes.length).to.equal 3

    it 'tag shoud createDom and calc prev/nextNodeCompnoent with Nothing', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t4=new Nothing(), t3=new Text(3)]) #
      expect(comp.children.children.length).to.equal 4
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.childNodes.length).to.equal 3
      expect(t1.nextNodeComponent).to.equal t2, 't1.nextNodeComponent'
      expect(t2.prevNodeComponent).to.equal t1, 't2.prevNodeComponent'
      expect(t2.nextNodeComponent).to.equal t3, 't2.nextNodeComponent'
      expect(t3.prevNodeComponent).to.equal t2, 't2.prevNodeComponent'

    it 'should create  tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.getElementsByTagName('span').length).to.equal 1

    it 'should createDom tag 2', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.className).to.equal 'some class'

    it 'should createDom for tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')]), new Text(->)])
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.node.className).to.equal 'some class'

    it 'should createDom list with children', ->
      comp =  new List([new Tag('span',  {}, [new Text('adf')]), new Text(-> undefined)])
      baseComponent = comp.getBaseComponent()
      baseComponent.createDom()
      expect(comp.getNode()[0].tagName).to.equal 'SPAN'
