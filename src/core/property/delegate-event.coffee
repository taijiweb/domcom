Tag = require('../base/Tag')
DomNode = require('../../DomNode')

exports.makeDelegationHandler = makeDelegationHandler = ->
  (event) ->
    targetNode = event.target
    targetComponent = targetNode.component
    targetComponent['do_'+event.type](event)

Tag.prototype.delegate = DomNode.prototype.delegate =
  (events, delegationHandler=makeDelegationHandler()) ->
    this.bind(events, delegationHandler)

exports.makeHolderDelegationHandler = makeHolderDelegationHandler = ->
  (event) ->
    targetNode = event.target
    targetComponent = targetNode.component
    method = 'do_'+event.type
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

Tag.prototype.delegateByHolder = DomNode.prototype.delegateByHolder =
  (events, delegationHandler=makeHolderDelegationHandler()) ->
    this.bind(events, delegationHandler)


makeComponentDelegationHandler = (component) ->
  (event) ->
    if handler = component['do_'+event.type]
      handler.call(component, event)
    return

Tag.prototype.delegateByComponent = DomNode.prototype.delegateByComponent =
  (events, component) ->
    this.bind(events, makeComponentDelegationHandler(component))
