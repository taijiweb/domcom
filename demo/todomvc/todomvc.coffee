{bindings, si, bi,
section, h1, header, form, text, checkbox, div, ul, li, p, a, label, button, footer, strong, span
repeat, txt
show
extend} = dc

# store
fetch = -> (JSON.parse(localStorage.getItem('dc') || '[]')).filter((todo) -> todo)
save = (todos) -> localStorage.setItem('dc', JSON.stringify(todos.filter((todo) -> todo)))

# model
# [ { title: string, completed: boolean } ... ]
todos = []

# controller
viewStatusHash = null
editingTodo = null
originalTodo = null
reverted = null
saving = false

getTodos = ->
  if viewStatusHash=='active' then todos.filter((todo) -> todo and !todo.completed)
  else if viewStatusHash=='completed' then todos.filter((todo) -> todo and todo.completed)
  else todos.filter((todo) -> todo)

remainingCount = -> todos.filter((todo) -> !todo.completed).length
completedCount = -> todos.length - remainingCount()
allChecked = -> !remainingCount()

onEscapeFn = (fn) -> (event) -> if event.keyCode==27 or event.which==27  then fn()

pluralize = (test, item) ->
  if typeof test == 'function'
    txt(->if test()>1 then item+'s' else item)
  else if test>1 then txt(item+'s') else txt(item)

toggleCompleted = (todo) ->
  todo.completed = !todo.completed
  save(todos)
  view.update()

markAll = ->
  if allChecked() then completed = false
  else completed = true
  needUpdate = false
  for todo in todos
    if todo.completed!=completed
      todo.completed = completed
      needUpdate = true
  if needUpdate
    save(todos)
    view.update()

editTodo = (todo) ->
  editingTodo = todo
  originalTodo = extend({}, todo)
  view.update()

removeTodo = (todo) ->
  index = todos.indexOf(todo)
  todos.splice(index, 1)
  save(todos)
  view.update()

revertEdits = (todo) ->
  todos[todos.indexOf(todo)] = originalTodo
  view.update()

clearCompletedTodos = ->
  needUpdate = false
  i = todos.length-1
  while i>=0
    if todos[i].completed
      todos.splice(i)
      needUpdate = true
    i--
  if needUpdate
    save(todos)
    view.update()

setView = (locationHash) ->
  viewStatusHash =  locationHash.split('/')[1] || ''
  view.update()

# view
todoHeader = header({id:"header"}
  h1("todos")
  form({id:"todo-form"},
    text({
      id:"new-todo",
      placeholder:"What needs to be done?"
      disable: -> saving
      onchange: ->
        if (!@value) then return
        todos.push({title:@value, completed:false})
        save(todos)
        view.update()
      autofocus:true})
  )
)

todoItems = repeat(getTodos, (todo, index) ->
  window.todoItemComp = li({className:{ completed: (-> todo.completed), editing: -> todo==editingTodo}},
    div({class:"view"},
      checkbox({className:"toggle",checked: (-> todo and todo.completed), onchange:(-> toggleCompleted(todo))})
      label({ondblclick:(-> editTodo(todo))}, (-> todo and todo.title))
      button({className:"destroy", onclick:(-> removeTodo(todo))})
    )
    form({submit:->save(todos)}
      text({
        className:"edit", trim:"false", value:si(todo, "title"),
        onblur:(-> todo.title = @value; save(todos); editingTodo = null; view.update()),
        onfocus:(-> todo == editingTodo)
        onkeyup: onEscapeFn(-> revertEdits(todo))
      })
    )
  )
)

todoEditArea = section({id:"main", directives:show(-> todos.length)}
  checkbox({
    id: "toggle-all",
    className:"toggle",
    checked: -> !!allChecked()
    onclick: markAll
  })
  label({"for":"toggle-all"}, "Mark all as complete")
  ul({id:"todo-list"}, todoItems)
  footer({id:"footer", directives:show(-> todos.length)},
    span({id:"todo-count"}, strong(remainingCount), pluralize(remainingCount, ' item'), ' left')
    ul({id:"filters"}
      li(a({className:{selected: viewStatusHash == ''}, href:"#/all"}, "All"))
      li(a({className:{selected: viewStatusHash == 'active'}, href:"#/active"}, "Active"))
      li(a({className:{selected: viewStatusHash == 'completed'}, href:"#/completed"}, "Completed"))
    )
    button({id:"clear-completed", onclick:clearCompletedTodos, directives: show(completedCount) }, txt(-> "Clear completed: "+completedCount()))
  )
)

todoFooter = footer(id:"info",
  p("Double-click to edit a todo")
  p('Created by ', a({href:"http://github.com/taijiweb/domcom"}, ' Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)'))
  p("Part of ", a({href:"http://todomvc.com"}, " TodoMVC"))
)

view = section({id:"todoapp"},
  todoHeader
  todoEditArea
  todoFooter
)

# run the app
module.exports = window.runTodoMvc = ->
  todos = fetch()
  view.mount('#todo-app')
  setView(document.location.hash)
  window.addEventListener 'hashchange',  ->
    setView(document.location.hash)
    view.update()
