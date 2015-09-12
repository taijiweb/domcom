{txt, p, see} = dc

module.exports = ->
  seeCounter = see(counter = 0)
  comp = p(txt1=txt(seeCounter))
  count = ->
    seeCounter(counter++)
    if counter==1000 then clearInterval countHandle
  countHandle = setInterval count, 1
  dc.updateWhen(setInterval, txt1, {interval:16, clear: -> counter>=1000})
  comp
