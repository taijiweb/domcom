elementPool = {}
nodeCount = 0
nodeCountMax = 500
poolLabelLimit = {}

exports.createElement = (namespace = '', tagName = 'div', poolLabel) ->
  if poolLabel
    label = tagName + ':' + poolLabel
    if nodes = elementPool[label]
      node = nodes.pop()
      nodeCount--
      return node
  if namespace
    document.createElementNS(namespace || '', tagName)
  else
    document.createElement(tagName)

exports.cacheElement = (element, poolLabel) ->
  if nodeCount < nodeCountMax
    label = element.tagName.toLowerCase() + ':' + poolLabel
    labelMax = poolLabelLimit[label] || 10
    nodes = elementPool[label] || elementPool[label] = []
    if nodes.length < labelMax
      nodes.push(element)
      nodeCount++
