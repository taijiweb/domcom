{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, flow
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, each
accordionGroup, accordion
a, p, span, text, div} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe 'toString', ->
  it 'should toString list of if(tag)', ->
    x = 0
    comp = list(t1=text({onchange: -> x = parseInt(@value); comp.update()}, x), pIf=if_((->x), div(1), div(2)))
#    console.log(comp.toString())
    expect(comp.toString()).to.equal '<List>\n  <input type="text" value=0></input>\n  <if renew: fn:x>\n    <div>1</div>\n    <div>2</div>\n  </if>\n</List>'

  it 'should toString  tag with props', ->
    x = 0
    comp = div({value:1}, 1)
#    console.log(comp.toString())
    expect(comp.toString()).to.equal '<div value=1>1</div>'

  it 'should case.toString', ->
    comp = case_((-> x), {1:p(1), 2:p(2), 3:p(3)}, 'others')
#    console.log(comp.toString())
    expect(comp.toString()).to.equal '<Case renew: fn:x>\n  1: <p>1</p>\n  2: <p>2</p>\n  3: <p>3</p>\n  "others"\n</Case>'

  it 'should flow.add(_a, _b).toString', ->
    r = flow.add _a, _b
    expect(r.toString()).to.equal 'flow: [m[a],m[b]] --> fn:binaryFn(x(), y())'


