{list, if_, text, div, see } = dc

module.exports = ->
  x = see 0, parseNumber
  comp = list(text({onchange: -> x = parseInt(@value); comp.update()}, x), if_(x, div(1), div(2)))
#  comp = list(text({onchange: -> x = @value; comp.update()}, (->x)), div(->x))
#  comp = list(number({onchange: -> x = parseInt(@value); comp.update()}, (->x) ), div(->x), if_((-> x), div(1), div(2)))
  # comp.mount()

module.exports = ->
  x = see 0, parseFloat
  comp = list(text({onchange: -> comp.update()}, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')))
