exports.newDemoNode = (id) ->
  node = document.createElement('div')
  document.body.appendChild(node)
  id and node.setAttribute('id', id)
  node