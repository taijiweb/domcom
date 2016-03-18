var dcidIndexMap, isArray, isComponent, lastTime, nextNodes, parentNodes, rafUpdate, refreshComponents, removeComponents, updateWhenComponentEvent, vendor, _i, _len, _ref;

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

dc.dcidIndexMap = dcidIndexMap = {};

dc.parentNodes = parentNodes = [];

dc.nextNodes = nextNodes = [];

dc.listIndex = 0;

dc.renderingMap = {};

dc.removingMap = {};

dc.reset = function() {
  dc.listeners = {};
  dc.dcidIndexMap = {};
  dc.parentNodes = [];
  dc.nextNodes = [];
  dc.listIndex = 0;
  dc.renderingMap = {};
  return dc.removingMap = {};
};

dc.getChildParentNode = function(child) {
  return parentNodes[dcidIndexMap[child.dcid]];
};

dc.getChildNextNode = function(child) {
  return this.nextNodes[dcidIndexMap[child.dcid]];
};

dc.invalidate = function() {
  return dc.valid = false;
};

dc.invalidateOffspring = function(offspring) {
  dc.valid = false;
  return dc.renderingMap[offspring.dcid] = [offspring, offspring.holder];
};

dc.refreshComponents = refreshComponents = function() {
  var component, holder, renderingMap, _, _ref1;
  this.valid = true;
  renderingMap = this.oldRenderingMap = this.renderingMap;
  this.renderingMap = {};
  for (_ in renderingMap) {
    _ref1 = renderingMap[_], component = _ref1[0], holder = _ref1[1];
    holder.updateChildHolder(component);
    component.renderDom(component.baseComponent);
  }
  this.valid = false;
  return this;
};

removeComponents = function() {
  var dcid, removingMap;
  removingMap = this.removingMap;
  this.removingMap = {};
  for (dcid in removingMap) {
    removingMap[dcid].removeDom();
  }
  return this;
};

dc.update = function(force) {
  dc.emit('willUpdate');
  if ((force || dc.alwaysUpdate) && !dc.valid) {
    refreshComponents.call(this);
    removeComponents.call(this);
  }
  return dc.emit('didUpdate');
};

dc.updateChildHolder = function(child) {
  if (child.holder !== this) {
    child.invalidate();
    child.holder = this;
    child.setParentNode(this.getChildParentNode(child));
    child.sinkNextNode(this.getChildNextNode(child));
  }
};

dc.raiseNode = function() {};

dc.raiseFirstNextNode = function() {};

dc.linkNextNode = function() {};

dc.rafUpdate = rafUpdate = function() {
  if (!dc.rafUpdateStop || !dc.rafUpdateStop()) {
    requestAnimFrame(rafUpdate);
    dc.update(true);
  }
};

dc.updateWhen = function(component, events, options) {
  var callback, clear, comp, event, handler, interval, test, _j, _k, _l, _len1, _len2, _len3;
  if (component instanceof Array) {
    for (_j = 0, _len1 = component.length; _j < _len1; _j++) {
      comp = component[_j];
      if (isArray(events)) {
        for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
          event = events[_k];
          updateWhenComponentEvent(comp, event, options);
        }
      } else {
        updateWhenComponentEvent(comp, events, options);
      }
    }
  } else if (isComponent(component)) {
    if (isArray(events)) {
      for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
        event = events[_l];
        updateWhenComponentEvent(component, event, options);
      }
    } else {
      updateWhenComponentEvent(component, events, options);
    }
  } else if (component === setInterval) {
    if (typeof events === 'number') {
      options = options || {};
      options.interval = events;
    } else {
      options = events || {};
    }
    test = options.test, interval = options.interval, clear = options.clear;
    handler = null;
    callback = function() {
      if (!test || test()) {
        dc.update();
      }
      if (clear && clear()) {
        return clearInterval(handler);
      }
    };
    handler = setInterval(callback, interval || 16);
  } else if (component === dc.rafUpdate) {
    dc.rafUpdateStop = events;
    dc.rafUpdate();
  }
};

updateWhenComponentEvent = function(component, event, alwaysUpdate) {
  if (event.slice(0, 2) !== 'on') {
    event = 'on' + event;
  }
  return component.eventUpdateConfig[event] = alwaysUpdate;
};
