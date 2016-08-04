var renew;

if (typeof window !== 'undefined') {
  exports.normalizeDomElement = function(domElement) {
    if (typeof domElement === 'string') {
      domElement = document.querySelector(domElement);
    }
    return domElement;
  };
}

exports.getBindProp = function(component) {
  var tagName;
  tagName = component.tagName;
  if (!tagName) {
    throw new Error('trying to bind a Component which is not a Tag');
  } else if (tagName === 'input' && component.props.type === 'checkbox') {
    return 'checked';
  } else {
    return 'value';
  }
};

if (typeof window !== 'undefined') {
  if (document.addEventListener) {
    exports.addEventListener = function(node, name, handler, useCapture) {
      node.addEventListener(name, handler, useCapture);
    };
    exports.removeEventListener = function(node, name, handler) {
      node.removeEventListener(name, handler);
    };
  } else {
    exports.addEventListener = function(node, name, handler) {
      node.attachEvent(name, handler);
    };
    exports.removeEventListener = function(node, name, handler) {
      node.detachEvent(name, handler);
    };
  }
  exports.isElement = function(item) {
    if (typeof HTMLElement === "object") {
      return item instanceof HTMLElement;
    } else {
      return item && typeof item === "object" && item !== null && item.nodeType === 1 && typeof item.nodeName === "string";
    }
  };
}

renew = require('lazy-flow').renew;

exports.domField = function(value, component) {
  var fn;
  if (value == null) {
    return '';
  } else if (typeof value !== 'function') {
    if (value.then && value["catch"]) {
      fn = react(function() {
        return fn.promiseResult;
      });
      value.then(function(result) {
        fn.promiseResult = result;
        return fn.invalidate();
      })["catch"](function(error) {
        fn.promiseResult = error;
        return fn.invalidate();
      });
      return fn;
    } else {
      return value;
    }
  } else if (value.bindComponent) {
    return value.bindComponent(component);
  } else if (!value.invalidate) {
    return renew(value);
  } else {
    return value;
  }
};

exports.domValue = function(value, component) {
  if (value == null) {
    return '';
  } else if (typeof value !== 'function') {
    return value;
  } else {
    value = value.call(component);
    if (value == null) {
      return '';
    } else {
      return value;
    }
  }
};

exports.extendChildFamily = function(family, child) {
  var dcid;
  for (dcid in child.family) {
    if (family[dcid]) {
      throw new Error('do not allow to have the same component to be referenced in different location of one List');
    }
    family[dcid] = true;
  }
};
