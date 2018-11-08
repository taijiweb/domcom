import {expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper')
import {newDemoNode} from './helper'

{see, flow
Component, Tag, Text, List, If
txt, list, func, if_, mergeIf
a, p, span, text, div} = dc

describe 'domcom/test-merge-if', ->
  afterEach ->
    dc.reset()

  it 'should construct mergeIf(x, t1, t2)', ->
    x = see 0
    t1 = txt 1; t2 = txt 2
    comp = mergeIf(x, t1, t2)
    expect(comp.isText).to.equal(true)
    comp.mount()
    expect(comp.node.textContent).to.equal('2')
    x 1
    comp.render()
    expect(comp.node.textContent).to.equal('1')

  it 'should render mergeIf(x, list(t1, t2), list(t2, t1))', ->
    x = see 0
    t1 = txt 1; t2 = txt 2
    comp = mergeIf(x, list(t1, t2), list(t2, t1))
    expect(comp.isList).to.equal(true)
    comp.mount(demoNode=newDemoNode('if-ref'))
    expect(comp.node[0].textContent).to.equal '2', 'mount'
    expect(demoNode.innerHTML).to.equal '21', 'mount'
    x 1
    comp.render()
    expect(comp.node[0].textContent).to.equal '1', 'update x 1'
    expect(demoNode.innerHTML).to.equal '12', 'update'

  it 'should render if_(x, list(t2, t1), new List([t1]))', ->
    x = see 1
    t1 = txt 1; t2 = txt 2
    comp = mergeIf(x, lst=list(t2, t1), new List([t1]))

    expect(comp.isList).to.equal(true)

    comp.mount(demoNode=newDemoNode('if-ref'))
    expect(demoNode.innerHTML).to.equal '21', 'mount'

    x 0
    comp.render()
    dc.clean()
    expect(demoNode.innerHTML).to.equal '1'

  it 'should render mergeIf(x, new List([t1]), list(t2, t1))', ->
    x = see 1
    t1 = txt 1; t2 = txt 2
    comp = mergeIf(x, new List([t1]), lst=list(t2, t1))

    expect(comp.isList).to.equal(true)

    comp.mount(demoNode=newDemoNode('if-ref'))
    expect(demoNode.innerHTML).to.equal '1', 'mount'

    x 0
    comp.render()
    expect(demoNode.innerHTML).to.equal '21'

  it 'should render mergeIf(x, p(t1), p(t2))', ->
    x = see 0
    t1 = txt 1; t2 = txt 2
    comp = mergeIf(x, p(t1), p(t2))

    expect(comp.isTag).to.equal(true)

    comp.mount(demoNode=newDemoNode('if-ref'))
    expect(demoNode.innerHTML).to.equal '<p>2</p>', 'mount'
    x 1
    comp.render()
    dc.clean()
    expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1'

  it 'should also render mergeIf(x, p(t1), p(t2, t1))', ->
    x = see 0
    t1 = txt 1; t2 = txt 2
    comp = mergeIf(x, p(t1), p(t2, t1))

    expect(comp.isTag).to.equal(true)

    comp.mount(demoNode=newDemoNode('if-ref'))
    expect(demoNode.innerHTML).to.equal '<p>21</p>', 'mount'

    x 1
    comp.render()
    dc.clean()
    expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1'

    x 0
    comp.render()
    dc.clean()
    expect(demoNode.innerHTML).to.equal '<p>21</p>', 'update x 0'

    x 1
    comp.render()
    dc.clean()

    expect(demoNode.innerHTML).to.equal '<p>1</p>', 'update x 1 again'

  it 'should render mergeIf(x, p(t1), div(t2))', ->
    x = see 0
    t1 = txt 1
    comp = mergeIf(x, p(t1), div(t1))
    expect(comp instanceof If).to.equal(true)

  it 'should render mergeIf(x, div(1), div(2))', ->
    x = see 0
    comp = mergeIf(x, div(1), div(2))
    comp.mount()

    expect(comp.isTag).to.equal(true)

    expect(comp.children[0].isText).to.equal(true)

    expect(comp.node.tagName).to.equal 'DIV', 'tagName'
    expect(comp.node.innerHTML).to.equal '2', 'mount'

    x 1
    comp.render()
    expect(comp.node.innerHTML).to.equal '1', 'first update'

  it 'should render mergeIf(x, div(1), div(p(2)))', ->
    x = see 0
    comp = mergeIf(x, div(1), div(p(2)))
    comp.mount()

    expect(comp.isTag).to.equal(true)

    expect(comp.children[0] instanceof If).to.equal(true)

    expect(comp.node.tagName).to.equal 'DIV', 'tagName'
    expect(comp.node.innerHTML).to.equal '<p>2</p>', 'mount'

  it 'should render mergeIf(x, div({class}, 1), div({class}, 2))', ->
    x = see 0
    comp = mergeIf(x, div({class:'a'}, 1), div({class:'b'}, 2))
    comp.mount()

    expect(comp.isTag).to.equal(true)
    expect(comp.node.className).to.equal 'b'

    x 1
    comp.render()
    expect(comp.node.className).to.equal 'a'

  it 'should render mergeIf(x, div({a:1}, 1), div({b:2}, 2))', ->
    x = see 0
    comp = mergeIf(x, div({a:1}, 1), div({b:2}, 2))
    comp.mount()

    expect(comp.isTag).to.equal(true)
    expect(comp.node.a).to.equal ''
    expect(comp.node.b).to.equal 2

    x 1
    comp.render()
    expect(comp.node.a).to.equal 1
    expect(comp.node.b).to.equal '', 'x 1'

  it 'should render mergeIf(x, div({onclick}, 1), div({onclick}, 2))', ->
    x = see 0
    a = 0
    comp = mergeIf(x, div({onclick: -> a = 1}, 1), div({ onclick: -> a = 2}, 2))
    comp.mount()

    comp.node.onclick({type: 'click'})
    expect(a).to.equal(2, 'first click')

    x 1
    comp.render()
    comp.node.onclick({type: 'click'})
    expect(a).to.equal(1, 'second click')

  it 'should NOT merge If(0, div({onclick}, 1), div({onclick}, 2), true, false, true)', ->
    # if test is not function, always should NOT merge
    a = 0
    comp = new If(0, div({onclick: -> a = 1}, 1), div({ onclick: -> a = 2}, 2), true, false, true) # merge, recursive, alwaysBeIf
    comp.mount()

    comp.node.onclick({type: 'click'})
    expect(a).to.equal(2, 'first click')

    comp.test = 1
    comp.render()
    comp.node.onclick({type: 'click'})
    expect(a).to.equal(1, 'second click')

  it 'should render mergeIf(x, div({style}, 1), div({style}, 2))', ->
    x = see 0
    # if width is just 100 or 200, they are invalid value, and will NOT be set to the dom node
    comp = mergeIf(x, div({style:{width:'100px'}}, 1), div({ style:{width:'200px'}}, 2))
    comp.mount()
    expect(comp.node.style.width).to.equal('200px')

    x 1
    comp.render()
    expect(comp.node.style.width).to.equal('100px')
