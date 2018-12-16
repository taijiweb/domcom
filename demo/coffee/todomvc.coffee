dc.addReactProxy window.React, window.ReactDOM, window.React.Component

#######################################################################################################################
# store

window.fetch = -> JSON.parse localStorage.getItem('todoApp') || '[]'
window.save = (todos) -> localStorage.setItem('todoApp', JSON.stringify(todos))

#######################################################################################################################
# model
# [ { title: string, completed: boolean } ... ]
window.todos = []
window.todos = fetch()

#######################################################################################################################
# controller

viewStatusHash = null
editingTodo = {title:'', completed:false}
originalTodo = null
reverted = null
saving = false

window.getTodos = ->
  if viewStatusHash=='active'
    todos.filter (todo) -> todo && !todo.completed
  else if viewStatusHash=='completed'
    todos.filter (todo) -> todo && todo.completed
  else
    todos

remainingCount = -> todos.filter((todo) -> !todo.completed).length
completedCount = -> todos.length - remainingCount()
allChecked = -> !remainingCount()

onEscapeFn = (fn) -> (event) -> if event.keyCode==27 || event.which==27  then fn()

pluralize = (test, item) ->
  if test>1
    item+'s'
  else
    item

toggleCompleted = (todo) ->
  todo.completed = !todo.completed
  save todos
  app.update()

markAll = ->
  console.log('markAll')
  if allChecked() then completed = false
  else completed = true

  valid = true
  for todo in todos
    if todo.completed!=completed
      todo.completed = completed
      valid = false

  if !valid
    save(todos)
    app.update()

editTodo = (todo) ->
  editingTodo = todo
  originalTodo = Object.assign {}, todo
  app.update()

removeTodo = (todo) ->
  index = todos.indexOf todo
  todos.splice index, 1
  save todos
  app.update()

revertEdits = (todo) ->
  todos[todos.indexOf(todo)] = originalTodo
  app.update()

clearCompletedTodos = ->
  valid = true

  i = todos.length - 1
  while i>=0
    if todos[i].completed
      todos.splice i, 1
      valid = false
    i--

  if !valid
    save todos
    app.update()

#######################################################################################################################
# view

onBlur = (event) ->
  node = event.target
  value = node.value
  editingTodo.title = value
  if !value
    return
  else
    todos.push(editingTodo)
    editingTodo = {title:'', completed:false}
    save todos
    app.update()
    return
todoHeader = ->
  onChange = (event) ->
    node = event.target
    value = node.value
    console.log('edit todo title:', node, node.value);
    editingTodo.title = value
    app.update()
    return

  ['header#header',{key:1}
    ['h1', "todos"]
    ['form#todo-form',
     ['text#new-todo', {value:editingTodo.title, onChange, onBlur, key:2}]
    ]
  ]


todoEditArea = ->
  todos = getTodos()
#  console.log('todos: ', todos)

  todoItems =  todos.map (todo, index) ->
    onChange = ((event) -> todo.title = event.target.value)
    onBlur = (event) ->
      todo.title = event.target.value
      save(todos); editingTodo = {}
      app.update();
    onFocus = ->
      todo = editingTodo
    onKeyUp = onEscapeFn(-> revertEdits(todo))
    onToggle = ->
      console.log('checkbox.toggle onChange')
      debugger
      toggleCompleted(todo)
      return
    ['li', {className: { completed: todo.completed, editing: todo==editingTodo, key:5}},
      ['div#view',
        ['checkbox.toggle', {checked: todo.completed, onChange:onToggle, key:7+index}],
        ['label', {onDoubleClick:( -> editTodo(todo) )}, todo.title],
        ['button.destroy', {onClick:(-> removeTodo(todo))}]]
      ['form', {onClick: -> save todos },
        ['text.edit', { trim:'false', value:todo.title, onBlur, onChange, onFocus, onKeyUp}]]]

  ['section#main',
    ['checkbox.toggle#toggle-all', { key:6, checked: !!allChecked(), onChange: markAll, onClick: -> 'click toggle all'}]
    ['label', {htmlFor: "toggle-all"},  "Mark all as complete"]
    ["ul#todo-list", todoItems...],
    ["footer#footer", {$show:todos.length},
      ["span#todo-count", ['strong',remainingCount()],   pluralize(remainingCount(), ' item'),  ' left'],
      ["ul#filters",
        ['li', ['a', {className: {selected: viewStatusHash != 'active' && viewStatusHash != 'completed'}, href: "#/all"}, "All"]]
        ['li', ['a', {className: {selected: viewStatusHash == 'active'}, href: "#/active"}, "Active"]]
        ['li', ['a', {className: {selected: viewStatusHash == 'completed'}, href: "#/completed"}, "Completed"]]]]

    ['button#clear-completed', {onClick: clearCompletedTodos, $show: !!completedCount()},
      "Clear completed: "+completedCount()]]

todoFooter = ['footer#info', {key:2},
  ['p', "Double-click to edit a todo"]
  ['p', 'Created by ',
    ['a', {href:"http://github.com/taijiweb/domcom"},
      'Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)']]
  ['p', "Part of ",
    ['a', {href:"http://todomvc.com"},
      " TodoMVC"]]]

view = ->
  ['section#todoapp', {key:0},
    todoHeader()
    todoEditArea()
    todoFooter
  ]
app = dc({view})

window.updateHash = ->
  locationHash = document.location.hash
  if locationHash.indexOf('/') >= 0
    viewStatusHash = locationHash.split('/')[1] || ''
  else
    viewStatusHash = locationHash

#######################################################################################################################
# run the app

window.runTodoMvc = ->
  updateHash()
  app.mount('#todo-app')

  window.addEventListener 'hashchange',  ->
    updateHash()
    app.update()
