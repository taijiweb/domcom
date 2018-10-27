var i, isArray, isComponent, lastTime, len, rafRender, ref, renderWhenComponentEvent, vendor;

({isArray} = require('dc-util'));

isComponent = require('./components/isComponent');

if (typeof window !== 'undefined') {
  if (!window.requestAnimationFrame) {
    ref = ['webkit', 'ms', 'moz', 'o'];
    for (i = 0, len = ref.length; i < len; i++) {
      vendor = ref[i];
      if (window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame']) {
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
        break;
      }
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
  dc.rootComponentMap = {};
  return dc.removingChildren = {};
};

dc.reset();

dc.render = function(force) {
  var component, dcid, rootComponentMap;
  if (force || dc.alwaysRender || !dc.renderBySystemLoop) {
    dc.emit('willRender');
    if (!dc.valid) {
      dc.valid = true;
      rootComponentMap = dc.rootComponentMap;
      dc.rootComponentMap = {};
      for (dcid in rootComponentMap) {
        component = rootComponentMap[dcid];
        component.render(true);
      }
      dc.clean();
    }
    return dc.emit('didRender');
  }
};

dc.rafRender = rafRender = function() {
  dc.renderBySystemLoop = true;
  requestAnimFrame(rafRender);
  dc.render(true);
};

// dc.renderWhen component, events, options
// dc.renderWhen setInterval, interval, {clear: -> clearInterval test}
// dc.renderWhen setTimeout, interval
dc.renderWhen = function(cause, events, options) {
  var callback, clear, comp, components, event, handler, j, k, len1, len2, test;
  components = options.target;
  if (typeof events === 'string') {
    events = events.split(/\s+/);
  }
  if (isComponent(cause)) {
    cause = [cause];
  }
  if (cause instanceof Array) {
    for (j = 0, len1 = cause.length; j < len1; j++) {
      comp = cause[j];
      for (k = 0, len2 = events.length; k < len2; k++) {
        event = events[k];
        renderWhenComponentEvent(comp, event, components);
      }
    }
  } else if (cause === window.setInterval) {
    ({test, clear} = options);
    handler = null;
    callback = function() {
      var component, l, len3;
      if (!test || test()) {
        for (l = 0, len3 = components.length; l < len3; l++) {
          component = components[l];
          component.render();
        }
        dc.clean();
      }
      if (clear && clear()) {
        return clearInterval(handler);
      }
    };
    handler = setInterval(callback, events || 16);
  } else if (cause === setTimeout) {
    callback = function() {
      var component, l, len3;
      for (l = 0, len3 = components.length; l < len3; l++) {
        component = components[l];
        component.render();
      }
      return dc.clean();
    };
    setTimeout(callback, events);
  }
};

renderWhenComponentEvent = function(component, event, components) {
  var componentMap, j, len1;
  if (event.slice(0, 2) !== 'on') {
    event = 'on' + event;
  }
  componentMap = component.eventUpdateConfig[event] || (component.eventUpdateConfig[event] = {});
  for (j = 0, len1 = components.length; j < len1; j++) {
    component = components[j];
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

dc.invalidate = function() {
  return dc.valid = false;
};

dc.invalidateContent = function(component) {
  dc.valid = false;
  dc.rootComponentMap[component.dcid] = component;
};

dc.invalidateAttach = function(child) {};

dc.propagateChildNextNode = function(child, nextNode) {};

dc.linkNextNode = function(child, oldNode, nextNode) {};

dc.removingChildren = {};

dc.clean = function() {
  var _, component, ref1;
  ref1 = dc.removingChildren;
  for (_ in ref1) {
    component = ref1[_];
    component.removeDom();
  }
  dc.removingChildren = {};
};
