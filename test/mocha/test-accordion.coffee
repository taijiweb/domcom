{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, each
accordionGroup, accordion
a, p, span, text, div} = dc

describe 'accordion', ->
  it  'should update accordionGroup', ->
    comp = accordionGroup({}, 'group head', each([1], (item) -> txt(1)), {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal s= '<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div>'
    comp.update()
    expect(comp.node.innerHTML).to.equal s

  it  'should update accordion group 2', ->
    comp = accordionGroup({}, 'group head', new Tag('span', {}, [each([1], (item) -> txt(1))]), {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal '<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div>'

  it  'should mount accordion', ->
    comp = accordion({}, [[{}, 'group head', new Tag('span', {}, [each([1], (item) -> txt(1))]), {}]], {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>'

  it  'should update accordion', ->
    comp = accordion({}, [[{}, 'group head', txt(1), {}]], {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal s='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div></div>'
    comp.update()
    expect(comp.node.innerHTML).to.equal s

  it  'should update accordion 2', ->
    comp = accordion({}, [[{}, 'group head', new Tag('span', {}, [each([1], (item) -> txt(1))]), {}]], {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal s='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>'
    comp.update()
    expect(comp.node.innerHTML).to.equal s

