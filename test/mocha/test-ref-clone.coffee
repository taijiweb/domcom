{expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{see
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, each
clone
a, p, span, text, div} = dc

describe 'Component.refs, clone', ->
  afterEach ->
    dc.clear()

  describe 'refs', ->
    it 'should throw error while constucting conflicted component list(t, t))', ->
      t = txt(1)
      expect(-> list(t, t)).to.throw Error

    it 'should throw error while constucting conflicted component list(t, p(t)))', ->
      t = txt(1)
      expect(-> list(t, p(t))).to.throw Error

    it 'should throw error while conflicted component in list(p(t), if_(1, t, 0))', ->
      t = txt(1)
      #if_(1, t, 0) is converted to t for optimization
      expect(-> list(p(t), if_(1, t, 0))).to.throw Error

    it 'should throw error while conflicted component in list(p(t), if_(0, 2, t))', ->
      t = txt(1)
      #if_(0, 2, t)is converted to t for optimization
      expect(-> list(p(t), if_(0, 2, t))).to.throw Error

    it 'should throw error while conflicted component in list(p(t), if_(-> x, t, t))', ->
      t = txt(1)
      x = 0
      # if_(-> x, t, t) is converted to t for optimization
      expect(-> list(p(t), if_((-> x),  t, t))).to.throw Error

    it 'should throw error while conflicted component in list(p(t), if_(-> x, p(t), t))', ->
      t = txt(1)
      x = 0
      expect(-> list(p(t), if_((-> x),  p(t), t))).to.throw Error

    it 'should updateBaseComponent of if_((-> x), t=txt(1), t)', ->
      x = see 0
      comp = if_(x, t=txt(1), t)
      comp.mount()
      dc.update()

  describe 'Clone', ->
    it 'should not clone node event handler',  ->
      node = document.createElement('p')
      node.value = 1
      node.fakeProp = 2
      node.onclick = ->
      node2 = node.cloneNode()
      expect(node2.onclick).to.equal null
      expect(node2.value).to.equal undefined
      expect(node2.fakeProp).to.equal undefined

    it 'should clone TextNode',   ->
      node = document.createTextNode('afd')
      node.value = 1
      node.fakeProp = 2
      node.onclick = ->
      node2 = node.cloneNode()
      expect(node2.onclick).to.equal undefined
      expect(node2.textContent).to.equal 'afd'
      expect(node2.value).to.equal undefined
      expect(node2.fakeProp).to.equal undefined

    it 'should process text clone component ', ->
      comp = list(t1=txt(1), clone(t1))
      comp.mount('#demo')
      dc.update()
      expect(comp.node[1].textContent).to.equal '1'

    it 'should process tag clone component ', ->
      comp = list(c1=p(1), c2=clone(c1))
      comp.mount('#demo')
      dc.update()
      expect(comp.node[1].innerHTML).to.equal '1'

    it 'should process if_ clone component ', ->
      x = see 0
      lstComp = list(c1=p(2), c2=clone(c1))
      comp = if_(x, c1=p(3), lstComp)
      comp.mount('#demo')
      x 1
      dc.update()
      expect(comp.node.innerHTML).to.equal '3'
