exports.initChildren = (component, children) ->
  if isComponent(children)
    children = [children]

  family = component.family

  for child, i in children
    children[i] = child = toComponent(child)
    checkConflictOffspring(family, child)
    child.holder = component
    dcidIndexMap[child.dcid] = i
  component.children = children

exports.createChildrenDom = (component) ->
  node = component.childNodes
  component.invalidIndexes = []
  component.removedChildren = {}
  {children} = component

  index = children.length-1
  firstNode = null
  while index>=0
    child = children[index]
    if child.holder!=component
      child.invalidate()
      child.holder = component
    child.renderDom()
    node.unshift(child.node)
    firstNode = child.firstNode or firstNode
    index and children[index-1].nextNode = firstNode or child.nextNode
    index--

  component.childFirstNode = firstNode

  node

exports.updateChildrenDom = (component) ->
  {invalidIndexes} = component

  if invalidIndexes.length

    {children} = component
    component.invalidIndexes = []
    {nextNode, childNodes} = component
    i = invalidIndexes.length-1
    children[children.length-1].nextNode = component.childrenNextNode
    childFirstNode = null
    while i>=0
      listIndex = invalidIndexes[i]
      child = children[listIndex]
      if child.holder!=component
        child.invalidate()
        child.holder = component
      child.renderDom()
      childNodes[listIndex] = child.node
      childFirstNode = child.firstNode or nextNode
      if listIndex
        children[listIndex-1].nextNode = childFirstNode
      i--

    while listIndex >= 0
      child = children[listIndex]
      childFirstNode = child.firstNode or nextNode
      listIndex--
    component.childFirstNode = childFirstNode

  # else null # invalidIndexes == [], do nothing

  for _, child of component.removedChildren
    child.removeDom()
  component.removedChildren = {}

  childNodes
