{list, if_, text, div, see2 } = dc

module.exports = ->
  x = see2 0, parseInt
  comp = list(text({onchange: -> x = parseInt(@value); comp.update()}, x), if_(x, div(1), div(2)))
#  comp = list(text({onchange: -> x = @value; comp.update()}, (->x)), div(->x))
#  comp = list(number({onchange: -> x = parseInt(@value); comp.update()}, (->x) ), div(->x), if_((-> x), div(1), div(2)))
  # comp.mount()
