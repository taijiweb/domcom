var Tag, delegateToComponentHandler, delegateToHolderHandler, delegateToMethodHandler;

Tag = require('../components/Tag');

// delegate to component.prefix_XXX method
delegateToMethodHandler = function(prefix = 'do_') {
  return function(event) {
    var targetComponent, targetNode;
    targetNode = event.target;
    targetComponent = targetNode.component;
    return targetComponent[prefix + event.type](event);
  };
};

// delegate until holder...holder.do_XXX method
delegateToHolderHandler = function(prefix) {
  return function(event) {
    var handler, method, targetComponent, targetNode;
    targetNode = event.target;
    targetComponent = targetNode.component;
    method = prefix + event.type;
    while (targetComponent) {
      handler = targetComponent[method];
      if (handler) {
        handler.call(targetComponent, event);
        if (event.continueDelegating) {
          targetComponent = targetComponent.holder;
        } else {
          break;
        }
      } else {
        targetComponent = targetComponent.holder;
      }
    }
  };
};

// delegate to the given component.prefix_XXX method
delegateToComponentHandler = function(component, prefix) {
  return function(event) {
    var handler;
    if (handler = component[prefix + event.type]) {
      handler.call(component, event);
    }
  };
};

// delegate to component.prefix_XXX method
Tag.prototype.delegate = function(events, delegationHandler) {
  if (typeof delegationHandler !== 'function') {
    delegationHandler = delegateToMethodHandler(delegationHandler);
  }
  return this.bind(events, delegationHandler);
};

// delegate until holder...holder.prefix_XXX method
Tag.prototype.delegateToHolder = function(events, prefix = 'do_') {
  var delegationHandler;
  delegationHandler = delegateToHolderHandler(prefix);
  return this.bind(events, delegationHandler);
};

// delegate to the given component.prefix_XXX method
Tag.prototype.delegateToComponent = function(events, component, prefix = 'do_') {
  var delegationHandler;
  delegationHandler = delegateToComponentHandler(component, prefix);
  return this.bind(events, delegationHandler);
};
