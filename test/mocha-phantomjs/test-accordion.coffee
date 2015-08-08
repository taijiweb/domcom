{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings
Component, TransformComponent, Tag, Text,
txt, list, func, if_, case_, func, repeat
accordionGroup, accordion
a, p, span, text, div} = dc

describe 'accordion', ->
  it  'should create and update accordion group', ->
    comp = accordionGroup({}, 'group head', new Tag('span', {}, [repeat([1], (item) -> txt(1))]), {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal '<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div>'

  it  'should mount accordion', ->
    comp = accordion({}, [[{}, 'group head', new Tag('span', {}, [repeat([1], (item) -> txt(1))]), {}]], {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>'

  it  'should mount and update repeat', ->
    comp = new Tag('span', {}, [repeat([1], (item) -> txt(1))])
    comp.mount()
    expect(comp.node.innerHTML).to.equal '1'
    comp.update()
    expect(comp.node.innerHTML).to.equal '1'

  it  'should mount and update accordion', ->
    comp = accordion({}, [[{}, 'group head', new Tag('span', {}, [repeat([1], (item) -> txt(1))]), {}]], {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal s='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>'
    comp.update()
    expect(comp.node.innerHTML).to.equal s

  it  'should mount and update accordion 2', ->
    comp = accordion({}, [[{}, 'group head', txt(1), {}]], {})
    comp.mount()
    expect(comp.node.innerHTML).to.equal s='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div></div>'
    #expect(comp.node.innerHTML).to.equal s='<div>1</div>'
    comp.update()
    expect(comp.node.innerHTML).to.equal s

  it  'should mount and update accordion 3', ->
    comp = div(div(repeat([txt(1)], (item) -> item)))
    comp.mount()
    expect(comp.node.innerHTML).to.equal s='<div>1</div>'
    comp.update()
    expect(comp.node.innerHTML).to.equal '<div>1</div>'

  it  'should mount and update accordion 4', ->
    comp = div(repeat([txt(1)], (item) -> item))
    comp.mount()
    expect(comp.node.innerHTML).to.equal s='1'
    comp.update()
    expect(comp.node.innerHTML).to.equal '1'
