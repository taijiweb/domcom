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

exports.newLine = (str, indent, addNewLine) ->
  if addNewLine then '\n' + dupStr(' ', indent) + str
  else str

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
  n==0

exports.matchCurvedString = (str, i) ->
  if str[i]!='(' then return
  level = 0
  while ch = str[++i]
    if ch=='\\'
      if !(ch=str[++i]) then return
    else if ch=='(' then level++
    else if ch==')'
      if level==0 then return ++i
      else level--

exports.intersect = (maps) ->
  result = Object.create(null)
  m = maps[0]
  for key of m
    isMember = true
    for m2 in maps[1...]
      if !m2[key]
        isMember = false
        break
    isMember and result[key] = m[key]
  result

exports.substractSet = (from, part) ->
  for key of part then delete from[key]
  from

exports.binarySearch = (item, items) ->
  length = items.length
  if !length then return [0, false]
  if length==1 then return if items[0]>=item then 0 else 1
  start = 0; end = length-1
  while 1
    index = start+Math.floor((end-start)/2)
    if item==items[index] then return index
    else if item==item[index+1] then return index+1
    else if item<items[index] then end = index
    else if item>items[index+1] then start = index+1
    else return index