{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, duplex, flow, see, see2
classFn, styleFrom, extendAttrs
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

describe 'demo', ->
  describe 'sum', ->
    it 'should construct and create components', ->
      {$a, $b, _a, _b} = bindings({a: 3, b: 2})
      x = text($a); y = text($b); z = p(txt(sum=flow.add _a, _b))
      expect(sum()).to.equal 5, 'sum 1'
      _a 1
      expect(sum()).to.equal 3,  'sum 2'
      comp = list(x, y, z)
      comp.mount('#demo')
      expect(z.node.innerHTML).to.equal '3',  'mount'
      x.node.value = '3'
      y.node.value = '4'
      x.node.onchange()
      y.node.onchange()
      expect(_a()).to.equal('3', '_a')
      expect(_b()).to.equal('4', '_b')
      expect(sum()).to.equal('34', 'sum')
      expect(!!comp.noop).to.equal false, 'comp.noop'
      # z is not holder, not update root
      expect(!!z.noop).to.equal true, 'z.noop'
      comp.update()
      expect(z.node.innerHTML).to.equal '34', 'update'

  describe 'combobox', ->
    it 'should process event property of child component', ->
      x = 0
      comp = div({}, c0=input({ onmouseenter: -> x = 1}), div({}, 'wawa'))
      comp.mount()
      c0.node.onmouseenter()
      expect(x).to.equal 1

    it 'should process event property of child component with model directive', ->
      x = 0
      comp = div({}, c0=input({ $model:duplex({}, 'x'), onmouseenter: -> x = 1}), div({}, 'wawa'))
      comp.mount()
      c0.node.onmouseenter()
      expect(x).to.equal 1

  describe 'text model', ->
    it 'should text model by value', ->
      {$a} = bindings(m={a: 1})
      attrs = {onchange: -> comp.update()}
      comp = list(text1=text(attrs, $a), text2=text(attrs, $a))
      comp.mount()
      text1.node.value = 3
      text1.node.onchange()
      expect(m.a).to.equal '3', 'm.a'
      expect(text2.node.value).to.equal '3', 'text2.node.value'

    it 'should text model by value and onchange', ->
      {$a} = bindings(m={a: 1})
      attrs = {value: $a, onchange: -> $a @value; comp.update()}
      comp = list(text1=text(attrs), text2=text(attrs))
      comp.mount()
      text1.node.value = 3
      text1.node.onchange()
      expect(m.a).to.equal '3', 'm.a'
      expect(text2.node.value).to.equal '3', 'text2.node.value'

  describe 'combo', ->
    it 'should combobox', ->
      showingItems = see false
      comp = null # do NOT remove this line, because comp is referenced in attrs
      value = see2 ''
      opts = for item in [1,2] then do (item=item) ->
        span({
          style:{display:'block', border:"1px solid blue", "min-width":"40px"}
          onclick:(-> value(item); comp.update())
        }, item)
      attrs = extendAttrs attrs, {
        onmouseleave:(-> showingItems false; comp.update())
      }
      comp = div(attrs,
        input1=input({
          $model:value
          onmouseenter:(-> showingItems true; comp.update())}),
        items=div({style:{display: flow showingItems, -> if showingItems() then 'block' else 'none'}}, opts) # flow showingItems,
      )
      comp.mount()
      expect(input1.node.value).to.equal('')
      expect(showingItems()).to.equal(false)
      expect(items.node.style.display).to.equal('none')
      input1.node.onmouseenter()
      expect(items.node.style.display).to.equal('block')
      opts[1].node.onclick()
      expect(input1.node.value).to.equal('2')

  describe 'todomvc', ->
    it 'should construct and create components', ->
      comp = li(a({className:{selected: 1}, href:"#/"}, "All"))
      comp.mount('#demo')
      expect(comp.children.node.className).to.equal('selected')
      expect(comp.children.node.href).to.equal('http://localhost:63342/tiiji/domcom/#/')

