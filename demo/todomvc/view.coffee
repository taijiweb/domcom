{bindings, si, bi,
section, h1, header, form, text, checkbox, div, ul, li, p, a, label, button, footer, strong, span
repeat, txt} = require 'domcom/src/index'

store = require './store'
{newTodo} = ctr = require './controller'
{todos} = model = require './model'

{$title} = bindings(newTodo)

# dom components

onEscapeFn = (fn) -> (event) -> if event.keyCode==27 or event.which==27  then fn()

newTodoOnChange = ->
  ctr.addTodo()
  store.save(todos)
  view.update()

pluralize = (test, item) ->
  if typeof test == 'function'
    txt(->if test() then item+'s' else item)
  else if test then txt(item+'s') else txt(item)

todoHeader = header({id:"header"}
  h1("todos")
  form({id:"todo-form"},
    text({id:"new-todo", placeholder:"What needs to be done?", value:$title, disable: (-> ctr.saving), onchange:newTodoOnChange, autofocus:""})
  )
)

todoEditArea = section({id:"main", show:(-> todos.length)}
  checkbox({id:"toggle-all", value:bi(ctr, "allChecked"), onclick:(-> ctr.markAll(allChecked))})
  label({"for":"toggle-all"}, "Mark all as complete")
  ul({id:"todo-list"}
    repeat(todos, (todo, index) ->
      li({className:{ completed: (-> todo.completed), editing: -> todo==ctr.editedTodo}},
        div({class:"view"},
          checkbox({className:"toggle",model:bi(todo, 'completed'), onchange:(-> ctr.toggleCompleted(todo))})
          label({ondblclick:(-> ctr.editTodo(todo))}, (-> todo.title))
          button({className:"destroy", onclick:(-> ctr.removeTodo(todo))})
        )
        form({submit:(ctr.saveEdits)}
          text({
              className:"edit", trim:"false", value:si(todo, "title"), onblur:(-> todo.title = @value; store.save(todos)),
              onfocus:(-> todo == editedTodo)
              onkeyup: onEscapeFn(-> ctr.revertEdits(todo))
            })
        )
      )
    )
  )
  footer({id:"footer", show:(-> todos.length)},
    span({id:"todo-count"},
      strong(ctr.remainingCount)
      pluralize((-> ctr.remainingCount), ' item')
      ' left'
    )
    ul({id:"filters"}
      li(a({className:{selected: ctr.status == ''}, href:"#/all"}, "All"))
      li(a({className:{selected: ctr.status == 'active'}, href:"#/active"}, "Active"))
      li(a({className:{selected: ctr.status == 'completed'}, href:"#/completed"}, "Completed"))
    )
    button({id:"clear-completed", onclick:ctr.clearCompletedTodos, show: -> ctr.completedCount }, "Clear completed", ctr.completedCount)
  )
)

todoFooter = footer(id:"info",
  p("Double-click to edit a todo")
  p('Created by ', a({href:"http://github/taijiweb/dc"}, ' Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)'))
  p("Part of ", a({href:"http://todomvc.com"}, " TodoMVC"))
)

module.exports = view = section({id:"todoapp"},
  todoHeader
  todoEditArea
  todoFooter
)
