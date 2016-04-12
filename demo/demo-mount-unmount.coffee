{list, div, see, if_} = dc

module.exports = ->
  active = see true
  comp = list(
    div({ onclick: ->
            active true
            div1.render()
    }, 'mount'),
    div({ onclick: ->
      active false;
      div1.render()
    }, 'unmount'),
    div1 = if_(active, div('toggle me'))
  )
