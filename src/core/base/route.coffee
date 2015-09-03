###
  route '...', (match) ->
          ...
          route match.base, defaultComponent, routeList
      ...


  # match: {params, items, basePath, segment, leftPath, childBase}
  handler = (match, route) ->
  otherwiseHandler = (route) ->

  :user # yes: .../xxx  no: .../xxx/
  :user/  # yes .../xxx/ no /xxx
  :user:\w+/ # yes: .../xyz
  :user:(a\d*)/**
  :user**
  :user/name=:name
  **
  *
###

TransformComponent = require './TransformComponent'
isComponent = require './isComponent'
toComponent = require './toComponent'
{isEven} = require '../../util'

module.exports = route = (baseIndex, otherwise, routeList...) ->
  if arguments.length<2
    throw new Error 'route parameter error:\n  expect route(pattern, handler, pattern, handler, ..., otherwise, baseIndex)'
  if baseIndex*1==baseIndex
    if typeof routeList[0]=='function'
      routeList.push otherwise
      otherwise = null
    baseIndex = 0
  else if typeof otherwise == 'function'
    routeList.unshift otherwise
    routeList.unshift baseIndex
    otherwise = null
    baseIndex = 0
  len = routeList.length
  if !isEven(len) then throw new Error 'route parameter error: missing matched handler'
  if len<2 or typeof routeList[len-1] != 'function'
    throw new Error 'route parameter error:\n  expect route(pattern, handler, pattern, handler, ..., otherwise, baseIndex)'
  routeList2 = []; i = 0
  while i<len
    routeList2.push [routeList[i], routeList[i+1]]
    i += 2
  new Router(routeList2, otherwise, baseIndex)

route.Router = class Router extends TransformComponent
  constructor: (routeList, otherwise, baseIndex) ->
    for patternRoute in routeList
      patternRoute[0] = getRoutePattern(patternRoute[0])
    @getContent = ->
      for item in routeList
        if component=processRouteItem(item) then return component
      toComponent otherwise

route._processRouteItem = processPatternRouteItem = (patternRoute, location, baseIndex) ->
  if patternRoute.length==3 then [pattern, test, handler] = patternRoute
  else [pattern, handler] = patternRoute
  match = matchRoute(pattern, location.hash, baseIndex)
  if !match or (test and !test(match, location)) then return
  toComponent handler match, (routeList..., otherwise, baseIndex=match.base) ->
    route(routeList..., otherwise, baseIndex)

rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/
slashs = /(?:\/\/)|(?:\/\()|(?:\/\))/

route._getRoutePattern = getRoutePattern = (pattern) ->
  if pattern.match slashs  then new Error 'should not include "\\/", "\\(", "\\)" in pattern'
  segments = pattern.split('/')
  upCount = 0; absolute = false; atHead = true; endSlash = false; moreComing = false
  segmentPatterns = []
  parameters = {}
  for segment, i in segments
    if segment=='.'
      if atHead then continue
      else throw new Error 'route pattern error: do not use ./ pattern except the start'
    else if segment=='..'
      if atHead then  upCount++
      else throw new Error 'route pattern error: do not use ../ except the start'
    else if segment==''
      if atHead then  absolute = true
      else if i==last then endSlash = true
      else throw new Error 'route pattern error: do not use ../ except the start'
    else if segment=='*' then patterns.push('*')
    else if segment=='**'
      if i==last then moreComing
      else throw new Error 'route pattern error: do not use ** except the last segment'
    else
      pieces = []; segmentIndex = 0
      while segment
        m = segment.match rePattern
        if !m then new Error 'route pattern error: '+rePattern
        if m[2] #:param(...)
          param = m[3]
          if parameters[param] then new Error 'route pattern error: repeated parameter name'
          if m[4] then pieces.push({parameter: m[3], pattern: new Regexp('^'+m[4])})
          else pieces.push({parameter: m[3], pattern:/^\w+/})
        else if m[5] then pieces.push({pattern:new Regexp('^'+m[5])}) #(regexp...)
        else pieces.push({pattern:m[5]}) #string...
        segment = segment.slice(m[1].length)
        segmentIndex++
      segmentPatterns.push pieces
  {segmentPatterns, absolute, upCount, endSlash, moreComing}

route._matchRoute = matchRoute = (pattern, hash, baseIndex) ->
  if pattern.endSlash and hash[hash.length-1]!='/' then return
  if pattern.absolute then baseIndex = 0
  else baseIndex -= pattern.upCount
  if hash=='/' or hash=='' then hashSegments = []
  else
    hashSegments = hash.split('/')
    if hash[0]=='/' then hashSegments.shift()
  len = hashSegments.length
  base = baseIndex
  params = {}; items = []; segmentList = []
  for pat, i in pattern.segmentPatterns
    if base>=len then return
    if pat=='*' then baseIndex++; continue
    piecePattern = pat.pattern
    hashSegment = hashSegments[baseIndex]
    if typeof piecePattern =='string'
      if hashSegment.indexOf(piecePattern) == 0
        hashSegment = hashSegment.slice(piecePattern.length)
      else return
    else
      if m=hashSegment.match(piecePattern)
        if pat.param then params[pat.param] = m[0]
      else return
    segmentList.push hashSegment
    base++
  if base!=len and !pattern.moreComing then return
  basePath = '/'+hashSegments.slice(0, baseIndex+1).join('/')+'/'
  leftPath = '/'+hashSegments.slice(base).join('/')
  {items, params, basePath, segmentList, leftPath, base}
