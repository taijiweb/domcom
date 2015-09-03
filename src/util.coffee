exports.isArray = (exp) -> Object.prototype.toString.call(exp) == '[object Array]'

exports.cloneObject = (obj) ->
  result = Object.create(null)
  for key of obj
    result[key] = obj[key]
  result

exports.pairListDict = (list...) ->
  if list.length==1 then list = list[0]
  len = list.length; i = 0; result = Object.create(null)
  while i<len then result[list[i]] = list[i+1]; i += 2
  result

exports.listToDict = (list...) ->
  if list.length==1 then list = list[0]
  result = Object.create(null)
  for item in list then result[item] = true
  result

exports.dupStr = dupStr = (str, n) ->
  s = ''
  i = 0
  while i++<n then s += str
  s

exports.newLine = (str, indent, noNewLine) ->
  if typeof str == 'number'
    if indent then ''  #str means indent, indent means noNewLine
    else '\n'+dupStr(' ', str)
  else
    if typeof indent == 'number'
      if noNewLine then str
      else '\n' + dupStr(' ', indent) + str
    else
      if indent then str #indent means noNewLine
      else '\n' + dupStr(' ', indent) + str

exports.funcString = (fn) ->
  if typeof fn != 'function'
    if !fn? then return 'null'
    if fn.getBaseComponent then return fn.toString()
    else
      try return JSON.stringify(fn)
      catch e then return fn.toString()
  s = fn.toString()
  if fn.invalidate then return s
  if s.slice(0, 12)=="function (){" then s = s.slice(12, s.length-1)
  else if s.slice(0, 13)=="function () {" then s = s.slice(13, s.length-1)
  else s = s.slice(9)
  s = s.trim()
  if s.slice(0, 7)=='return ' then s = s.slice(7)
  if s[s.length-1]==';' then s = s.slice(0, s.length-1)
  'fn:'+s

globalDcid = 1
exports.newDcid = -> globalDcid++

exports.isEven = (n) ->
  if n<0 then n = -n
  while n>0 then n -= 2
  return n==0