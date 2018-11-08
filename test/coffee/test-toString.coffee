import {expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{flow, bindings
Component, TranBlock, Tag, Text,
txt, list, func, if_, case_, func, each
accordionGroup, accordion
a, p, span, text, div} = dc

describe 'toString', ->
  it 'should toString list of if(tag)', ->
    x = 0
    comp = list(t1=text({onchange: -> x = parseInt(this.node.value); comp.render()}, x), pIf=if_((->x), div(1), div(2)))
    expect(comp.toString()).to.match /<List>\n  <input type="text" value=0>/

  it 'should toString  tag with props', ->
    x = 0
    comp = div({value:1}, 1)
    expect(comp.toString()).to.equal '<div value=1>1</div>'

  nit 'should case.toString', ->
    comp = case_((-> x), {1:p(1), 2:p(2), 3:p(3)}, 'others')
    expect(comp.toString()).to.equal '<Case renew: fn:x>\n  1: <p>1</p>\n  2: <p>2</p>\n  3: <p>3</p>\n  "others"\n</Case>'

  nit 'should flow.add(a_, b_).toString', ->
    {a_, b_} = bindings({a: 1, b: 2})
    r = flow.add a_, b_
    expect(r.toString()).to.equal 'flow: [m[a],m[b]] --> fn:binaryFn(x(), y())'


