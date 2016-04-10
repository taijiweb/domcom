{expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper')
{newDemoNode} = require('./helper')

{isComponent
Component, TransformComponent, Tag, Text,
txt, list, List, func, if_, case_, func, each, every, funcEach
accordionGroup, accordion
a, p, span, text, div
bind, pour, see} = dc

demo2Node = null
comp = null
dontUnmount = false

describe 'group component: List, each', ->
  beforeEach ->
    demo2Node = document.getElementById('demo2')
    demo2Node.innerHTML = ''

  afterEach ->
    dc.reset()
    if comp && comp.node && !dontUnmount
      comp.unmount()

  describe 'List', ->
    afterEach ->
      dc.reset()
      if comp && comp.node && !dontUnmount
        comp.unmount()

    it 'all of item in list should be  component', ->
      comp = list([1, 2])
      expect(isComponent(comp.children[0])).to.equal(true)

    it 'should create list component', ->
      comp =  list([span(['adf'])])
      comp.mount()
      expect(comp.node[0].tagName).to.equal 'SPAN'
      comp.unmount()

    it 'component list should have length', ->
      lst = list([1, 2])
      expect(lst.children.length).to.equal 2

    it 'list can be constructructed  from mulitple argumnents', ->
      lst = list(1, 2)
      expect(lst.children.length).to.equal 2

    it 'should create list', ->
      lst = list(1, 2)
      lst.mount()
      expect(lst.node[0].textContent).to.equal '1'
      expect(lst.node[1].textContent).to.equal '2'
      lst.unmount()

    it 'should create list with attrs', ->
      x = 2
      comp = list({class:'main', fakeProp:-> x}, 1, txt(->x))
      comp.mount()
      expect(comp.node.tagName).to.equal 'DIV'
      expect(comp.node.childNodes[0].textContent).to.equal '1'
      expect(comp.node.childNodes[1].textContent).to.equal '2'
      x = 3
      dc.update()
      expect(comp.node.fakeProp).to.equal 3
      expect(comp.node.childNodes[1].textContent).to.equal '3', 'textContent update'
      comp.unmount()

    it 'list(txt(->12))', ->
      comp = list(txt(->12))
      comp.mount()
      expect(comp.node.textContent).to.equal '12'
      comp.unmount()

    it 'list setChildren after mounting', ->
      comp = new List([txt(1)])
      comp.mount()
      expect(comp.node[0].textContent).to.equal '1'
      expect(->comp.setChildren(1, [t2=txt(2)])).not.to.throw()
      comp.unmount()

    it 'list setChildren: similar to splitter', ->
      comp = new List([txt(1), t3=txt(3)])
      comp.setChildren(1, [t2=txt(2), t3])
      comp.mount()
      expect(comp.node[0].textContent).to.equal '1'
      expect(comp.node[1].textContent).to.equal '2'
      expect(comp.node[2].textContent).to.equal '3'
      comp.unmount()

    it 'list(p(txt(->12))) ', ->
      comp = list(p(txt(->12)))
      comp.mount()
      dc.update()
      expect(comp.node.innerHTML).to.equal '12'
      comp.unmount()

    it 'list(p(->12)) ', ->
      comp = list(p(->12))
      comp.mount()
      dc.update()
      expect(comp.node.innerHTML).to.equal '12'
      comp.unmount()

    it 'list(txt(1)) ', ->
      comp = new List([txt(1)])
      comp.mount(demoNode=newDemoNode('list'))
      dc.update()
      comp.setLength(0)
      dc.update();
      expect(demoNode.innerHTML).to.equal ''
      comp.unmount()

    it 'list(txt(1), txt(2), txt(3)) and move child', ->
      comp = list(t1=txt(1), t2=txt(2), t3=txt(3))
      comp.mount(demoNode=newDemoNode('list'))
      expect(demoNode.innerHTML).to.equal '123'
      comp.removeChild(0)
      dc.update()
      expect(comp.dcidIndexMap[t1.dcid]).to.equal(undefined, 'dcid 0')
      expect(comp.dcidIndexMap[t2.dcid]).to.equal(0, 'dcid 1')
      expect(comp.dcidIndexMap[t3.dcid]).to.equal(1, 'dcid 2')
      expect(comp.children.length).to.equal(2)
      comp.pushChild(t1)
      dc.update()
      expect(demoNode.innerHTML).to.equal '231'
      comp.unmount()

  describe 'each of array, object', ->
    it 'simple each for array', ->
      comp = every([1, 2], (item) -> item)
      comp.mount(demoNode=newDemoNode('list'))
      dc.update()
      expect(comp.node.length).to.equal 2
      comp.unmount()

    it 'all key of object 1', ->
      comp = every({a:1, b:2}, (value) -> value)
      comp.mount(demoNode=newDemoNode('list'))
      dc.update()
      expect(comp.children.length).to.equal 2
      expect(demoNode.innerHTML).to.equal('12')

    it 'all key of object 2', ->
      comp = every({}, {a:1, b:2}, (value, key) -> list(key, ':', value))
      comp.mount(demoNode=newDemoNode('list'))
      dc.update()
      expect(comp.children.length).to.equal 2
      expect(comp.node.innerHTML).to.equal('a:1b:2')

    it 'all key of object 3', ->
      options = {
      itemFunc: (value, key) -> list(key, ':', value)
      separatorFunc: -> ', '
      }
      comp = every({}, {a:1, b:2}, options)
      comp.mount(demoNode=newDemoNode('list'))
      dc.update()
      expect(comp.children.length).to.equal 2
      expect(comp.node.innerHTML).to.equal('a:1, b:2')

  describe 'each', ->
    it  'should create empty each component', ->
      demo2Node = document.getElementById('demo2')
      demo2Node.innerHTML = ''
      comp = each(lst = [], (item, i) -> p(item))
      comp.mount(demo2Node)
      expect(comp.node).to.be.instanceof Array
      expect(comp.node.length).to.equal 0
      dc.update()
      expect(comp.node.length).to.equal 0
      comp.unmount()

    it  'should create each component with single item', ->
      comp = each(lst = [1], (item, i) -> p(item))
      comp.mount()
      expect(comp.node).to.be.instanceof Array
      expect(comp.node.length).to.equal 1
      expect(comp.node[0].innerHTML).to.equal '1'
      dc.update()
      expect(comp.node.length).to.equal 1
      expect(comp.node[0].innerHTML).to.equal '1'
      comp.unmount()

    it  'should set children.nextNode correctly', ->
      demo2Node = document.getElementById('demo2')
      demo2Node.innerHTML = ''
      lst = [1, 2]
      comp = list (each1=each(lst, (item) -> p item)), 'some other thing'
      comp.mount(demo2Node)
      expect(each1.nextNode).to.equal(comp.node[1])
      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>2</p>some other thing')
      lst.push 3
      dc.update()
      expect(each1.children[2].node).to.equal(each1.node[2])
      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>2</p><p>3</p>some other thing')
      comp.unmount()
      expect(demo2Node.innerHTML).to.equal('')

    it  'should create each component with two item', ->
      comp = each(lst = ['each', 'simple'], (item, i) -> p(item))
      comp.mount()
      expect(comp.node).to.be.instanceof Array
      expect(comp.node[0]).to.be.instanceof Element
      expect(comp.node[1].innerHTML).to.equal 'simple'
      comp.unmount()

    it 'should mount and render each component',  ->
      dontUnmount = true
      document.getElementById('demo').innerHTML = ''
      comp = each(lst=['each', 'simple'], (item, i) -> p(item))
      comp.mount(demoNode = newDemoNode("each"))
      expect(comp.node[0].innerHTML).to.equal 'each'
      expect(comp.node[1].innerHTML).to.equal 'simple'
      lst.setItem(0, 3)
      dc.update()
      expect(comp.node[0].innerHTML).to.equal '3', 'update node 0'
      lst.setItem 1, 4
      dc.update()
      expect(comp.node[1].innerHTML).to.equal '4', 'update node 1'
      expect(demoNode.innerHTML).to.equal '<p>3</p><p>4</p>', 'update innerHTML'
      lst.setItem 2, 5
      dc.update()
      expect(comp.node[2].innerHTML).to.equal '5', 'update list[2] = 5'
      lst.setLength(0)
      dc.update()
      expect(comp.children.length).to.equal 0, 'comp.children.length = 0'
      expect(comp.node.length).to.equal 0, 'node.length'
      comp.unmount()

    it 'should process binding on item', ->
      document.getElementById('demo').innerHTML = ''
      comp = each(lst = [{text:'a'}, {text:'b'}], ((item, i) -> p(txt(bind item, 'text'))))
      comp.mount("#demo")
      expect(comp.node[0].textContent).to.equal 'a'
      expect(comp.node[1].textContent).to.equal 'b'
      lst[0].text = 'c'
      dc.update()
      expect(comp.node[0].textContent).to.equal 'c', 'update c'
      lst[1].text = 'd'
      dc.update()
      expect(comp.node[1].textContent).to.equal 'd', 'update d'
      lst.setItem 2, {text: 'e'}
      dc.update()
      expect(comp.node[2].textContent).to.equal 'e'
      lst.setLength 0
      dc.update()
      expect(comp.node.length).to.equal 0
      comp.unmount()

    it 'should process items in template function', ->
      comp = each(lst = ['a', 'b'], {itemFunc: (item, i, listComponent) -> p(txt(-> item))})
      comp.mount()
      lst.setItem 0, 'c'
      dc.update()
      expect(comp.node[0].textContent).to.equal 'c'
      comp.unmount()

    it 'should process tag with each', ->
      dontUnmount = true
      x$ = see 1
      text1 = null
      comp = new Tag('div', {}, [each1=each([1], {itemFunc: (item) -> text1 = txt(x$)})])
      comp.mount()
      expect(comp.node.innerHTML).to.equal '1'
      x$ 2
      dc.update()
      expect(text1.node.textContent).to.equal('2', 'update, 2')
      expect(each1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '2'
      comp.unmount()

    it  'should create and update deeper embedded each', ->
      x = 1
      comp =  div({}, span1=new Tag('span', {}, [each1=each(listItems = [x], {itemFunc: (item) -> txt(item)})]))
      comp.mount()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal '1'
      listItems.setItem(0, 2)
      dc.update()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<span>2</span>'
      comp.unmount()

    it  'should create and update each where item return a closure variable', ->
      x = see 1
      comp = each([1], {itemFunc: -> txt(x)})
      comp.mount()
      expect(comp.node[0].textContent).to.equal '1'
      x 2
      dc.update()
      expect(comp.node[0].textContent).to.equal('2')
      comp.unmount()

    it  'should create and update embedded each where item return a closure variable', ->
      x = see 1
      comp = new Tag('span', {}, [each1=each([1], {itemFunc: (item) -> txt(x)})])
      comp.mount()
      expect(each1.parentNode).to.equal(comp.node)
      expect(each1.node[0].textContent).to.equal '1'
      x 2
      dc.update()
      expect(each1.parentNode).to.equal(comp.node)
      expect(each1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '2'
      comp.unmount()

    it  'should create and update embedded each in 3 layer', ->
      x = see 1
      comp =  div({}, div({}, span1=new Tag('span', {}, [each1=each([1], {itemFunc: (item) -> txt(x)})])))
      comp.mount()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal '1'
      x 2
      dc.update()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<div><span>2</span></div>'
      comp.unmount()

    it  'should mount and update each', ->
      comp = new Tag('span', {}, [each([1], (item) -> txt(1))])
      comp.mount()
      expect(comp.node.innerHTML).to.equal '1'
      dc.update()
      expect(comp.node.innerHTML).to.equal '1'
      comp.unmount()

    it  'should push and setLength of each', ->
      lst = [1, 2, 3, 4, 5, 6]
      comp = each(lst, (item) -> txt item)
      comp.mount()
      lst.push 7
      dc.update()
      expect(comp.node.length).to.equal 7, 'push 7'
      lst.setLength 4
      dc.update()
      expect(comp.node.length).to.equal 4, 'setLength 4'
      comp.unmount()

    it  'should update each with component as the item of list 1', ->
      comp = each([txt(1)], (item) -> item)
      comp.mount()
      expect(comp.node[0].textContent).to.equal s='1'
      dc.update()
      expect(comp.node[0].textContent).to.equal '1'
      comp.unmount()

    it  'should update each with component as the item of list 2', ->
      comp = div(each([txt(1)], (item) -> item))
      comp.mount()
      expect(comp.node.innerHTML).to.equal s='1'
      dc.update()
      expect(comp.node.innerHTML).to.equal '1'
      comp.unmount()

    it  'should update each with component as the item of list 3', ->
      comp = div(div(each([txt(1)], (item) -> item)))
      comp.mount()
      expect(comp.node.innerHTML).to.equal s='<div>1</div>'
      dc.update()
      expect(comp.node.innerHTML).to.equal '<div>1</div>'
      comp.unmount()

    it  'should always attach and detach in multiple iteration 0', ->
      showingEach$ = see true
      comp = if_ showingEach$, txt(1)
      comp.mount(demo2Node)
      expect(demo2Node.innerHTML).to.equal('1')
      expect(comp.node.parentNode).to.equal demo2Node
      showingEach$ false
      dc.update()
      expect(comp.node.parentNode).to.equal undefined
      expect(demo2Node.innerHTML).to.equal('')
      showingEach$ true
      dc.update()
      expect(comp.node.parentNode).to.equal demo2Node
      expect(demo2Node.innerHTML).to.equal('1')
      showingEach$ false
      dc.update()
      expect(demo2Node.innerHTML).to.equal('')
      expect(comp.node.parentNode).to.equal undefined
      comp.unmount()

    it  'should always attach and detach each in multiple iteration 1', ->
      showingEach$ = see true
      lst4 = [1, 2]
      comp = if_ showingEach$, each(lst4, (item) -> txt(item))
      comp.mount(demo2Node)
      expect(demo2Node.innerHTML).to.equal('12')
      expect(comp.node.parentNode).to.equal demo2Node
      showingEach$ false
      dc.update()
      expect(comp.node.parentNode).to.equal undefined
      expect(demo2Node.innerHTML).to.equal('')
      showingEach$ true
      dc.update()
      expect(comp.node.parentNode).to.equal demo2Node
      expect(demo2Node.innerHTML).to.equal('12')
      showingEach$ false
      dc.update()
      expect(demo2Node.innerHTML).to.equal('')
      expect(comp.node.parentNode).to.equal undefined
      comp.unmount()

    it  'should always attach and detach each in multiple iteration 2', ->
      showingEach$ = see true
      lst4 = [1, 2]
      comp = if_ showingEach$, each(lst4, (item) -> div item)
      comp.mount(demo2Node)
      expect(demo2Node.innerHTML).to.equal('<div>1</div><div>2</div>')
      showingEach$ false
      dc.update()
      expect(comp.node.parentNode).to.equal undefined
      showingEach$ true
      dc.update()
      expect(comp.node.parentNode).to.equal demo2Node
      showingEach$ false
      dc.update()
      expect(comp.node.parentNode).to.equal undefined
      comp.unmount()

  describe 'funcEach', ->

    it  'should process funcEach', ->
      x = 1
      comp = funcEach((-> [x]), {itemFunc: (item) -> item})
      comp.mount()
      expect(comp.node[0].textContent).to.equal '1'
      x = 2
      dc.update()
      expect(comp.node[0].textContent).to.equal '2', 'after x = 2'
      comp.unmount()

    it  'should create and update funcEach', ->
      dontUnmount = true
      x = 1
      comp = funcEach((-> [x]), {itemFunc: (item) -> txt(item)})
      comp.mount(demo2Node)
      expect(comp.node[0].textContent).to.equal '1'
      x = 2
      dc.update()
      expect(comp.node[0].textContent).to.equal('2', 'update 2')
      expect(comp.isList).to.equal(true)
      expect(demo2Node.innerHTML).to.equal('2', 'innerHTML')
      x = 3
      dc.update()
      expect(comp.node[0].textContent).to.equal('3', 'update 3')
      expect(demo2Node.innerHTML).to.equal('3', 'innerHTML')
      comp.unmount()

    it  'should process each under each and with function as items 1', ->
      x = 1
      each2 = null
      comp = div({}, each1=each([1], -> each2=funcEach((-> [x]), (item) -> item)))
      comp.mount(demo2Node)
      expect(demo2Node.innerHTML).to.equal('<div>1</div>')
      dontUnmount = true
      expect(each1.parentNode).to.equal(comp.node)
      expect(each1.node[0][0].textContent).to.equal '1'
      expect(each2.node[0].textContent).to.equal '1'
      x = 2
      dc.update()
      expect(demo2Node.innerHTML).to.equal('<div>2</div>')
      expect(each1.parentNode).to.equal(comp.node)
      expect(each2.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '2', 'after x = 2'
      comp.unmount()

    it  'should process each under each and with function as items 0', ->
      x = 1
      each2 = null
      comp = each1 = each([1], -> each2=funcEach((-> [x]), {itemFunc: (item) -> txt(item)}))
      comp.mount(demo2Node)
      expect(demo2Node.innerHTML).to.equal('1')
      dontUnmount = true
      expect(each1.parentNode).to.equal(each1.parentNode)
      expect(each1.parentNode).to.equal(demo2Node)
      expect(each1.node[0][0].textContent).to.equal '1'
      expect(each2.node[0].textContent).to.equal '1'
      x = 2
      dc.update()
      expect(demo2Node.innerHTML).to.equal('2')
      expect(each1.parentNode).to.equal(each1.parentNode)
      expect(each2.node[0].textContent).to.equal('2')
      expect(demo2Node.innerHTML).to.equal '2', 'after x = 2'
      comp.unmount()

    it  'should create and update embedded each in 3 layer 2', ->
      x = 1
      comp =  div({}, div({}, span1=new Tag('span', {}, [each1=funcEach((-> [x]), {itemFunc: (item) -> txt(item)})])))
      comp.mount()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal '1'
      x = 2
      dc.update()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<div><span>2</span></div>'
      comp.unmount()

    it  'should create and update deeper embedded funcEach', ->
      x = 1
      comp =  div({}, span1=new Tag('span', {}, [each1=funcEach((-> [x]), {itemFunc: (item) -> txt(item)})]))
      comp.mount()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal '1'
      x = 2
      dc.update()
      expect(each1.parentNode).to.equal(span1.node)
      expect(each1.node[0].textContent).to.equal('2')
      expect(comp.node.innerHTML).to.equal '<span>2</span>'
      comp.unmount()

    it  'should create and update funcEach in list', ->
      dontUnmount = true
      items = [1, 2]
      comp = list(txt('text'), each1=funcEach((-> items), {itemFunc: (item) -> txt(' '+item)}))
      comp.mount(demo2Node)
      expect(demo2Node.innerHTML).to.equal('text 1 2')
      items = [3]
      dc.update()
      expect(demo2Node.innerHTML).to.equal 'text 3'
      dc.update()
      expect(demo2Node.innerHTML).to.equal 'text 3'

