{expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper')

import {newDemoNode} from './helper'

{
bindings, see
Tag, Text, List, txt, list
p, div, Html, html
classFn, styleFrom,
Nothing

} = dc

{a_} = bindings({a: 1, b: 2})

describe "test-base-component", ->
  afterEach ->
    dc.reset()

  describe 'update BaseBlock', ->
    it 'should get BaseBlock of List', ->
      comp = list([1, 2])
      expect(comp.BaseBlock).to.equal comp

    it 'should have correct children', ->
      comp = p(0)
      expect(comp.children[0].text).to.equal 0

  describe 'process get BaseBlock of Tag',  ->

    it 'should get BaseBlock of two tags', ->
      p1 = new Tag('p', {}, [])
      d = new Tag('div', {}, [p1])
      expect(d.BaseBlock).to.equal d
      expect(d.children[0]).to.be.instanceof Tag
      expect(d.children[0]).to.equal(p1)
      d.mount()
      expect(d.BaseBlock.BaseBlock).to.equal d

    it 'should text.valid to be true', ->
      comp = txt(1)
      comp.mount()
      expect(!!comp.valid).to.equal true

  describe 'process creatDom',  ->
    it 'should creatDom of p(1)', ->
      comp = p(1)
      comp.mount() 
      expect(comp.node.innerHTML).to.equal '1'

    it 'should creatDom of p(->1)', ->
      comp = p(-> 1)
      comp.mount() 
      expect(comp.node.innerHTML).to.equal '1'

    it 'should creatDom of p(p(p(t=txt(->1))))', ->
      comp = p(p(p(t=txt(->1))))
      comp.mount() 
      expect(comp.node.innerHTML).to.equal '<p><p>1</p></p>'

    it 'should mount Text with text is 0', ->
      n = new Text(0)
      n.mount() 
      expect(n.node.textContent).to.equal '0'

    it 'should mount tag',  ->
      p = new Tag('p', {}, [])
      p.mount()
      expect(p.node.tagName).to.equal 'P'

    it 'should mount pre with property',  ->
      comp = new Tag('pre', {attr_space: ''}, [])
      comp.mount()
      expect(comp.node.tagName).to.equal 'PRE'
      expect(comp.node.getAttribute('space')).to.equal('')

    it 'should mount tag with attribute', ->
      p = new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [])
      p.mount() 
      expect(p.node.className).to.equal 'some class'
      expect(p.node.getAttribute('className')).to.equal null

    it 'process bind as value', ->
      comp = new Tag('input', {type:'text', value:  a_}, [new Text(a_)])
      comp.mount() 
      expect(comp.node.value).to.equal '1'

    it 'tag shoud mount with multiple children ', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3)]) #
      expect(comp.children.length).to.equal 3
      comp.mount() 
      expect(comp.node.childNodes.length).to.equal 3

    it 'tag shoud mount with Nothing child', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3), t4=new Nothing()]) #
      expect(comp.children.length).to.equal 4
      comp.mount() 
      expect(comp.node.childNodes.length).to.equal 3

    it 'should create tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.mount() 
      expect(comp.node.getElementsByTagName('span').length).to.equal 1

    it 'should mount tag 2', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.mount() 
      expect(comp.node.className).to.equal 'some class'

    it 'should mount for tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')]), new Text(->)])
      comp.mount() 
      expect(comp.node.className).to.equal 'some class'

    it 'should mount list with children', ->
      comp =  new List([new Tag('span',  {}, [new Text('adf')]), new Text(-> undefined)])
      comp.mount() 
      expect(comp.node[0].tagName).to.equal 'SPAN'

  describe 'process Html',  ->
    it 'should process Html.node.component', ->
      str = see ''
      comp = html(str)
      demoNode = newDemoNode()
      comp.mount(demoNode)
      expect(demoNode.innerHTML).to.equal '<div></div>'
      expect(comp.node.component).to.equal(comp)

    it 'should mount html component', ->
      comp = new Html(s='<div>1</div><p>2</p>')
      comp.mount(demoNode=newDemoNode())
      expect(demoNode.innerHTML).to.equal '<div><div>1</div><p>2</p></div>'

    it 'should mount html component with transform', ->
      comp = new Html(s='<div>1</div><p>2</p>', (text)-> text + 'a')
      comp.mount(demoNode=newDemoNode())
      expect(demoNode.innerHTML).to.equal '<div><div>1</div><p>2</p>a</div>'

    it 'should mount html component with reactive function', ->
      str = see '<div>1</div><p>2</p>'
      comp = new Html(str, (text) -> text + 'a')
      comp.mount(demoNode=newDemoNode())
      expect(demoNode.innerHTML).to.equal '<div><div>1</div><p>2</p>a</div>'
      str 'x'
      comp.render()
      expect(demoNode.innerHTML).to.equal '<div>xa</div>', 'update 1'
      comp.render()
      expect(demoNode.innerHTML).to.equal '<div>xa</div>', 'update 2'

    it 'should Html.bind', ->
      str = see ''
      comp = html(str)
      comp.mount(demoNode=newDemoNode())
      x = 1
      comp.bind('click', -> x = 2)
      comp.node.onclick({type:'click'})
      expect(x).to.equal(2)

    it 'should Html.text setter', ->
      str = see ''
      comp = html(str)
      comp.mount()
      comp.text = 'x'
      comp.render()
      expect(comp.node.innerHTML).to.equal 'x'