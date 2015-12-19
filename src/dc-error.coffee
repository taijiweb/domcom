class DomcomError extends Error
  constructor: (@message, @component) ->

  toString: ->
    if @component
      @component.toString()+'\n'+@message
    else
      @message

exports.error = (message, component) ->
  throw new DomcomError(message, component)

exports.onerror = (message, component) ->
  if message instanceof DomcomError
    console.log(message)
    throw new Error(message.message)
  else if message instanceof Error
    throw message
  else
    if comopenent
      console.log(component)
      console.log(message)
    else
      console.log(message)
    throw new Error(message)

