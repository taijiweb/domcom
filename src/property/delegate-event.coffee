Tag = require('../component/Tag')

# delegate to component.prefix_XXX method
delegateToMethodHandler = (prefix = 'do_') ->
  (event) ->
    targetNode = event.target
    targetComponent = targetNode.component
    targetComponent[prefix + event.type](event)

# delegate until holder...holder.do_XXX method
delegateToHolderHandler = (prefix) ->
  (event) ->
    targetNode = event.target
    targetComponent = targetNode.component
    method = prefix + event.type
    while targetComponent
      handler = targetComponent[method]
      if handler
        handler.call(targetComponent, event)
        if event.continueDelegating
          targetComponent = targetComponent.holder
        else
          break
      else
        targetComponent = targetComponent.holder
    return

# delegate to the given component.prefix_XXX method
delegateToComponentHandler = (component, prefix) ->
  (event) ->
    if handler = component[prefix + event.type]
      handler.call(component, event)
    return

# delegate to component.prefix_XXX method
Tag.prototype.delegate = (events, delegationHandler) ->
  if typeof delegationHandler != 'function'
    delegationHandler = delegateToMethodHandler(delegationHandler)
  this.bind(events, delegationHandler)

# delegate until holder...holder.prefix_XXX method
Tag.prototype.delegateToHolder = (events, prefix = 'do_') ->
  delegationHandler = delegateToHolderHandler(prefix)
  this.bind(events, delegationHandler)

# delegate to the given component.prefix_XXX method
Tag.prototype.delegateToComponent = (events, component, prefix = 'do_') ->
  delegationHandler = delegateToComponentHandler(component, prefix)
  this.bind(events, delegationHandler)
