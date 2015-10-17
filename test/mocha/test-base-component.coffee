###*test-virtual-tree
###

{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{
bindings,
Tag, Text, List, txt, list
p, div,
classFn, styleFrom,
Nothing
} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe "test base component", ->
  describe 'getBaseComponent', ->
    it 'should have getBaseComponent of List', ->
      comp = list([1, 2])
      expect(comp.baseComponent).to.equal comp

    it 'should have correct children', ->
      comp = p(0)
      expect(comp.children[0].text).to.equal 0

  describe 'process getBaseComponent of Tag',  ->

    it 'should getBaseComponent of two tags', ->
      p1 = new Tag('p', Object.create(null), [])
      d = new Tag('div', Object.create(null), [p1])
      expect(d.baseComponent).to.equal d
      expect(d.children[0]).to.be.instanceof Tag
      d.mount()
      expect(d.baseComponent.baseComponent).to.equal d

    it 'should text.valid to be true', ->
      comp = txt(1)
      comp.mount()
      expect(!!comp.valid).to.equal true

  describe 'process creatDom',  ->
    it 'should creatDom of p(1)', ->
      comp = p(1)
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.innerHTML).to.equal '1'

    it 'should creatDom of p(->1)', ->
      comp = p(-> 1)
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.innerHTML).to.equal '1'

    it 'should creatDom of p(p(p(t=txt(->1))))', ->
      comp = p(p(p(t=txt(->1))))
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.innerHTML).to.equal '<p><p>1</p></p>'

    it 'should mount Text with text is 0', ->
      n = new Text(0)
      n.mount() # just for convienence in tests by using baseComponent itself as options
      expect(n.node.textContent).to.equal '0'

    it 'should mount tag',  ->
      p = new Tag('p', {}, [])
      p.mount() # just for convienence in tests by using baseComponent itself as options
      expect(p.node.tagName).to.equal 'P'

    it 'should mount  tag with attribute', ->
      p = new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [])
      p.mount() # just for convienence in tests by using baseComponent itself as options
      expect(p.node.className).to.equal 'some class'
      expect(p.node.getAttribute('className')).to.equal null

    it 'process bind as value', ->
      comp = new Tag('input', {type:'text', value:  _a}, [new Text(_a)])
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.value).to.equal '1'

    it 'tag shoud mount with multiple children ', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3)]) #
      expect(comp.children.length).to.equal 3
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.childNodes.length).to.equal 3

    it 'tag shoud mount with Nothing child', ->
      comp = new Tag('p', {}, [t1=new Text(1), t2=new Text(2), t3=new Text(3), t4=new Nothing()]) #
      expect(comp.children.length).to.equal 4
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.childNodes.length).to.equal 3

    it 'should create tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.getElementsByTagName('span').length).to.equal 1

    it 'should mount tag 2', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')])])
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.className).to.equal 'some class'

    it 'should mount for tag with children', ->
      comp =  new Tag('p', {className:classFn('some class'), style:styleFrom("width:1px;")}, [new Tag('span', {}, [new Text('adf')]), new Text(->)])
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node.className).to.equal 'some class'

    it 'should mount list with children', ->
      comp =  new List([new Tag('span',  {}, [new Text('adf')]), new Text(-> undefined)])
      comp.mount() # just for convienence in tests by using baseComponent itself as options
      expect(comp.node[0].tagName).to.equal 'SPAN'
