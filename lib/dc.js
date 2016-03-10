var DomNode, addEventListener, addRenderUpdate, addSetIntervalUpdate, dc, dcid, dcidIndexMap, directiveRegistry, domNodeCache, isComponent, isElement, isEven, newDcid, nextNodes, parentNodes, querySelector, raf, readyFnList, refreshComponents, removeComponents, render, renderCallbackList, renderComponents, renderLoop, requestAnimationFrame, _ref, _ref1, _ref2, _renderComponentWhenBy;

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

dc.onReady = function(callback) {
  return readyFnList.push(callback);
};

dc.offReady = function(callback) {
  return readyFnList.indexOf(callback) >= 0 && readyFnList.splice(index, 1);
};

dc.ready = function() {
  var callback, e, _i, _len;
  for (_i = 0, _len = readyFnList.length; _i < _len; _i++) {
    callback = readyFnList[_i];
    try {
      callback();
    } catch (_error) {
      e = _error;
      dc.onerror(e);
    }
  }
};

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', dc.ready, false);
  addEventListener(document, 'DOMContentLoaded', function() {
    dcid = document.body.dcid = newDcid();
    return window.$body = dc.$body = domNodeCache[dcid] = new DomNode(document.body);
  });
}

dc.render = render = function() {
  var callback, e, _i, _len;
  for (_i = 0, _len = renderCallbackList.length; _i < _len; _i++) {
    callback = renderCallbackList[_i];
    try {
      callback();
    } catch (_error) {
      e = _error;
      dc.onerror(e);
    }
  }
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
          _renderComponentWhenBy(component, event, updateList);
        }
      }
    } else {
      for (_k = 0, _len2 = components.length; _k < _len2; _k++) {
        component = components[_k];
        _renderComponentWhenBy(component, events, updateList);
      }
    }
  } else if (components === setInterval) {
    if (isComponent(events)) {
      addSetIntervalUpdate(events, updateList);
    } else if (events instanceof Array) {
      for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
        component = events[_l];
        addSetIntervalUpdate(events, updateList);
      }
    } else if (typeof events === 'number') {
      options = options || {};
      options.interval = events;
      addSetIntervalUpdate(updateList, options);
    }
  } else if (components === render) {
    if (isComponent(events)) {
      addRafUpdate(events, updateList);
    } else if (events instanceof Array) {
      for (_m = 0, _len4 = events.length; _m < _len4; _m++) {
        component = events[_m];
        addRafUpdate(events, updateList);
      }
    }
  } else if (events instanceof Array) {
    if (!(updateList instanceof Array)) {
      updateList = [updateList];
    }
    for (_n = 0, _len5 = events.length; _n < _len5; _n++) {
      event = events[_n];
      _renderComponentWhenBy(components, event, updateList);
    }
  } else {
    if (!(updateList instanceof Array)) {
      updateList = [updateList];
    }
    _renderComponentWhenBy(components, events, updateList);
  }
};

_renderComponentWhenBy = function(component, event, updateList, options) {
  var comp, i, item, _i, _len;
  if (event.slice(0, 2) !== 'on') {
    event = 'on' + event;
  }
  if (options) {
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
      updateList[i] = isComponent(item) ? [item, {}] : item;
    }
    component.eventUpdateConfig[event] = updateList;
  }
};

addSetIntervalUpdate = function(component, options) {
  var callback, clear, handler, interval, test;
  handler = null;
  test = options.test, interval = options.interval, clear = options.clear;
  callback = function() {
    if (!test || test()) {
      dc.update();
    }
    if (clear && clear()) {
      return clearInterval(handler);
    }
  };
  return handler = setInterval(callback, interval || 16);
};

addRenderUpdate = function(component, options) {
  var callback, clear, test;
  test = options.test, clear = options.clear;
  callback = function() {
    if (!test || test()) {
      dc.update();
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

dc.dcidIndexMap = dcidIndexMap = {};

dc.parentNodes = parentNodes = [];

dc.nextNodes = nextNodes = [];

dc.listIndex = 0;

dc.getChildParentNode = function(child) {
  return parentNodes[dcidIndexMap[child.dcid]];
};

dc.getChildNextNode = function(child) {
  return nextNodes[dcidIndexMap[child.dcid]];
};

dc.renderingMap = {};

dc.removingMap = {};

dc.invalidate = function() {
  return dc.valid = false;
};

dc.invalidateOffspring = function(offspring) {
  dc.valid = false;
  return dc.renderingMap[offspring.dcid] = [offspring, offspring.holder];
};

dc.refreshComponents = refreshComponents = function() {
  var component, holder, renderingMap, _, _ref3;
  this.valid = true;
  renderingMap = this.renderingMap;
  this.renderingMap = {};
  for (_ in renderingMap) {
    _ref3 = renderingMap[_], component = _ref3[0], holder = _ref3[1];
    if (holder !== component.holder) {
      component.invalidate();
      holder.updateChildHolder(component);
    }
    if (component !== this) {
      component.renderDom(component.baseComponent);
    }
  }
  this.valid = false;
  return this;
};

dc.removeComponents = removeComponents = function() {
  var removingMap;
  removingMap = this.removingMap;
  this.removingMap = {};
  for (dcid in removingMap) {
    removingMap[dcid].removeDom();
  }
  return this;
};

renderComponents = function() {
  refreshComponents.call(this);
  return removeComponents.call(this);
};

dc.update = function(force) {
  if ((force || dc.alwaysUpdate) && !dc.valid) {
    return renderComponents.call(this);
  }
};

dc.updateChildHolder = function(component) {
  if (component.holder !== this) {
    component.invalidate();
    component.holder = this;
    component.setParentNode(this.getChildParentNode(component));
    component.setNextNode(this.getChildNextNode(component));
  }
};

dc.raiseNode = function() {};

dc.raiseFirstNextNode = function() {};

dc.clear = function() {
  dc.dcidIndexMap = dcidIndexMap = {};
  dc.parentNodes = parentNodes = [];
  dc.nextNodes = nextNodes = [];
  dc.listIndex = 0;
  dc.renderingMap = {};
  return dc.removingMap = {};
};
