export default  module.exports = ->
  view = -> ['div', ['text', {'#':[dc.model, 'a']}], ['p', {}, this.a]]
  dc({view, a:'hello'})
