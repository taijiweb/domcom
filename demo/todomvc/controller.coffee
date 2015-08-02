{extend} = require('domcom/src/index')
{todos} = require('./model')
store = require('./store')

exports.newTodo = {title: '', completed:false}
exports.editedTodo = null
exports.status = null

exports.setView = (locationHash) ->
  exports.status =  locationHash.split('/')[1] || ''

exports.remainingCount = -> todos.filter((todo) -> todo.completed == false).length
exports.completedCount = -> todos.length - exports.remainingCount()
exports.allChecked = -> !exports.remainingCount()

exports.addTodo = ->
  if (!exports.newTodo.title) then return
  todos.push(extend(Object.create(null), exports.newTodo))

exports.editTodo = (todo) ->
  exports.editedTodo = todo
  exports.originalTodo = extend(Object.create(null), todo)

exports.save = ->
  store.save(todos)

exports.revertEdits = (todo) ->
  todos[todos.indexOf(todo)] = exports.originalTodo
  exports.editedTodo = null
  exports.originalTodo = null
  exports.reverted = true

exports.removeTodo = (todo) ->
  index = todos.indexOf(todo)
  todos.splice(index)
  store.save(todos)

exports.toggleCompleted = (todo) ->
  todo.completed = !todo.completed
  store.save(todos)

exports.clearCompletedTodos = ->
  i = todos.length-1
  while i>=0
    if todos[i].completed
      todos.splice(i)
    i--

exports.markAll = (completed) ->
  todos.forEach (todo) ->
    if todo.completed != completed then exports.toggleCompleted(todo, completed)
