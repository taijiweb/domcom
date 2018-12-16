var expect, idescribe, iit, ndescribe, nit, normalizeDomElement, normalizeItem;

({expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper'));

({normalizeItem, normalizeDomElement} = require('dc-util'));

import React, {
  Component
} from 'react';

import ReactDom from 'react-dom';

dc.addReactProxy(React, ReactDom, Component);

import Button from '@material-ui/core/Button';

describe("test-directive", function() {
  beforeEach(function() {
    var demoNode, node;
    demoNode = normalizeDomElement('#demo');
    if (demoNode.childNodes.length) {
      node = demoNode.childNodes[0];
      demoNode.removeChild(node);
    }
    // tell React do not warn about this
    demoNode._reactRootContainer = void 0;
  });
  return describe('model directive', function() {
    it('should process model directive', function() {
      var comp, view;
      view = function() {
        return [
          'div',
          [
            'text',
            {
              '#': [[dc.model,
            'message']]
            }
          ],
          ['p',
          this.message]
        ];
      };
      comp = dc({
        view,
        message: 'hello'
      });
      return comp.mount('#demo');
    });
    return it('should process view event without model directive', function() {
      var comp, message, view;
      view = function() {
        var onChange;
        onChange = (event) => {
          return comp.message = event.target.value;
        };
        return [
          'div',
          [
            'text',
            {
              value: this.message,
              onChange
            }
          ],
          ['p',
          this.message]
        ];
      };
      message = 'hello';
      comp = dc({view, message});
      return comp.mount('#demo');
    });
  });
});
