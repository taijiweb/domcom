export default  module.exports = ->
  view = (data) ->
    if this.display
      display = 'block'
    else
      display = 'none'
    onClick = () =>
      this.display = !this.display

    ['div',
      ['div', { onClick}, 'click to show or hide by changing style.display'],
      ['p', { style:{display}}, 'this is the controlled content']
    ]
  comp = dc({view, display:true})
  return comp

