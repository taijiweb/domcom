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

    ['div',
      ['p', this.count],
      ['p', {onClick: stop, keepid:101}, 'stop'],
      ['p', {onClick: reset, keepid:102}, 'reset'],
      ['p', {onClick: start, keepid:103}, 'start']
    ]
  comp = dc({view, count:0})
  startCounter = ->
    timer = setInterval (-> comp.count++), 300
    return

  startCounter()

  stopCounter = ->
    clearInterval timer

  return comp
