{expect, iit, idescribe, nit, ndescribe, ddescribe} = require 'bdd-test-helper'

{see
Component, TranBlock, Tag, Text,
txt, list, func, if_, case_, func, each
a, p, span, text, div
flow} = dc

describe 'Component.refs, clone', ->
  afterEach ->
    dc.reset()

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
      comp.render()

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

    it 'should process text clone component bind', ->
      comp = list(t1=txt(1), t1.clone())
      comp.mount('#demo')
      comp.render()
      expect(comp.node[1].textContent).to.equal '1'

    it 'should process text clone component with bind', ->
      t1 = txt(flow.thisBind('x'))
      t2 = t1.clone()
      t1.x = 1
      t2.x = 2
      t1.mount('#demo')
      t2.mount('#demo')
      expect(t1.node.textContent).to.equal '1'
      expect(t2.node.textContent).to.equal '2'
      t2.x = 3
      t2.render()
      expect(t2.node.textContent).to.equal('3', 3)

    it 'should process mount cloned tag ', ->
      c1 = p(1)
      comp = c1.clone()
      comp.mount('#demo')
      comp.render()
      expect(comp.node.innerHTML).to.equal '1'

    it 'should process tag clone component ', ->
      c1 = p(1)
      c2 = c1.clone()
      comp = list(c1, c2)
      comp.mount('#demo')
      comp.render()
      expect(comp.node[1].innerHTML).to.equal '1'

    it 'should process if_ clone component ', ->
      x = see 0
      c1 = p(1)
      c2 = c1.clone()
      lstComp = list(c1, c2)
      comp = if_(x, p(3), lstComp)
      comp.mount('#demo')
      x 1
      comp.render()
      expect(comp.node.innerHTML).to.equal '3'
