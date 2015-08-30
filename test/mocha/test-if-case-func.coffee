{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, see
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, repeat
accordionGroup, accordion
a, p, span, text, div} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe 'if, case, func', ->

  describe 'If', ->
    it 'should getBaseComponent of if_(->x, txt(1), txt(2))', ->
      x = see 0
      comp = if_(x, txt(1), txt(2))
      comp.mount()
      expect(comp.node.textContent).to.equal '2'
      comp.update()
      expect(comp.node.textContent).to.equal '2'
      x 1
      comp.update()
      expect(comp.node.textContent).to.equal '1'
      x 0
      comp.update()
      expect(comp.node.textContent).to.equal '2'

    it 'should render If component', ->
      x = see 0
      comp = if_((-> x), div(1), div(2))
      comp.mount()
      expect(comp.node.innerHTML).to.equal '2'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '1'
      x 0
      comp.update()
      expect(comp.node.innerHTML).to.equal '2'

    it 'should create  and render  if', ->
      x = see 0
      comp = if_(x, p(1), p(2))
      expect(comp).to.be.instanceof TransformComponent
      comp.mount()
      expect(comp.node.tagName).to.equal 'P'
      expect(comp.node.innerHTML).to.equal '2'
      x 1
      comp.update()
      expect(comp.node.innerHTML).to.equal '1'

    it 'should create and update if_ with attrs',  ->
      x = see 0
      comp = if_({class:'main', fakeProp:-x}, x, c1=p(1), c2=p(2))
      expect(comp).to.be.instanceof Tag
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV'
      expect(comp.node.fakeProp).to.equal 0
      expect(comp.node.childNodes[0].innerHTML).to.equal '2'
      expect(comp.node.childNodes[0].tagName).to.equal 'P'
      x 1
      comp.update()
      expect(comp.node.fakeProp).to.equal 1
      expect(comp.node.childNodes[0].innerHTML).to.equal '1'
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
      expect(pIf.node.innerHTML).to.equal '1'
      expect(comp.node[0].innerHTML).to.equal '1'
      expect(demo2Node.innerHTML).to.equal '<p>1</p><p>3</p>'

    it 'should create and render embedded if', ->
      x = see 0
      comp = list(text(x), c0=if_(x, c1=div(1), c2=div(2)))
      comp.mount()
      expect(comp.mountNode).to.equal document.body
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
      comp = list(t1=text({onchange: -> x = parseInt(@value); comp.update()}, x), pIf=if_((->x), div(1), div(2)))
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
      comp = list(t1=text(x), pIf=if_((->x), div(1), div(2)))
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
      expect(comp.node.innerHTML).to.equal '2'
      a 3
      comp.update()
      a 4
      comp.update()
      expect(comp.node.innerHTML).to.equal '4'

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

