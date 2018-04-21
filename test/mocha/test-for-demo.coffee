{expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{bindings, duplex, flow, see
classFn, styleFrom, extendAttrs
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input
each, funcEach} = dc

controls = require('../../demo/demo-controls')

makeDomComponentTest = require('../makeDomComponentTest')

{demoMap, runDemo} = require('../../demo/util')

makeDomComponentTest(demoMap, "domcom/demoMap")
#, 'auto width edit', false
#, 'splitter', false

describe 'demo and todoMVC', ->
  afterEach ->
    dc.reset()

  describe 'demo', ->
    it 'should construct and create components', ->
      {a$, b$, a_, b_} = bindings({a: 3, b: 2})
      x = text(a$); y = text(b$); z = p(t1 = txt(sum=flow.add a_, b_))
      expect(sum()).to.equal 5, 'sum 1'
      a_ 1
      expect(sum()).to.equal 3,  'sum 2'
      comp = list(x, y, z)
      comp.mount('#demo')
      expect(z.node.innerHTML).to.equal '3',  'mount'
      x.node.value = '3'
      y.node.value = '4'
      x.node.onchange({type: 'change'})
      y.node.onchange({type: 'change'})
      expect(a_()).to.equal('3', 'a_')
      expect(b_()).to.equal('4', 'b_')
      expect(sum()).to.equal('34', 'sum')
      expect(!!comp.valid).to.equal(false, 'comp.valid')
      expect(!!z.valid).to.equal(false, 'z.valid')
      expect(!!t1.valid).to.equal(false, 't1.valid')
      comp.render()
      expect(z.node.innerHTML).to.equal '34', 'update'

    it 'should process event property of child component', ->
      x = 0
      comp = div({}, c0=input({ onmouseenter: -> x = 1}), div({}, 'wawa'))
      comp.mount()
      c0.node.onmouseenter({type: 'mouseenter'})
      expect(x).to.equal 1

    it 'should process event property of child component with model directive', ->
      x = 0
      comp = div({}, c0=input({ $model:duplex({}, 'x'), onmouseenter: -> x = 1}), div({}, 'wawa'))
      comp.mount()
      c0.node.onmouseenter({type: 'mouseenter'})
      expect(x).to.equal 1

    it 'should text model by value', ->
      {a$} = bindings(m={a: 1})
      attrs = {onchange: -> comp.render()}
      comp = list(text1=text(attrs, a$), text2=text(attrs, a$))
      comp.mount()
      text1.node.value = 3
      text1.node.onchange({type: 'change'})
      expect(m.a).to.equal '3', 'm.a'
      expect(text2.node.value).to.equal '3', 'text2.node.value'

    it 'should text model by value and onchange', ->
      {a$} = bindings(m={a: 1})
      attrs = {value: a$, onchange: (event, node) -> a$ node.value; comp.render()}
      comp = list(text1=text(attrs), text2=text(attrs))
      comp.mount()
      text1.node.value = 3
      text1.node.onchange({type: 'change'})
      expect(m.a).to.equal '3', 'm.a'
      expect(text2.node.value).to.equal '3', 'text2.node.value'

    it 'should combobox', ->
      showingItems = see false
      comp = null # do NOT remove this line, because comp is referenced in attrs
      value = see ''
      opts = for item in [1,2] then do (item=item) ->
        span({
          style:{display:'block', border:"1px solid blue", "min-width":"40px"}
          onclick: ->
            value(item)
            comp.render()
        }, item)
      attrs = extendAttrs attrs, {
        onmouseleave:(-> showingItems false; comp.render())
      }
      comp = div(attrs,
        input1=input({
          $model:value
          onmouseenter:(-> showingItems true; comp.render())}),
        items=div({style:{display: flow showingItems, -> if showingItems() then 'block' else 'none'}}, opts) # flow showingItems,
      )
      comp.mount()
      expect(input1.node.value).to.equal('')
      expect(showingItems()).to.equal(false)
      expect(items.node.style.display).to.equal('none')
      input1.node.onmouseenter({type: 'mouseenter'})
      expect(items.node.style.display).to.equal('block')
      opts[1].node.onclick({type: 'click'})
      expect(input1.node.value).to.equal('2')

    it 'should mount controls and others', ->
      comp = controls()
      comp.mount('#demo')
      expect(comp.node.length).to.equal(2)
      comp.unmount()

    it 'should always switch demo', ->
      comp = runDemo(demoMap, 'each2')
      sel = comp.children[0]
      sel.node.value = 'each3'
      sel.node.onchange({type: 'change'})
      expect(comp.children[1].node.innerHTML).to.equal("<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>")
      sel.node.value = 'each2'
      sel.node.onchange({type: 'change'})
      sel.node.value = 'each3'
      sel.node.onchange({type: 'change'})
      expect(comp.children[1].node.innerHTML).to.contain("<p>1</p><p>2</p><p>3</p><p>4</p>")

    it 'should mount/unmount sub component', ->
      div1 = div 'toggle me'
      buttons = list  \
        div onclick: (-> div1.mount()), 'mount',
        div onclick: (-> div1.unmount()), 'unmount'
      comp = list buttons, div1
      div1.mount()
      div1.unmount()
      comp.mount()
      comp.unmount()

  describe 'todomvc', ->
    status = null

    it 'should process class', ->
      comp = a({className:{selected: 1}, href:"#/"})
      comp.mount('#demo')
      expect(comp.node.className).to.equal('selected')

    it 'should construct and create components', ->
      comp = li(a({className:{selected: 1}, href:"#/"}, "All"))
      comp.mount('#demo')
      expect(comp.children[0].node.className).to.equal('selected')
      expect(comp.children[0].node.href).to.match(/:\/\//)

    makeTodo = (todos, status) ->
      status.hash = 'all'

      getTodos = ->
        if status.hash=='active'
          todos.filter((todo) -> todo && !todo.completed)
        else if status.hash=='completed'
          todos.filter((todo) -> todo && todo.completed)
        else todos

      funcEach getTodos, (todo) ->
        p(txt(->todo.title), ', ', txt(-> if todo.completed then 'completed' else 'uncompleted'))

    it 'should mount getTodos and each with empty todos correctly', ->
      todos = []
      comp = makeTodo todos, {hash:'all'}
      comp.mount()
      expect(comp.node.length).to.equal 0

    it 'should invalidate children to listComponent', ->
      todos = [{title:'do this'}]
      comp = makeTodo(todos, status = {hash:'all'})
      comp.mount()
      expect(comp.children.length).to.equal(1, '1-1')
      status.hash = 'completed'
      comp.render()
      expect(comp.children.length).to.equal(0, '1-2')
      status.hash = 'all'
      comp.render()
      expect(comp.children.length).to.equal(1, '1-3')

    it 'should process getTodos and each correctly', ->
      todos = [{title:'do this'}]
      comp = makeTodo todos, status={hash:'all'}
      comp.mount()
      expect(comp.node.length).to.equal 1
      status.hash = 'completed'
      comp.render()
      expect(comp.node.length).to.equal 0
      status.hash = 'all'
      comp.render()
      expect(comp.node.length).to.equal 1

    it 'should todoEditArea', ->
      {section, ul, footer} = dc

      todoItems = each(lst=[1,2], (todo, index) -> li(todo)
      )

      comp  = section({id:"main"}
        ul({id:"todo-list"}, todoItems)
        footer({id:"footer"}
        )
      )
      comp.mount()
      expect(todoItems.node.length).to.equal(2)
      lst.push(3)
      comp.render()
      expect(todoItems.node.length).to.equal(3)

    it 'should switch todo by status', ->
      state = 2
      todos = [1, 2, 3, 4, 5, 6]
      getTodos = ->
        if state == 0
          todos.filter (todo) -> todo && todo % 2 == 0
        else if state == 1
          todos.filter (todo) -> todo && todo % 2 == 1
        else
          todos.filter (todo) -> todo

      comp = funcEach getTodos, (todo, index) -> txt(' '+ todo)
      comp.mount()
      expect(comp.children.length).to.equal(6)
      expect(comp.node.length).to.equal(6)
      expect(comp.node[0].textContent).to.equal(' 1')
      expect(comp.node[1].textContent).to.equal(' 2')
      state = 0
      comp.render()
      expect(comp.children.length).to.equal(3, 'children 2')
      expect(comp.node.length).to.equal(3)
      expect(comp.node[0].textContent).to.equal(' 2')
      expect(comp.node[1].textContent).to.equal(' 4')
      state = 1
      comp.render()
      expect(comp.children.length).to.equal(3, 'children 3')
      expect(comp.node.length).to.equal(3)
      expect(comp.node[0].textContent).to.equal(' 1')
      expect(comp.node[1].textContent).to.equal(' 3')
