###
  route '...', ((match, route) ->
          ...
          route ...),
      ...
      otherwise
      baseIndex

  # match: {items, basePath, segment, leftPath, childBase}
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

import TranComponent from './TranComponent'
import isComponent from './isComponent'
import toComponent from './toComponent'
import {isEven, matchCurvedString} from 'dc-util'

export default  route = (routeList..., otherwise, baseIndex) -> _route(routeList, otherwise, baseIndex, 0)

_route = (routeList, otherwise, baseIndex, defaultBaseIndex) ->

  if typeof baseIndex == 'function'
    routeList.push otherwise
    routeList.push baseIndex
    otherwise = null
    baseIndex = defaultBaseIndex
  else if isComponent(baseIndex)
    routeList.push otherwise
    otherwise = baseIndex
    baseIndex = defaultBaseIndex
  else if baseIndex && !isComponent(baseIndex) && baseIndex.otherwise
    routeList.push otherwise
    otherwise = baseIndex.otherwise
    baseIndex = defaultBaseIndex
  else
    baseIndex = baseIndex >>> 0
    if otherwise && !isComponent(otherwise) && otherwise.otherwise
      otherwise = otherwise.otherwise

  len = routeList.length
  if !isEven(len) then throw new Error 'route parameter error: missing matched handler'
  if len<2 || typeof routeList[len-1] != 'function'
    throw new Error 'route parameter error:\n  expect route(pattern, handler, pattern, handler, ..., otherwise, baseIndex)'

  routeList2 = []; i = 0
  while i<len
    routeList2.push [routeList[i], routeList[i+1]]
    i += 2

  new Route(routeList2, otherwise, baseIndex)

route._navigateTo = navigateTo = (oldPath, path, baseIndex=0) ->
  path = ''+path
  if path[0] != '/'
    upCount = 0
    while path
      if path[..1]=='./' then path = path[2...]
      else if path[..2]=='../' then path = path[3...]; upCount++
      else break
    baseIndex -= upCount
    if baseIndex<0 then baseIndex = 0
    base = oldPath.split('/').slice(0, baseIndex).join('/')+'/'
    if base=='/' then base = ''
    path = base+path
  else path = path.slice(1) # clear start '/'

navigate = (baseIndex) -> (path) ->
  oldPath =
    if window.history && window.history.pushState
      decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '')  # remove GET params
    else if match=location.href.match(/#(.*)$/) then match[1] else ''

  navigateTo(oldPath, path, baseIndex)

  if window.history && window.history.pushState
    history.pushState(null, null, path)
  else location.href = location.href.replace(/#(.*)$/, '') + '#' + path

  path

route.to = navigate(0)

route.Route = class Route extends TranComponent
  constructor: (@routeList, @otherwise, @baseIndex) ->
    super()

    for patternRoute in routeList
      patternRoute[0] = getRoutePattern(patternRoute[0])

    this.otherwise = toComponent otherwise

    return

  getContentComponent: ->
    path = this.getPath()

    for patternRoute in this.routeList
      if component=processRouteItem(patternRoute, path, this.baseIndex)
        return component

    this.otherwise

  getPath: ->
    if window.history && window.history.pushState
      decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '')  # remove GET params
    else if match=location.href.match(/#(.*)$/) then match[1] else ''

route._processRouteItem = processRouteItem = (patternRoute, path, baseIndex) ->

  [pattern, handler] = patternRoute
  if pattern instanceof Array then [pattern, test] = pattern

  match = matchRoute(pattern, path, baseIndex)
  if !match || (test && !match=test(match, path, baseIndex)) then return

  childRoute = (routeList..., otherwise, baseIndex) -> _route(routeList, otherwise, baseIndex, match.base)
  childRoute.to = navigate(match.base)

  toComponent handler match, childRoute

route._processPiecePatterns = processPiecePatterns = (segmentPattern, params, nonameRegExpIndex) ->
  i = 0; len = segmentPattern.length; pieces = []

  while ch=segmentPattern[i]
    start = i
    if ch==':'
      ch = segmentPattern[++i]
      if !ch.match /[A-Za-z_$]/ then throw new Error "route pattern error: expect a parameter identifier #{segmentPattern}"
      ch = segmentPattern[++i]
      while ch && ch.match /[$\w]/ then ch = segmentPattern[++i]
      if i==start+1 then throw new Error "route pattern error: expect a parameter identifier #{segmentPattern}"
      key = segmentPattern.slice(start+1, i)
      if params[key] then throw new Error 'route pattern error: repeated parameter name'
      else params[key] = true
      if ch=='('
        start = i;
        if i = matchCurvedString(segmentPattern, i)
          if start+1==i-1 then throw new Error 'route pattern error: empty regexp: ()'
          pieces.push {key, pattern: new RegExp(segmentPattern.slice(start+1, i-1))}
          ch = segmentPattern[i]
        else throw new Error 'route pattern error: missing ) for regexp'
      else pieces.push {key, pattern: new RegExp('\\w+')}; ++i
    else if ch=='('
      if i = matchCurvedString(segmentPattern, i)
        if start+1==i-1 then throw new Error 'route pattern error: empty regexp: ()'
        pieces.push {key:nonameRegExpIndex++, pattern: new RegExp(segmentPattern.slice(start+1, i-1)) }
      else throw new Error 'route pattern error: missing ) for regexp'
    else
      ++i
      while (ch=segmentPattern[i]) && ch!=':' && ch!='(' then i++
      pieces.push {pattern: segmentPattern.slice(start, i)}

  [pieces, nonameRegExpIndex]

route._getRoutePattern = getRoutePattern = (pattern) ->
  pattern = ''+pattern

  if pattern.match /\\\//  then new Error 'should not include /\\\// in pattern'
  if pattern=='' then segments = []
  else segments = pattern.split('/')  # '' at head or end will be processed in the loop

  upCount = 0; absolute = false; atHead = true; endSlash = false; moreComing = false
  segmentPatterns = []; params = {}; len = segments.length
  i = 0; nonameRegExpIndex = 0
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
      [pieces, nonameRegExpIndex] = processPiecePatterns(segment, params, nonameRegExpIndex)
      segmentPatterns.push pieces
    atHead = false

  {segmentPatterns, absolute, upCount, endSlash, moreComing}

route._matchRoute = matchRoute = (pattern, path, baseIndex) ->
  if pattern.endSlash && path[path.length-1]!='/' then return

  if pattern.absolute then baseIndex = 0
  else
    baseIndex -= pattern.upCount
    if baseIndex<0 then baseIndex = 0
  if path=='/' || path=='' then pathSegments = []
  else
    pathSegments = path.split('/')
    if path[0]=='' then pathSegments.shift()

  len = pathSegments.length; base = baseIndex
  items = {}; segments = []
  for segmentPattern, i in pattern.segmentPatterns
    if base>=len then return
    if segmentPattern=='*'
      segments.push pathSegments[base]
      base++
      continue
    matchIndex = 0
    segmentStr = pathSegment = pathSegments[base]
    for piece in segmentPattern
      piecePattern = piece.pattern
      if typeof piecePattern == 'string'
        if pathSegment.indexOf(piecePattern) == 0
          pathSegment = pathSegment.slice(piecePattern.length)
          matchIndex += piecePattern.length
        else break
      else
        if m=pathSegment.match(piecePattern)
          items[piece.key] = m
          matchIndex += m[0].length
        else break
    if matchIndex!= segmentStr.length then return
    segments.push segmentStr
    base++

  if base!=len && !pattern.moreComing then return

  basePath = '/'+pathSegments.slice(0, baseIndex+1).join('/')+'/'
  leftPath = '/'+pathSegments.slice(base).join('/')

  {items, basePath, segments, leftPath, base}
