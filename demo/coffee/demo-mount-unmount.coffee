{list, div, see, if_} = dc

export default  ->
  active = see true
  list(
    div(
      {
        onclick: ->
          active true
          if1.render()
    },
      'mount'
    ),
    div(
      {
        onclick: ->
          active false
          if1.render()
          dc.clean()
      },
      'unmount'
    ),
    if1 = if_(active, div('toggle me'))
  )
