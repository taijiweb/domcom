{list, if_, text, div, see } = dc

->
  x = see 0, parseNumber
  comp = list(
    text(
      {
        onchange: ->
          x = parseInt(this.node.value)
          comp.render()
          dc.clean()
      },
      x
    ),
    if_(x, div(1), div(2))
  )
#  comp = list(text({onchange: -> x = this.node.value; comp.render()}, (->x)), div(->x))
#  comp = list(number({onchange: -> x = parseInt(this.node.value); comp.render()}, (->x) ), div(->x), if_((-> x), div(1), div(2)))
  # comp.mount()

export default  ->
  x = see 0, parseFloat
  comp = list(
    text(
      {
        onchange: ->
          comp.render()
          dc.clean()
      },
      x
    ),
    if_(x, div('It is not 0.'), div('It is 0 or NaN.'))
  )
