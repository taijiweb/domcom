var isArray, isComponent, lastTime, rafRender, renderWhenComponentEvent, vendor, _i, _len, _ref;

isArray = require('dc-util').isArray;

isComponent = require('./core/base/isComponent');

if (typeof window !== 'undefined') {
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame']) {
      window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
      break;
    }
  }
  if (!window.requestAnimationFrame) {
    lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var currTime, id, timeToCall;
      currTime = (new Date).getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout((function() {
        callback(currTime + timeToCall);
      }), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}

dc.reset = function() {
  dc.renderBySystemLoop = false;
  dc.listeners = {};
  return dc.rootComponentMap = {};
};

dc.reset();

dc.invalidateContent = function(component) {
  dc.valid = false;
  dc.rootComponentMap[component.dcid] = component;
};

dc.render = function(force) {
  var component, dcid, rootComponentMap, _j, _len1;
  dc.emit('willRender');
  if (!dc.valid) {
    dc.valid = true;
    rootComponentMap = dc.rootComponentMap;
    dc.rootComponentMap = {};
    for (component = _j = 0, _len1 = rootComponentMap.length; _j < _len1; component = ++_j) {
      dcid = rootComponentMap[component];
      component.render(true);
    }
  }
  return dc.emit('didRender');
};

dc.rafRender = rafRender = function() {
  dc.renderBySystemLoop = true;
  requestAnimFrame(rafRender);
  dc.render(true);
};

dc.renderWhen = function(component, events, options) {
  var callback, clear, comp, components, event, handler, test, _j, _k, _len1, _len2;
  if (typeof events === 'string') {
    events = events.split(/\s+/);
  }
  if (isComponent(component)) {
    component = [component];
  }
  if (component instanceof Array) {
    for (_j = 0, _len1 = component.length; _j < _len1; _j++) {
      comp = component[_j];
      for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
        event = events[_k];
        renderWhenComponentEvent(comp, event, options);
      }
    }
  } else if (component === window.setInterval) {
    test = options.test, clear = options.clear, components = options.components;
    handler = null;
    callback = function() {
      var _l, _len3;
      if (!test || test()) {
        for (_l = 0, _len3 = components.length; _l < _len3; _l++) {
          component = components[_l];
          component.render();
        }
      }
      if (clear && clear()) {
        return clearInterval(handler);
      }
    };
    handler = setInterval(callback, events || 16);
  } else if (component === setTimeout) {
    callback = function() {
      var _l, _len3, _ref1, _results;
      _ref1 = options.component;
      _results = [];
      for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
        component = _ref1[_l];
        _results.push(component.render());
      }
      return _results;
    };
    setTimeout(callback, events);
  }
};

renderWhenComponentEvent = function(component, event, components) {
  var componentMap, _j, _len1;
  if (event.slice(0, 2) !== 'on') {
    event = 'on' + event;
  }
  componentMap = component.eventUpdateConfig[event] || (component.eventUpdateConfig[event] = {});
  for (_j = 0, _len1 = components.length; _j < _len1; _j++) {
    component = components[_j];
    componentMap[component.dcid] = component;
  }
};

dc.stopRenderWhen = function(component, event, components) {
  var componentMap, dcid;
  if (event.slice(0, 2) !== 'on') {
    event = 'on' + event;
  }
  if (components) {
    if (componentMap = component.eventUpdateConfig[event]) {
      for (dcid in components) {
        component = components[dcid];
        delete componentMap[dcid];
      }
    }
  } else {
    delete component.eventUpdateConfig[event];
  }
};
