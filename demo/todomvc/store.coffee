module.exports =
  fetch: -> JSON.parse(localStorage.getItem('dc') || '[]')
  save: (todos) ->
    localStorage.setItem('dc', JSON.stringify(todos))