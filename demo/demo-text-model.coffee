export default  module.exports = ->
  view = -> ['div', ['text', {$model:'a', key:1, ref:(el)->comp.textInput = el}], ['p', {}, this.a]]
  comp = dc({view, a:'hello'})
  comp.on 'updated', ->
    comp.textInput.focus()
    return
