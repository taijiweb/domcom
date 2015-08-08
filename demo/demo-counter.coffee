{txt, p} = dc

module.exports = ->
  counter = 0
  comp = p(txt( -> counter))
  #comp.mount()
#  counter++
#  comp.update()
#  counter++
#  comp.update()
  count = ->
    counter++
    if counter==1000 then clearInterval countHandle
  update = ->
    comp.update()
    if counter>=1000 then clearInterval updateHandle
  countHandle = setInterval count,  1
  updateHandle = setInterval update,  16
  comp
