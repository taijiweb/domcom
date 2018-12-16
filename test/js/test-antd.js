var expect, idescribe, iit, ndescribe, nit, normalizeDomElement, normalizeItem;

({expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper'));

({normalizeItem, normalizeDomElement} = require('dc-util'));

import React, {
  Component
} from 'react';

import ReactDom from 'react-dom';

dc.addReactProxy(React, ReactDom, Component);

import Chip from '@material-ui/core/Chip';

import {
  Button
} from 'antd';

describe("test-antd", function() {
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
  return describe('mount some material-ui dc components', function() {
    return it('simple Button', function() {
      var comp, view;
      view = [
        'div',
        [
          Button,
          {
            type: "primary"
          },
          'Default'
        ],
        [Button,
        'Default'],
        [
          Button,
          {
            type: "dashed"
          },
          'dashed'
        ],
        [
          Button,
          {
            type: "danger"
          },
          'danger'
        ]
      ];
      comp = dc({view});
      return comp.mount('#demo');
    });
  });
});
