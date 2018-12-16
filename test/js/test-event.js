var expect, idescribe, iit, ndescribe, nit, normalizeDomElement, normalizeItem;

({expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper'));

({normalizeItem, normalizeDomElement} = require('dc-util'));

import React, {
  Component
} from 'react';

import ReactDom from 'react-dom';

dc.addReactProxy(React, ReactDom, Component);

describe("test events", function() {
  beforeEach(function() {
    var demoNode, node;
    demoNode = normalizeDomElement('#demo');
    if (demoNode.childNodes.length) {
      node = demoNode.childNodes[0];
      demoNode.removeChild(node);
      // tell React do not warn about this
      demoNode._reactRootContainer = void 0;
    }
  });
  return it('should process onClick', function() {
    var comp, data, embedded, onClick, view;
    data = {
      message: "click me!"
    };
    onClick = function() {
      data.message = "you clicked!";
      return dc.update();
    };
    view = function(data) {
      return ['div', {onClick}, data.message];
    };
    embedded = dc({data, view});
    comp = dc({
      view: embedded
    });
    return comp.mount('#demo');
  });
});
