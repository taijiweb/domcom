{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, see
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, each
ref, clone
a, p, span, text, div} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe 'ref, clone', ->

  describe 'Ref', ->
    it 'should throw error while constucting conflicted component without ref: if_((-> x), t1=txt(1), Ref(t1))', ->
      t1 = txt(1)
      expect(-> list(p(t1), if_(1, t1, t1))).to.not.throw Error

    it 'should getBaseComponent of if_((-> x), t1=txt(1), Ref(t1))', ->
      x = see 0
      comp = if_(x, t1=txt(1), t1)
      comp.mount()
      comp.update()

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
      comp.update()
      expect(comp.getNode()[1].textContent).to.equal '1'

    it 'should process tag clone component ', ->
      comp = list(c1=p(1), c2=clone(c1))
      comp.mount('#demo')
      comp.update()
      expect(comp.getNode()[1].innerHTML).to.equal '1'

    it 'should process if_ clone component ', ->
      x = see 0
      lstComp = list(c1=p(2), c2=clone(c1))
      comp = if_(x, c1=p(3), lstComp)
      comp.mount('#demo')
      x 1
      comp.update()
      expect(comp.getNode().innerHTML).to.equal '3'
