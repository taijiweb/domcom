var List, Nothing, Tag, domEventHandlerFromArray, emptyEventCallback, exports, extend, flow, flowIf, mergeIf, mergeIfChild, mergeIfChildren, mergeIfClassFn, mergeIfEvents, mergeIfProps;

extend = require('extend');

Tag = require('./component/Tag');

List = require('./component/List');

Nothing = require('./component/Nothing');

({domEventHandlerFromArray} = require('./property/events'));

flow = require('lazy-flow/addon');

flowIf = flow.if_;

// do not need toComponent
// do not need check whether test is a function
// because mergeIf is called in If component constructor,
// after then_, else_ was converted to component
// and check test is a function
exports = module.exports = mergeIf = function(test, then_, else_, recursive) {
  var If, children, className, component, elseTransform, events, props, style, thenTransform, transform;
  If = require('./component/If');
  if (then_ === else_) {
    return then_;
  } else if (then_.constructor === Tag && else_.constructor === Tag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
    children = mergeIfChildren(test, then_, else_, recursive);
    component = new Tag(then_.tagName, {}, children);
    className = mergeIfClassFn(test, then_.className, else_.className);
    props = mergeIfProps(test, then_.props, else_.props);
    style = mergeIfProps(test, then_.style, else_.style);
    events = mergeIfEvents(test, then_.domEventCallbackMap, else_.domEventCallbackMap);
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
  // this is for Text, Comment and Cdata
  } else if (then_.isText && else_.isText && then_.constructor === else_.constructor) {
    return new then_.constructor(flowIf(test, then_.text, else_.text));
  } else if (then_ instanceof Nothing && else_ instanceof Nothing) {
    return then_;
  // List component
  } else if (then_.isList && else_.isList) {
    return new List(mergeIfChildren(test, then_, else_, recursive));
  } else {
    return new If(test, then_, else_, false, false, true); // merge, recursive, forceIf
  }
};

mergeIfChild = function(test, then_, else_, recursive) {
  var If;
  if (!recursive && (then_.isList || else_.isList)) {
    // whether another is List or not, then_ and else_ should or could not be merged
    If = require('./component/If');
    return new If(test, then_, else_, false, false, true); // merge, recursive, forceIf
  } else {
    return mergeIf(test, then_, else_, recursive);
  }
};

exports.mergeIfChildren = mergeIfChildren = function(test, then_, else_, recursive) {
  var children, elseChildren, elseChildrenLength, elseItem, i, j, k, l, len, len1, len2, thenChildren, thenChildrenLength, thenItem;
  thenChildren = then_.children;
  elseChildren = else_.children;
  thenChildrenLength = thenChildren.length;
  elseChildrenLength = elseChildren.length;
  if (thenChildrenLength === elseChildrenLength) {
    children = new Array(thenChildrenLength);
    for (i = j = 0, len = thenChildren.length; j < len; i = ++j) {
      thenItem = thenChildren[i];
      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive);
    }
  } else if (thenChildrenLength < elseChildrenLength) {
    children = new Array(elseChildrenLength);
    for (i = k = 0, len1 = thenChildren.length; k < len1; i = ++k) {
      thenItem = thenChildren[i];
      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive);
    }
    while (i < elseChildrenLength) {
      children[i] = mergeIf(test, new Nothing(), elseChildren[i]);
      i++; // if thenChildrenLength > elseChildrenLength
    }
  } else {
    children = new Array(thenChildrenLength);
    for (i = l = 0, len2 = elseChildren.length; l < len2; i = ++l) {
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

mergeIfEvents = function(test, thenEventCallbackMap, elseEventCallbackMap) {
  var elseCallbackList, elseHandler, eventName, thenCallbackList, thenHandler, unified;
  unified = extend({}, thenEventCallbackMap, elseEventCallbackMap);
  for (eventName in unified) {
    if (thenCallbackList = thenEventCallbackMap[eventName]) {
      thenHandler = domEventHandlerFromArray(thenCallbackList.slice(0));
    } else {
      thenHandler = emptyEventCallback;
    }
    if (elseCallbackList = elseEventCallbackMap[eventName]) {
      elseHandler = domEventHandlerFromArray(elseCallbackList.slice(0));
    } else {
      elseHandler = emptyEventCallback;
    }
    unified[eventName] = function(event) {
      if (test()) {
        return thenHandler.call(this, event);
      } else {
        return elseHandler.call(this, event);
      }
    };
  }
  return unified;
};
