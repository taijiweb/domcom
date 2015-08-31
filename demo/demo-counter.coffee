{txt, p, reactive} = dc

module.exports = ->
  reat = reactive(counter = 0)
  comp = p(txt1=txt(react))
  count = ->
    r(counter++)
    if counter==1000 then clearInterval countHandle
  update = ->
    txt1.update()
    if counter>=1000 then clearInterval updateHandle
  countHandle = setInterval count,  1
  dc.updateWhen(window, setInterval, txt1, {interval:16, clear: -> counter>=1000})
  comp
