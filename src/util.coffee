exports.isArray = (exp) -> Object.prototype.toString.call(exp) == '[object Array]'

exports.pairListDict = (list...) ->
  if list.length==1 then list = list[0]
  len = list.length; i = 0; result = Object.create(null)
  while i<len then result[list[i]] = list[i+1]; i += 2
  result

exports.sibind = exports.si = sibind = (model, key) -> -> model[key]

exports.bibind = exports.bi = bibind = (model, key) ->
  fn = (value) ->
    if !arguments.length then model[key]
    else model[key] = value
  fn.setable = true
  fn

exports.bindings =  (model) ->
  result = Object.create(null)
  for key of model
    result['$'+key] = bibind(model, key)
    result['_'+key] = sibind(model, key)
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
    try return JSON.stringify(fn)
    catch e then return fn.toString()
#    if typeof fn == 'object' then return JSON.stringify(fn)
#    else fn.toString()
  s = fn.toString()
  if s.slice(0, 12)=="function (){" then s = s.slice(12, s.length-1)
  else if s.slice(0, 13)=="function () {" then s = s.slice(13, s.length-1)
  else s = s.slice(9)
  s = s.trim()
  if s.slice(0, 7)=='return ' then s = s.slice(7)
  if s[s.length-1]==';' then s = s.slice(0, s.length-1)
  'fn:'+s

