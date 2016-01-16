var List, Nothing, Tag, emptyEventCallback, eventHandlerFromArray, exports, extend, flow, flowIf, mergeIf, mergeIfChild, mergeIfChildren, mergeIfClassFn, mergeIfEvents, mergeIfProps;

extend = require('extend');

Tag = require('./base/Tag');

List = require('./base/List');

Nothing = require('./base/Nothing');

eventHandlerFromArray = require('./property').eventHandlerFromArray;

flow = require('lazy-flow/addon');

flowIf = flow.if_;

exports = module.exports = mergeIf = function(test, then_, else_, recursive) {
  var If, children, className, component, elseTransform, events, props, style, thenTransform, transform;
  If = require('./base/If');
  if (then_ === else_) {
    return then_;
  } else if (then_.constructor === Tag && else_.constructor === Tag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
    children = mergeIfChildren(test, then_, else_, recursive);
    component = new Tag(then_.tagName, {}, children);
    className = mergeIfClassFn(test, then_.className, else_.className);
    props = mergeIfProps(test, then_.props, else_.props);
    style = mergeIfProps(test, then_.style, else_.style);
    events = mergeIfEvents(test, then_.events, else_.events, component);
    return component.addClass(className).prop(props).css(style).bind(events);
  } else if (then_.isHtml && else_.isHtml) {
    thenTransform = then_.transform;
    elseTransform = else_.transform;
    transform = function(text) {
      if (test()) {
        return thenTransform && thenTransform(text) || text;
      } else {
        return elseTransform && elseTransform(text) || text;
      }
    };
    return new then_.constructor(flowIf(test, then_.text, else_.text), transform);
  } else if (then_.isText && else_.isText && then_.constructor === else_.constructor) {
    return new then_.constructor(flowIf(test, then_.text, else_.text));
  } else if (then_.isNothing && else_.isNothing) {
    return then_;
  } else if (then_.isList && else_.isList) {
    return new List(mergeIfChildren(test, then_, else_, recursive));
  } else {
    return new If(test, then_, else_);
  }
};

mergeIfChild = function(test, then_, else_, recursive) {
  if (!recursive && (then_.isList || else_.isList)) {
    return if_(test, then_, else_);
  } else {
    return mergeIf(test, then_, else_, recursive);
  }
};

exports.mergeIfChildren = mergeIfChildren = function(test, then_, else_, recursive) {
  var children, elseChildren, elseChildrenLength, elseItem, i, thenChildren, thenChildrenLength, thenItem, _i, _j, _k, _len, _len1, _len2;
  thenChildren = then_.children;
  elseChildren = else_.children;
  thenChildrenLength = thenChildren.length;
  elseChildrenLength = elseChildren.length;
  if (thenChildrenLength === elseChildrenLength) {
    children = new Array(thenChildrenLength);
    for (i = _i = 0, _len = thenChildren.length; _i < _len; i = ++_i) {
      thenItem = thenChildren[i];
      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive);
    }
  } else if (thenChildrenLength < elseChildrenLength) {
    children = new Array(elseChildrenLength);
    for (i = _j = 0, _len1 = thenChildren.length; _j < _len1; i = ++_j) {
      thenItem = thenChildren[i];
      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive);
    }
    while (i < elseChildrenLength) {
      children[i] = mergeIf(test, new Nothing(), elseChildren[i]);
      i++;
    }
  } else {
    children = new Array(thenChildrenLength);
    for (i = _k = 0, _len2 = elseChildren.length; _k < _len2; i = ++_k) {
      elseItem = elseChildren[i];
      children[i] = mergeIfChild(test, thenChildren[i], elseItem, recursive);
    }
    while (i < thenChildrenLength) {
      children[i] = mergeIf(test, thenChildren[i], new Nothing());
      i++;
    }
  }
  return children;
};

mergeIfClassFn = function(test, thenClassName, elseClassName) {
  return mergeIfProps(test, thenClassName.classMap, elseClassName.classMap);
};

mergeIfProps = function(test, thenProps, elseProps) {
  var prop, unified;
  unified = extend({}, thenProps, elseProps);
  for (prop in unified) {
    unified[prop] = flowIf(test, thenProps[prop], elseProps[prop]);
  }
  return unified;
};

emptyEventCallback = function() {};

mergeIfEvents = function(test, thenEvents, elseEvents, component) {
  var elseCallbackList, elseHandler, eventName, thenCallbackList, thenHandler, unified;
  unified = extend({}, thenEvents, elseEvents);
  for (eventName in unified) {
    if (thenCallbackList = thenEvents[eventName]) {
      thenHandler = eventHandlerFromArray(thenCallbackList.slice(0), eventName, component);
    } else {
      thenHandler = emptyEventCallback;
    }
    if (elseCallbackList = elseEvents[eventName]) {
      elseHandler = eventHandlerFromArray(elseCallbackList.slice(0), eventName, component);
    } else {
      elseHandler = emptyEventCallback;
    }
    unified[eventName] = function(event) {
      if (test()) {
        return thenHandler.call(component.node, event, component);
      } else {
        return elseHandler.call(component.node, event, component);
      }
    };
  }
  return unified;
};
