var DomNode, addEventListener, dc, directiveRegistry, extend, isComponent;

extend = require('extend');

DomNode = require('./DomNode');

addEventListener = require('./dom-util').addEventListener;

isComponent = require('./core/base/isComponent');

module.exports = dc = function(element, all) {
  if (typeof element === 'string') {
    if (all) {
      return dc(document.querySelectorAll(element));
    } else {
      return dc(document.querySelector(element));
    }
  } else if (element instanceof Node) {
    if (element.component) {
      return element.component;
    } else {
      return new DomNode(element);
    }
  } else if (element instanceof NodeList || element instanceof Array) {
    return new DomNode(element);
  } else {
    throw new Error('error type for dc');
  }
};

dc.toString = function() {
  return 'domcom';
};

dc.directiveRegistry = directiveRegistry = {};

dc.clearDirectives = function() {
  return dc.directiveRegistry = directiveRegistry = {};
};

dc.directives = function(directiveName, directiveHandlerGenerator) {
  var generator, name, _results;
  if (arguments.length === 1) {
    _results = [];
    for (name in directiveName) {
      generator = directiveName[name];
      if (name[0] !== '$') {
        name = '$' + name;
      }
      _results.push(directiveRegistry[name] = generator);
    }
    return _results;
  } else {
    if (directiveName[0] !== '$') {
      directiveName = '$' + directiveName;
    }
    return directiveRegistry[directiveName] = directiveHandlerGenerator;
  }
};

if (typeof window !== 'undefined') {
  window.$document = dc.$document = new DomNode(document);
}

dc.ready = function() {
  if (dc.listeners['ready']) {
    dc.emit('ready');
  }
};

if (typeof window !== 'undefined') {
  addEventListener(document, 'DOMContentLoaded', dc.ready, false);
  addEventListener(document, 'DOMContentLoaded', function() {
    return window.$body = dc.$body = new DomNode(document.body);
  });
}

extend(dc, require('./dc-event'));
