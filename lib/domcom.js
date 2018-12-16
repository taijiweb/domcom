
/*
 * a utility to do almost everything
 * generate Component instance
 * as the dc framework namespace
 * hold convinent getter, setter and method, etc...
 * @params template: the template for the component
 * @params config: the config object for the component, it can have the fileds below
    model can be the real value of data or a function to generate the model data
    data: the data of the component
    view: the view object or a function to generate the view
 */
var dc;

import Emitter from './Emitter';

import Component from './Component';

dc = function(config) {
  var comp;
  comp = new Component(config);
  return comp;
};

dc.on = Emitter.prototype.on;

dc.off = Emitter.prototype.off;

dc.emit = Emitter.prototype.emit;

dc.focusNodeMap = {};

dc.on('updated', function() {
  if (dc.focusNode) {
    dc.focusNode.focus();
  }
});

dc.dcid = 0;

dc.mountMap = {};

dc.keepReactElementMap = {};

dc.update = function() {
  var comp, key, ref;
  ref = dc.mountMap;
  for (key in ref) {
    comp = ref[key];
    comp.update();
  }
};

if (typeof window !== 'undefined') {
  window.dc = dc;
}

dc.Component = require('./Component');

Object.assign(dc, require('./dc-error'), require('dc-util'));

dc.directives = {};

Object.assign(dc.directives, require('./dc-directive'));

dc.addReactProxy = require('./react-proxy');

export default module.exports = dc;
