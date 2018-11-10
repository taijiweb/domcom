#export default
module.exports = exports = {}

exports.newDemoNode = (id) ->
  node = document.createElement('div')
  document.body.appendChild(node)
  id && node.setAttribute('id', id)
  node

exports.fakeEvent = (targetNode, type='click', keyCodeOrOptions) ->
  if typeof keyCodeOrOptions == 'number'
    {
      target:targetNode
      type
      keyCode: keyCodeOrOptions
      preventDefault: ->
      stopPropagation: ->
    }
  else
    Object.assign(
      {
        target: targetNode
        type
        preventDefault: ->
        stopPropagation: ->
      },
      keyCodeOrOptions
    )

export default exports