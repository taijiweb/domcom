{txt, p, see} = dc

export default  ->
  counter$ = see(counter = 0)
  p(txt(counter$))
    .on 'willAttach', ->
      count = ->
        counter$(counter++)
        if counter==1001
          clearInterval countHandle

      countHandle = setInterval count, 1

    .renderWhen(setInterval, 16, {clear: -> counter >= 1000})
