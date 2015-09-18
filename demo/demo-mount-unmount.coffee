{list, div, see, if_} = dc

module.exports = ->
  active = see true
  comp = list div(onclick: (-> active true; comp.update()), 'mount'),
    div(onclick: (-> active false; comp.update()), 'unmount'),
    div1 = if_ active, div 'toggle me'
