var DomNode, Tag, makeComponentDelegationHandler, makeDelegationHandler, makeHolderDelegationHandler;

Tag = require('../base/Tag');

DomNode = require('../../DomNode');

exports.makeDelegationHandler = makeDelegationHandler = function() {
  return function(event) {
    var targetComponent, targetNode;
    targetNode = event.target;
    targetComponent = targetNode.component;
    return targetComponent['do_' + event.type](event);
  };
};

Tag.prototype.delegate = DomNode.prototype.delegate = function(events, delegationHandler) {
  if (delegationHandler == null) {
    delegationHandler = makeDelegationHandler();
  }
  return this.bind(events, delegationHandler);
};

exports.makeHolderDelegationHandler = makeHolderDelegationHandler = function() {
  return function(event) {
    var handler, method, targetComponent, targetNode;
    targetNode = event.target;
    targetComponent = targetNode.component;
    method = 'do_' + event.type;
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

Tag.prototype.delegateByHolder = DomNode.prototype.delegateByHolder = function(events, delegationHandler) {
  if (delegationHandler == null) {
    delegationHandler = makeHolderDelegationHandler();
  }
  return this.bind(events, delegationHandler);
};

makeComponentDelegationHandler = function(component) {
  return function(event) {
    var handler;
    if (handler = component['do_' + event.type]) {
      handler.call(component, event);
    }
  };
};

Tag.prototype.delegateByComponent = DomNode.prototype.delegateByComponent = function(events, component) {
  return this.bind(events, makeComponentDelegationHandler(component));
};
