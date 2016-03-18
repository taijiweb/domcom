var DomNode, EventMixn, addEventListener, dc, dcid, directiveRegistry, domNodeCache, extend, isComponent, isElement, isEven, newDcid, querySelector, raf, readyFnList, renderCallbackList, requestAnimationFrame, _ref, _ref1, _ref2;

DomNode = require('./DomNode');

_ref = require('./dom-util'), requestAnimationFrame = _ref.requestAnimationFrame, raf = _ref.raf, isElement = _ref.isElement, addEventListener = _ref.addEventListener;

_ref1 = require('dc-util'), newDcid = _ref1.newDcid, isEven = _ref1.isEven;

_ref2 = require('./config'), domNodeCache = _ref2.domNodeCache, readyFnList = _ref2.readyFnList, directiveRegistry = _ref2.directiveRegistry, renderCallbackList = _ref2.renderCallbackList;

isComponent = require('./core/base/isComponent');


/** @api dc(element) - dc component constructor
 *
 * @param element
 */

module.exports = dc = function(element, options) {
  if (options == null) {
    options = {};
  }
  if (typeof element === 'string') {
    if (options.noCache) {
      return querySelector(element, options.all);
    } else {
      return domNodeCache[element] || (domNodeCache[element] = querySelector(element, options.all));
    }
  } else if (element instanceof Node || element instanceof NodeList || element instanceof Array) {
    if (options.noCache) {
      return new DomNode(element);
    } else {
      if (element.dcid) {
        return domNodeCache[element.dcid];
      } else {
        element.dcid = newDcid();
        return domNodeCache[element.dcid] = new DomNode(element);
      }
    }
  } else {
    throw new Error('error type for dc');
  }
};

querySelector = function(selector, all) {
  if (all) {
    return new DomNode(document.querySelectorAll(selector));
  } else {
    return new DomNode(document.querySelector(selector));
  }
};

if (typeof window !== 'undefined') {
  window.dcid = newDcid();
  dcid = document.dcid = newDcid();
  window.$document = dc.$document = domNodeCache[dcid] = new DomNode(document);
}

dc.ready = function() {
  if (dc.listeners['ready']) {
    dc.emit('ready');
  }
};

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', dc.ready, false);
  addEventListener(document, 'DOMContentLoaded', function() {
    dcid = document.body.dcid = newDcid();
    return window.$body = dc.$body = domNodeCache[dcid] = new DomNode(document.body);
  });
}

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

dc.toString = function() {
  return 'domcom';
};

dc.listeners = {};

extend = require('extend');

EventMixn = require('./dc-event');

extend(dc, EventMixn);
