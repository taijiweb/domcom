{list,
text, div, p, see, flow} = dc

toggle = flow.toggle

export default  ->
  x = see true
  comp = list(
    div({ onclick: ->
        toggle(x)
        comp.render()
      }, 'show/hide by changing style.display'
    ),
    p({
      class:{},
      style:{ display: ->
        if x()
          'block'
        else
          'none'
      }
    }, 'asdfdfs')
  )
  #comp.mount()

