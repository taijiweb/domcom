var Tag, delegateToComponentHandler, delegateToHolderHandler, delegateToMethodHandler;

Tag = require('../base/Tag');

delegateToMethodHandler = function(prefix) {
  if (prefix == null) {
    prefix = 'do_';
  }
  return function(event) {
    var targetComponent, targetNode;
    targetNode = event.target;
    targetComponent = targetNode.component;
    return targetComponent[prefix + event.type](event);
  };
};

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

delegateToComponentHandler = function(component, prefix) {
  return function(event) {
    var handler;
    if (handler = component[prefix + event.type]) {
      handler.call(component, event);
    }
  };
};

Tag.prototype.delegate = function(events, delegationHandler) {
  if (typeof delegationHandler !== 'function') {
    delegationHandler = delegateToMethodHandler(delegationHandler);
  }
  return this.bind(events, delegationHandler);
};

Tag.prototype.delegateToHolder = function(events, prefix) {
  var delegationHandler;
  if (prefix == null) {
    prefix = 'do_';
  }
  delegationHandler = delegateToHolderHandler(prefix);
  return this.bind(events, delegationHandler);
};

Tag.prototype.delegateToComponent = function(events, component, prefix) {
  var delegationHandler;
  if (prefix == null) {
    prefix = 'do_';
  }
  delegationHandler = delegateToComponentHandler(component, prefix);
  return this.bind(events, delegationHandler);
};
