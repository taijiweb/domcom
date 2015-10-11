{expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('./helper')

{bindings, see, flow
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, each
accordionGroup, accordion
a, p, span, text, div} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe 'if, case, func', ->

  describe 'If', ->
    it 'should optimize if_', ->
      t = txt(1)
      x = 0
      expect(if_((-> x),  t, t)).to.equal t
      expect(if_(0, 1, t)).to.equal t
      expect(if_(1, t, 0)).to.equal t

    it 'should compute if_((-> x), p(t), t).family', ->
      t = txt(1)
      x = 0
      expect(if_((-> x),  p(t), t).family[t.dcid]).to.equal true

    it 'should construct if_(x, p(t1), list(p(t2), t1))', ->
      x = see 0
      t1 = txt 1; t2 = txt 2
      comp = if_(x, p(t1), list(t2, p(t1)))

    it 'should render if_(see something, txt(1), txt(2))', ->
      x = see 0
      comp = if_(x, txt(1), txt(2))
      comp.mount()
      expect(comp.node.textContent).to.equal '2', 'mount'
      comp.update()
      expect(comp.node.textContent).to.equal '2', 'update'
      x 1
      comp.update()
      expect(comp.node.textContent).to.equal '1', 'update x 1'
      x 0
      comp.update()
      expect(comp.node.textContent).to.equal '2', 'update x 0'

    it 'should render if_(x, list(t1, t2), list(t2, t1))', ->
      x = see 0
      t1 = txt 1; t2 = txt 2
      comp = if_(x, list(t1, t2), list(t2, t1))
      comp.mount()
      expect(comp.node[0].textContent).to.equal '2', 'mount'
      comp.update()
      expect(comp.node[0].textContent).to.equal '2', 'update'
      x 1
      comp.update()
      expect(comp.node[0].textContent).to.equal '1', 'update x 1'

    it 'should render if_(x, t1, list(t2, t1))', ->
      x = see 0
      t1 = txt 1; t2 = txt 2
      comp = if_(x, t1, lst=list(t2, t1))
      comp.mount(demoNode=newDemoNode('if-ref'))
      expect(demoNode.innerHTML).to.equal '21', 'mount'
      comp.update()
      expect(demoNode.innerHTML).to.equal '21', 'update'
      x 1
      comp.update()
      expect(demoNode.innerHTML).to.equal '1', 'update x 1'
      x 0
      comp.update()
      expect(demoNode.innerHTML).to.equal '21', 'update x 0'

    it 'should render if_(x, p(t1), list(p(t2), t1))', ->
      x = see 0
      t1 = txt 1; t2 = txt 2
      comp = if_(x, p1=p(t1), list(p(t2), t1))
      comp.mount(demoNode=newDemoNode('if-ref'))
      expect(demoNode.innerHTML).to.equal '<p>2</p>1', 'mount'
      x 1
      comp.update()
      expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1'
      x 0
      comp.update()
      expect(demoNode.innerHTML).to.equal '<p>2</p>1', 'update x 0'
      x 1
      comp.update()
      expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1 again'

    it 'should render if_(x, p(t1), div(t2))', ->
      x = see 0
      t1 = txt 1
      comp = if_(x, p(t1), div(t1))
      comp.mount(demoNode=newDemoNode('if-ref'))
      expect(demoNode.innerHTML).to.equal '<div>1</div>', 'mount'
      x 1
      comp.update()
      expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1'
      x 0
      comp.update()
      expect(demoNode.innerHTML).to.equal '<div>1</div>', 'update x 0'
      x 1
      comp.update()
      expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1 again'

    it 'should render p(if_(x, p(t1), list(p(t2), t1)))', ->
      x = see 0
      t1 = txt 1; t2 = txt 2
      comp = p(if1=if_(x, p1=p(t1), list(p(t2), t1)))
      comp.mount()
      expect(comp.node.innerHTML).to.equal '<p>2</p>1', 'mount'
      comp.update()
      expect(comp.node.innerHTML).to.equal '<p>2</p>1', 'update'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '<p>1</p>', 'update x 1'
      x 0
      comp.update()
      expect(comp.node.innerHTML).to.equal '<p>2</p>1', 'update x 0'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '<p>1</p>', 'update x 1 again'

    it 'should render if_(x, p(t1), p list(p(t2), t1))', ->
      x = see 0
      t1 = txt 1; t2 = txt 2
      comp = if_(x, p1=p(t1), p2=p(list(p(t2), t1)))
      comp.mount()
      expect(p2.node.innerHTML).to.equal '<p>2</p>1', 'mount'
      x 1
      comp.render()
      expect(comp.node.innerHTML).to.equal '1', 'update x 1'
      x 0
      comp.render()
      expect(p2.node.innerHTML).to.equal '<p>2</p>1', 'mount'

    it 'should render if_(x, div(1), div(2))', ->
      x = see 0
      comp = if_(x, div(1), div(2))
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV', 'tagName'
      expect(comp.node.innerHTML).to.equal '2', 'mount'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '1', 'first update'
      x 0
      comp.update()
      expect(comp.node.innerHTML).to.equal '2', 'second update'

    it 'should create and update if_ with attrs',  ->
      x = see 0
      comp = if_({class:'main', fakeProp:x}, x, c1=p(1), c2=p(2))
      expect(comp).to.be.instanceof Tag
      expect(comp.hasActiveProperties).to.equal true, 'hasActiveProperties before mounting'
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV'
      expect(comp.node.fakeProp).to.equal 0, 'mount fakeProp'
      expect(comp.node.childNodes[0].innerHTML).to.equal '2', 'mount innerHTML'
      expect(comp.node.childNodes[0].tagName).to.equal 'P', 'mount C1 tagName'
      expect(comp.hasActiveProperties).to.equal false, 'hasActiveProperties after mounting'
      x 1
      expect(comp.props.fakeProp).to.equal x, 'see invalidate fakeProp'
      expect(comp.hasActiveProperties).to.equal true, 'hasActiveProperties'
      comp.update()
      expect(comp.node.fakeProp).to.equal 1, 'update fakeProp'
      expect(comp.node.childNodes[0].innerHTML).to.equal '1', 'update innerHTML'
      expect(comp.node.childNodes[0]).to.equal c1.node

    it 'should create and render if followed by other node ', ->
      demo2Node = document.getElementById('demo2')
      demo2Node.innerHTML = ''
      x = see 0
      comp = list(pIf=if_(x, p1=p(1), p2=p(2)), p3=p(3))
      comp.mount(demo2Node)
      expect(pIf.node.innerHTML).to.equal '2'
      expect(demo2Node.innerHTML).to.equal '<p>2</p><p>3</p>'
      x 1
      comp.update()
      expect(pIf.node.innerHTML).to.equal '1' , 'pif update'
      expect(demo2Node.innerHTML).to.equal '<p>1</p><p>3</p>', 'demo2Node update'
      expect(comp.node[0].innerHTML).to.equal '1', 'comp update'

    it 'should create and render embedded if', ->
      x = see 0
      comp = list(text(x), c0=if_(x, c1=div(1), c2=div(2)))
      comp.mount()
      expect(comp.parentNode).to.equal document.body
      expect(comp.node[1].innerHTML).to.equal '2'
      expect(c0.parentNode).to.equal comp.parentNode
      x 1
      comp.update()
      expect(c0.parentNode).to.equal comp.parentNode
      expect(c0.node.innerHTML).to.equal '1'
      expect(c2.node.innerHTML).to.equal '2'
      expect(c0.node).to.equal c1.node
      expect(comp.node[1]).to.equal c1.node

    it 'should process event in embedded if 2', ->
      x = see 0
      comp = list(t1=text({onchange: -> x parseInt(@value); comp.update()}, x), pIf=if_(x, div(1), div(2)))
      comp.mount()
      expect(pIf.node.innerHTML).to.equal '2'
      t1.node.value = 1
      t1.node.onchange()
      expect(pIf.node.innerHTML).to.equal '1'
      t1.node.value = 0
      t1.node.onchange()
      expect(pIf.node.innerHTML).to.equal '2'

    it 'should process embedded if 2', ->
      x = see 0
      comp = list(t1=text(x), pIf=if_(x, div(1), div(2)))
      comp.mount()
      expect(pIf.node.innerHTML).to.equal '2'
      x 1
      comp.update()
      expect(pIf.node.innerHTML).to.equal '1'
      x 0
      comp.update()
      expect(pIf.node.innerHTML).to.equal '2'

  describe 'Case', ->
    it 'should create and render case_', ->
      x = see 0
      comp = case_(x, {1:p(1), 2:p(2), 3:p(3)}, 'others')
      comp.mount()
      expect(comp.node).to.be.instanceof window.Text
      expect(comp.node.textContent).to.equal 'others'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '1'

  describe 'Func', ->
    it 'func(->12) ', ->
      comp = func(->12)
      comp.mount()
      expect(comp.node.textContent).to.equal '12'
      comp.update()
      expect(comp.node.textContent).to.equal '12'
      comp.update()
      expect(comp.node.textContent).to.equal '12'

    it 'p(-> a))', ->
      a = see 1
      comp = p(a)
      comp.mount()
      a 2
      comp.update()
      expect(comp.node.innerHTML).to.equal '2', 'update a 2'
      a 3
      comp.update()
      a 4
      comp.update()
      expect(comp.node.innerHTML).to.equal '4', 'update a 4'

    it 'should  create func component',  ->
      x = see 1
      comp = func(x)
      comp.mount()
      expect(comp.node).to.be.instanceof(window.Text)
      expect(comp.node.textContent).to.equal('1')

    it 'should create and  render func', ->
      x = see 0
      comp = func(flow(x, -> {1:p(1), 2:p(2), 3:p(3)}[x()] or  'others'))
      comp.mount()
      expect(comp.node).to.be.instanceof window.Text
      expect(comp.node.textContent).to.equal 'others'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '1'
      x 2
      comp.update()
      expect(comp.node.innerHTML).to.equal '2'

    it 'should create and update func with  attrs',  ->
      x = see 1
      comp = func({class:'main', fakeProp:x}, x)
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV'
      expect(comp.node.fakeProp).to.equal 1
      expect(comp.node).to.be.instanceof(Element)
      expect(comp.node.childNodes[0].textContent).to.equal('1')
      x 2
      comp.update()
      expect(comp.node.fakeProp).to.equal 2
      expect(comp.node.childNodes[0].textContent).to.equal '2'

    it 'should process tag with function', ->
      comp = p( txt(-> 1))
      expect(comp.children).to.be.instanceof Text
      comp.mount()
      expect(comp.node.innerHTML).to.equal '1'

