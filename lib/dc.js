var DomNode, addRenderUpdate, addSetIntervalUpdate, dc, dcid, directiveRegistry, domNodeCache, isComponent, isElement, isEven, newDcid, querySelector, raf, readyFnList, render, renderCallbackList, renderLoop, requestAnimationFrame, _ref, _ref1, _ref2, _renderComponentWhenBy;

DomNode = require('./DomNode');

_ref = require('./dom-util'), requestAnimationFrame = _ref.requestAnimationFrame, raf = _ref.raf, isElement = _ref.isElement;

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

window.dcid = newDcid();

dcid = document.dcid = newDcid();

window.$document = dc.$document = domNodeCache[dcid] = new DomNode(document);

dcid = document.body.dcid = newDcid();

window.$body = dc.$body = domNodeCache[dcid] = new DomNode(document.body);

dc.onReady = function(callback) {
  return readyFnList.push(callback);
};

dc.offReady = function(callback) {
  return readyFnList.indexOf(callback) >= 0 && readyFnList.splice(index, 1);
};

dc.ready = function() {
  var callback, _i, _len;
  for (_i = 0, _len = readyFnList.length; _i < _len; _i++) {
    callback = readyFnList[_i];
    callback();
  }
};

document.addEventListener('DOMContentLoaded', dc.ready, false);

dc.render = render = function() {
  var callback, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = renderCallbackList.length; _i < _len; _i++) {
    callback = renderCallbackList[_i];
    _results.push(callback());
  }
  return _results;
};

dc.onRender = function(callback) {
  return renderCallbackList.push(callback);
};

dc.offRender = function(callback) {
  return renderCallbackList.indexOf(callback) >= 0 && renderCallbackList.splice(index, 1);
};

dc.renderLoop = renderLoop = function() {
  requestAnimFrame(renderLoop);
  render();
};

dc.updateWhen = function(components, events, updateList, options) {
  return dc._renderWhenBy('update', components, events, updateList, options);
};

dc.renderWhen = function(components, events, updateList, options) {
  return dc._renderWhenBy('render', components, events, updateList, options);
};

dc._renderWhenBy = function(method, components, events, updateList, options) {
  var component, event, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n;
  if (components instanceof Array) {
    if (!(updateList instanceof Array)) {
      updateList = [updateList];
    }
    if (events instanceof Array) {
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        component = components[_i];
        for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
          event = events[_j];
          _renderComponentWhenBy(method, component, event, updateList);
        }
      }
    } else {
      for (_k = 0, _len2 = components.length; _k < _len2; _k++) {
        component = components[_k];
        _renderComponentWhenBy(method, component, events, updateList);
      }
    }
  } else if (components === setInterval) {
    if (isComponent(events)) {
      addSetIntervalUpdate(method, events, updateList);
    } else if (events instanceof Array) {
      for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
        component = events[_l];
        addSetIntervalUpdate(method, events, updateList);
      }
    } else if (typeof events === 'number') {
      options = options || {};
      options.interval = events;
      addSetIntervalUpdate(method, updateList, options);
    }
  } else if (components === render) {
    if (isComponent(events)) {
      addRafUpdate(method, events, updateList);
    } else if (events instanceof Array) {
      for (_m = 0, _len4 = events.length; _m < _len4; _m++) {
        component = events[_m];
        addRafUpdate(method, events, updateList);
      }
    }
  } else if (events instanceof Array) {
    if (!(updateList instanceof Array)) {
      updateList = [updateList];
    }
    for (_n = 0, _len5 = events.length; _n < _len5; _n++) {
      event = events[_n];
      _renderComponentWhenBy(method, components, event, updateList);
    }
  } else {
    if (!(updateList instanceof Array)) {
      updateList = [updateList];
    }
    _renderComponentWhenBy(method, components, events, updateList);
  }
};

_renderComponentWhenBy = function(method, component, event, updateList, options) {
  var comp, i, item, _i, _len;
  if (event.slice(0, 2) !== 'on') {
    event = 'on' + event;
  }
  if (options) {
    options.method = method;
    component.eventUpdateConfig[event] = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = updateList.length; _i < _len; _i++) {
        comp = updateList[_i];
        _results.push([comp, options]);
      }
      return _results;
    })();
  } else {
    for (i = _i = 0, _len = updateList.length; _i < _len; i = ++_i) {
      item = updateList[i];
      updateList[i] = isComponent(item) ? [
        item, {
          method: method
        }
      ] : item;
    }
    component.eventUpdateConfig[event] = updateList;
  }
};

addSetIntervalUpdate = function(method, component, options) {
  var callback, clear, handler, interval, test;
  handler = null;
  test = options.test, interval = options.interval, clear = options.clear;
  callback = function() {
    if (!test || test()) {
      component[method]();
    }
    if (clear && clear()) {
      return clearInterval(handler);
    }
  };
  return handler = setInterval(callback, interval || 16);
};

addRenderUpdate = function(method, component, options) {
  var callback, clear, test;
  test = options.test, clear = options.clear;
  callback = function() {
    if (!test || test()) {
      component[method]();
    }
    if (clear && clear()) {
      return dc.offRender(callback);
    }
  };
  return dc.onRender(callback);
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
