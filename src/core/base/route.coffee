###
  route '...', ((match, route) ->
          ...
          route ...),
      ...
      otherwise
      baseIndex

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

module.exports = route = (routeList..., otherwise, baseIndex=0) ->
  if typeof baseIndex == 'function'
    routeList.push otherwise
    routeList.push baseIndex
    otherwise = null
    baseIndex = 0
  else if isComponent(baseIndex)
    routeList.push otherwise
    otherwise = baseIndex
    baseIndex = 0
  else baseIndex = baseIndex >>> 0
  len = routeList.length
  if !isEven(len) then throw new Error 'route parameter error: missing matched handler'
  if len<2 or typeof routeList[len-1] != 'function'
    throw new Error 'route parameter error:\n  expect route(pattern, handler, pattern, handler, ..., otherwise, baseIndex)'
  routeList2 = []; i = 0
  while i<len
    routeList2.push [routeList[i], routeList[i+1]]
    i += 2
  new Router(routeList2, otherwise, baseIndex)

route.to = (path) ->

route.Router = class Router extends TransformComponent
  constructor: (routeList, otherwise, baseIndex) ->
    for patternRoute in routeList
      patternRoute[0] = getRoutePattern(patternRoute[0])
    @getContent = ->
      path = @getPath()
      for item in routeList
        if component=processRouteItem(item, path, baseIndex) then return component
      otherwise? and toComponent otherwise

  getPath: ->
    if window.history and window.history.pushState
      decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '')  # remove GET parameters
    else if match = location.href.match(/#(.*)$/) then match[1] else ''

route._processRouteItem = processRouteItem = (patternRoute, path, baseIndex) ->
  if patternRoute.length==3 then [pattern, test, handler] = patternRoute
  else [pattern, handler] = patternRoute
  match = matchRoute(pattern, path, baseIndex)
  if !match or (test and !test(match, location)) then return
  _route = (routeList..., otherwise, baseIndex=match.base) ->
    route(routeList..., otherwise, baseIndex)
  _route.to = (path) ->
  toComponent handler match, _route

rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/
slashs = /(?:\/\/)|(?:\/\()|(?:\/\))/

route._getRoutePattern = getRoutePattern = (pattern) ->
  if pattern.match slashs  then new Error 'should not include "\\/", "\\(", "\\)" in pattern'
  if pattern=='' then segments = []
  else segments = pattern.split('/')  # '' at head or end will be processed in the loop
  upCount = 0; absolute = false; atHead = true; endSlash = false; moreComing = false
  segmentPatterns = []; parameters = {}; len = segments.length
  i = 0
  while i<len
    segment = segments[i++]
    if segment=='.'
      if atHead then continue
      else throw new Error 'route pattern error: do not use ./ pattern except the start'
    else if segment=='..'
      if atHead then  upCount++; continue
      else throw new Error 'route pattern error: do not use ../ except the start'
    else if segment==''
      if atHead then  absolute = true
      else if i==len then endSlash = true
      else throw new Error 'route pattern error: do not use ../ except the start'
    else if segment=='*' then segmentPatterns.push('*')
    else if segment=='**'
      if i==len then moreComing = true
      else throw new Error 'route pattern error: do not use ** except the last segment'
    else
      pieces = []; segmentIndex = 0
      while segment
        m = segment.match rePattern
        if !m then new Error 'route pattern error: '+rePattern
        if m[2] #:param(...)
          param = m[3]
          if parameters[param] then new Error 'route pattern error: repeated parameter name'
          if m[4] then pieces.push({parameter: m[3], pattern: new Regexp('^'+m[4].slice(1, m[4].length-1))})
          else pieces.push({parameter: m[3], pattern:/^\w+/})
        else if m[5] then pieces.push({pattern:new Regexp('^'+m[5])}) #(regexp...)
        else pieces.push({pattern:m[6]}) #string...
        segment = segment.slice(m[1].length)
        segmentIndex++
      segmentPatterns.push pieces
    atHead = false
  {segmentPatterns, absolute, upCount, endSlash, moreComing}

route._matchRoute = matchRoute = (pattern, path, baseIndex) ->
  if pattern.endSlash and path[path.length-1]!='/' then return
  if pattern.absolute then baseIndex = 0
  else baseIndex -= pattern.upCount
  if path=='/' or path=='' then pathSegments = []
  else
    pathSegments = path.split('/')
    if path[0]=='' then pathSegments.shift()
  len = pathSegments.length
  base = baseIndex
  params = {}; items = []; segmentList = []
  for segmentPattern, i in pattern.segmentPatterns
    if base>=len then return
    if segmentPattern=='*' then base++; continue
    segmentStr = pathSegment = pathSegments[base]
    matchIndex = 0
    for piece in segmentPattern
      piecePattern = piece.pattern
      if typeof piecePattern == 'string'
        if pathSegment.indexOf(piecePattern) == 0
          pathSegment = pathSegment.slice(piecePattern.length)
          matchIndex += piecePattern.length
        else break
      else
        if m=pathSegment.match(piecePattern)
          if piece.param
            params[piece.param] = m
          else items.push m
          matchIndex += m[0].length
        else break
    if matchIndex!= segmentStr.length then return
    segmentList.push segmentStr
    base++
  if base!=len and !pattern.moreComing then return
  basePath = '/'+pathSegments.slice(0, baseIndex+1).join('/')+'/'
  leftPath = '/'+pathSegments.slice(base).join('/')
  {items, params, basePath, segmentList, leftPath, base}
