slice = [].slice

stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

#export default
exports = {}

stacktraceMessage = (message, stackIndex = 1) ->
  if message
    if !dcError.prodution
      console.log(message)
    message += ':\n'
  else
    message = ""

  error = new Error()
  if !dcError.prodution
    console.log(error)
  stacklist = error.stack.split('\n').slice(3)

  stackIndex = 1
  stacklistLength = stacklist.length
  while stackIndex < stacklistLength
    stackItem = stacklist[stackIndex]
    itemInfo = stackReg.exec(stackItem) || stackReg2.exec(stackItem)
    if itemInfo && itemInfo.length == 5
      method = itemInfo[1]
      file = itemInfo[2]
      line = itemInfo[3]
      pos = itemInfo[4]
      message += file + ':' + line + ':' + pos + ':' + method + '\n'
    stackIndex++

  message

exports.DomcomError = class DomcomError extends Error
  constructor: (@message, @component) ->
    super()

  toString: ->
    if this.component
      this.component.toString()+'\n'+this.message
    else
      this.message

exports.error = dcError = (message, component) ->
  message = stacktraceMessage(message, 2)
  throw new DomcomError(message, component)

exports.onerror = (message, component) ->
  if message instanceof DomcomError
    console.log(message)
    throw new Error(message.message)
  else if message instanceof Error
    throw message
  else
    if component
      console.log(component)
      console.log(message)
    else
      console.log(message)
    throw new Error(message + ':\n' + stacktraceMessage())

export default exports