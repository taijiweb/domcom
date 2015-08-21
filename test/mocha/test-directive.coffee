###*test-directive
###

{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{
Component, list, func, if_, repeat
a, div, p, span, text, select, input
show, hide, splitter
bindings, bibind} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe 'directives', ->

  describe 'model ', ->
    it 'should process model  directive', ->
      comp = text({$model:$a})
      comp.mount()
      comp.node.value = '2'
      comp.node.onchange()
      expect($a()).to.equal '2'

    it 'should process event property of component with model directive', ->
      x = 0
      modelValue = bibind({}, 'x')
      # comp = input({ onmouseenter: -> x = 1})
      comp = input({$model:modelValue, onmouseenter: -> x = 1})
      comp.mount()
      comp.node.onmouseenter()
      expect(x).to.equal 1

  describe 'show', ->
    it 'should process show directive', ->
      comp = div({$show:true})
      comp.mount()
      expect(comp.node.style.display).to.equal 'block'

    it 'should process show directive with non block display', ->
      comp = div({style:{display:"inline"}, show:true})
      comp.mount()
      expect(comp.node.style.display).to.equal 'inline'

    it 'should process show directive with false value', ->
      comp = div({$show:false}, div(1))
      comp.mount()
      expect(comp.node.style.display).to.equal 'none'

    it  'should process show directive with function value', ->
      a = true
      comp = div({$show:-> a})
      comp.mount()
      expect(comp.node.style.display).to.equal 'block'
      a = false
      comp.update()
      expect(comp.node.style.display).to.equal 'none'

    it 'should process hide directive', ->
      comp = div({$hide:true}, div(1))
      comp.mount()
      expect(comp.node.style.display).to.equal 'none'
    it 'should process hide directive with false value', ->
      comp = hide(false)(div(div(1)))
      comp.mount()
      expect(comp.node.style.display).to.equal 'block'

  describe 'splitter', ->
    it 'should constructor splitter', ->
      comp = splitter('vertical')(div(div(1), div(2)))
      comp.mount()
      expect(comp.node.innerHTML).to.match /splitbar/

  describe 'select options', ->
    it 'should constructor select with options', ->
      comp = select({$options:[[1,2]]})
      comp.mount()
      expect(comp.node.innerHTML).to.match /<option>1/
