export default module.exports= ->
  list = [1, 2, 3, 4, 5, 6]
  i = 7
  onClick = ->
    list.push i++
    comp.update()
  view = -> ['div', {onClick}, 'click to append: ', this.list.join(' ')]
  comp = dc({view, list})

