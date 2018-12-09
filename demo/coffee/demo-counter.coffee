export default  module.exports = ->
  timer = null

  view = ->
    comp = this
    start = =>
      startCounter()
      return
    stop = =>
      stopCounter()
    reset = =>
      stopCounter()
      comp.count = 0

    ['div', {onClick: -> clearInterval countHandle},
      ['p', this.count],
      ['p', {onClick: stop}, 'stop'],
      ['p', {onClick: reset}, 'reset'],
      ['p', {onClick: start}, 'start']
    ]
  comp = dc({view, count:0})
  startCounter = ->
    timer = setInterval (-> comp.count++), 1
    return

  startCounter()

  stopCounter = ->
    clearInterval timer

  return comp
