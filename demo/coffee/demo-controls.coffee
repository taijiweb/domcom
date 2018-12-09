export default module.exports = ->
  view = ['div', ['checkbox','a'], ['text', 'a'],['checkbox', 'b'], ['text', 'b']]
  return dc({view, a:true, b:true})