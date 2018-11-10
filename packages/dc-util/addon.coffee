exports.getCommonRoot = getCommonRoot = (start, stop, root) ->

  if start == stop
    [start, [], []]
  else
    root = root || dc
    holders = {}
    holder = start.holder
    startBranch = []
    while holder && holder != root
      holders[holder.dcid] = holder
      startBranch.unshift(holder)
      holder = holder.holder

    stopBranch = []
    holder = stop.holder
    while holder && holder != root && !holders[holder.dcid]
      stopBranch.unshift(holder)
      holder = holder.holder

    if holder && holder != root
      startBranch = startBranch[startBranch.indexOf(holder)+1...]
    else
      holder = null
      startBranch = []
      stopBranch = []
    [holder, startBranch, stopBranch]

# assume that no TransformComponent is met
# Edit component in tiiji-editor is an example
exports.getComponentsBetween = (start, stop, root) ->
  if start == stop
    [start]
  else
    [top, startBranch, stopBranch] = getCommonRoot(start, stop, root)

    result = []

    leftMissing = false
    holder = startBranch.pop()
    while holder
      index = holder.children.indexOf(start)
      if !leftMissing
        if index != 0
          leftMissing = true
          result.push.apply(result, holder.children[index...])
      else
        result.push.apply(result, holder.children[index+1...])
      start = holder
      holder = startBranch.pop()
    startEndIndex = result.length

    rightMissing = false
    holder = stopBranch.pop()
    while holder
      index = holder.children.indexOf(stop)
      if !rightMissing
        if index != holder.children.length - 1
          rightMissing = true
          result.push.apply(result, holder.children[..index])
      else
        result.splice(startEndIndex, 0, holder.children[...index]...)
      stop = holder
      holder = stopBranch.pop()

    startIndex = top.children.indexOf(start)
    stopIndex = top.children.indexOf(stop)
    if !leftMissing  && !rightMissing
      if startIndex == 0 && stopIndex == top.children.length - 1
        [top]
      else
        top.children[startIndex..stopIndex]
    else
      if !leftMissing
        result.splice(startEndIndex, 0, top.children[startIndex...stopIndex]...)
      else if !rightMissing
        result.push.apply(result, top.children[startIndex + 1..stopIndex])
      else
        result.splice(startEndIndex, 0, top.children[startIndex+1...stopIndex]...)
      result

# assume that no TransformComponent is met
# Edit component in tiiji-editor is an example
exports.splitComponentByBranch = (top, branch) ->
  prevNeighbours = []
  nextNeighbours = []
  while branch.length
    child = branch.pop()
    children = top.children
    length = children.length
    if children.length > 1
      i = 0
      while i < length && children[i] != child
        prevNeighbours.push(children[i])
        i++
      i++
      while i < length
        nextNeighbours.unshift(children[i])
        i++
    top = child
  prevNeighbours.push.apply(prevNeighbours, nextNeighbours)
  prevNeighbours

exports.renderList = (edits) ->
  for edit in edits
    edit.render()
  return