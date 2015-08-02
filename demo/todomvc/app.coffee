controller = require './controller'
{todos} = require './model'
store = require './store'
view = require './view'

`
window.$on = function (target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
};
`
initialize = ->
  todos.length = 0
  todos.push.apply(todos, store.fetch())
  controller.setView(document.location.hash)
  view.mount('#todo-app')

module.exports = window.runTodoMvc = ->
  # $on(window, 'load', initialize)
  initialize()

  $on window, 'hashchange',  ->
    controller.setView(document.location.hash)
    view.update()
    #setInterval((-> view.update()), 16)
