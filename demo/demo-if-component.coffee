{list, if_, text, div, see } = dc

module.exports = ->
  x = see 0, parseNumber
  comp = list(text({onchange: -> x = parseInt(this.value); comp.render()}, x), if_(x, div(1), div(2)))
#  comp = list(text({onchange: -> x = this.value; dc.render()}, (->x)), div(->x))
#  comp = list(number({onchange: -> x = parseInt(this.value); dc.render()}, (->x) ), div(->x), if_((-> x), div(1), div(2)))
  # comp.mount()

module.exports = ->
  x = see 0, parseFloat
  comp = list(text({onchange: -> comp.render()}, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')))
