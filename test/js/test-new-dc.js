var expect, idescribe, iit, ndescribe, nit, normalizeDomElement, normalizeItem;

({expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper'));

({normalizeItem, normalizeDomElement} = require('dc-util'));

import React, {
  Component
} from 'react';

import ReactDom from 'react-dom';

dc.addReactProxy(React, ReactDom, Component);

import Button from '@material-ui/core/Button';

describe("test-new-dc", function() {
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
  describe('mount simple dc components', function() {
    it('should dc generate a component', function() {
      var comp;
      comp = dc();
      return expect(comp instanceof dc.Component).to.be.true;
    });
    it(' dc should check fields', function() {
      return expect(function() {
        return dc({
          dcid: 'should error'
        });
      }).to.throw(dc.DomcomError);
    });
    it('simple data view', function() {
      var comp, data, view;
      data = {
        x: 1,
        y: 2
      };
      view = function(data) {
        var x, y;
        ({x, y} = data);
        return ['div', ['div', x], ['div', y]];
      };
      return comp = dc({data, view});
    });
    it('config.view should work 1', function() {
      var comp, node, view;
      view = function() {
        return ['div', {}, 'hello domcom mvc'];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<div>hello domcom mvc</div>');
    });
    it('config.view should work 2', function() {
      var comp, view;
      view = ['div', 'hello domcom mvc'];
      comp = dc({view});
      return comp.mount('#demo');
    });
    it('normalizeItem should work', function() {
      var comp, item, s, view;
      view = ['div', 'hello domcom mvc'];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{},["hello domcom mvc"]]');
    });
    it('class in both tag string and props', function() {
      var comp, item, s, view;
      view = [
        'div.btn',
        {
          classes: "active"
        },
        'hello domcom mvc'
      ];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"className":"btn active"},["hello domcom mvc"]]');
    });
    it('style in both tag string and props 1', function() {
      var item, s, view;
      view = [
        'div##width:100;',
        {
          css: "height:200px"
        },
        'hello domcom mvc'
      ];
      item = normalizeItem(view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"style":{"width":"100","height":"200px"}},["hello domcom mvc"]]');
    });
    it('style and css in both tag string and props 2', function() {
      var item, red, s, view;
      red = 'red';
      view = [
        'div##width:100;',
        {
          css: "height:200px",
          style: {
            backgroundColor: red
          }
        },
        'hello domcom mvc'
      ];
      item = normalizeItem(view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"style":{"width":"100","height":"200px","backgroundColor":"red"}},["hello domcom mvc"]]');
    });
    it('camelCase style and css in both tag string and props 1', function() {
      var comp, item, red, s, view;
      red = 'red';
      view = [
        'div##width:100;',
        {
          css: "height:200px",
          style: {
            'background-color': red
          }
        },
        'hello domcom mvc'
      ];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"style":{"width":"100","height":"200px","backgroundColor":"red"}},["hello domcom mvc"]]');
    });
    it('multiple props 1', function() {
      var comp, item, red, s, view;
      red = 'red';
      view = [
        'div##width:100;',
        {
          css: "height:200px"
        },
        {
          'background-color': red
        },
        'hello domcom mvc'
      ];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"backgroundColor":"red","style":{"width":"100","height":"200px"}},["hello domcom mvc"]]');
    });
    it('classname with true value', function() {
      var active, comp, item, red, s, view;
      red = 'red';
      active = true;
      view = [
        'div##width:100;',
        {
          classes: {active}
        },
        {
          'background-color': red
        },
        'hello domcom mvc'
      ];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"backgroundColor":"red","className":"active","style":{"width":"100"}},["hello domcom mvc"]]');
    });
    it('classname with falsy value', function() {
      var active, comp, item, red, s, view;
      red = 'red';
      active = false;
      view = [
        'div##width:100;',
        {
          classes: {active}
        },
        {
          'background-color': red
        },
        'hello domcom mvc'
      ];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item);
      return expect(s).to.equal('["div",{"backgroundColor":"red","style":{"width":"100"}},["hello domcom mvc"]]');
    });
    it('tagstr follow ReactClass', function() {
      var active, comp, item, red, s, view;
      red = 'red';
      active = false;
      view = [
        Button,
        '##width:100;',
        {
          classes: {active}
        },
        {
          'background-color': red
        },
        'hello domcom mvc'
      ];
      comp = dc({view});
      item = normalizeItem(comp.view);
      s = JSON.stringify(item.slice(1));
      // will not camelcase in props  in ReactClass element
      return expect(s).to.equal('[{"background-color":"red","style":{"width":"100"}},["hello domcom mvc"]]');
    });
    it('should work  on view function', function() {
      var comp, item, s, view;
      view = function(data) {
        return ['div', 'hello', data];
      };
      comp = dc({
        data: " data",
        view
      });
      view = comp.getView();
      item = normalizeItem(view);
      s = JSON.stringify(item);
      expect(s).to.equal('["div",{},["hello"," data"]]');
      return comp.mount('#demo');
    });
    it('view function should work on data', function() {
      var comp, node, view;
      view = function(data) {
        return ['div', 'hello', data];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<div>hello</div>');
    });
    it('tag.classes#id should work', function() {
      var comp, node, view;
      view = function(data) {
        return ['div.btn#button1', 'hello', data];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<div class="btn" id="button1">hello</div>');
    });
    it('tag.classes#id::css should work 1', function() {
      var comp, node, view;
      view = function(data) {
        return ['div.btn#button1##width:20px;', 'hello', data];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<div class="btn" id="button1" style="width: 20px;">hello</div>');
    });
    it('tag.classes#id::css should work 2', function() {
      var comp, node, view;
      view = function(data) {
        return ['.btn#button1##width:20px;color:red', 'hello', data];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<div class="btn" id="button1" style="width: 20px; color: red;">hello</div>');
    });
    it('inputtype.classes#id::css should work 2', function() {
      var comp, node, view;
      view = function() {
        return ['text.btn#button1##width:200px;color:red'];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<input class="btn" id="button1" type="text" style="width: 200px; color: red;">');
    });
    return it('password.classes#id::css should work', function() {
      var comp, node, view;
      view = function() {
        return ['password.btn#button1##width:200px;color:red'];
      };
      comp = dc({view});
      comp.mount('#demo');
      node = document.querySelector('#demo');
      return expect(node.innerHTML).to.equal('<input class="btn" id="button1" type="password" style="width: 200px; color: red;">');
    });
  });
  return describe('mount embedded dc components', function() {
    it('should mount  embedded component and auto watch it', function() {
      var comp, data, embedded, view;
      data = {
        message: "I am embedded"
      };
      view = function(data) {
        return ['div', data.message];
      };
      embedded = dc({data, view});
      comp = dc({
        view: embedded
      });
      comp.mount('#demo');
      expect(comp.node.innerHTML).to.equal('I am embedded');
      data.message = "new embedded message";
      comp.update();
      debugger;
      return expect(comp.node.innerHTML).to.equal("new embedded message");
    });
    it('embedded component will not auto update if stop watching it', function() {
      var comp, data, embedded, view;
      data = {
        message: "I am embedded"
      };
      view = function(data) {
        return ['div', data.message];
      };
      embedded = dc({data, view});
      comp = dc({
        view: embedded
      });
      comp.mount('#demo');
      embedded.stopWatch();
      expect(comp.node.innerHTML).to.equal('I am embedded');
      data.message = "new embedded message";
      comp.update();
      return expect(comp.node.innerHTML).to.equal("I am embedded");
    });
    it('should NOT mount the same one component in different places', function() {
      var comp, data, embedded, view;
      data = {
        message: "I am embedded"
      };
      view = function(data) {
        return ['div', data.message];
      };
      embedded = dc({data, view});
      comp = dc({
        view: ['div', embedded, embedded]
      });
      window.onerror = function(error) {
        throw error;
      };
      return expect(function() {
        return comp.mount('#demo');
      }).to.throw();
    });
    it('should mount the embedded component copy', function() {
      var comp, data, embedded, embedded2, view;
      data = {
        message: "I am embedded"
      };
      view = function(data) {
        return ['div', data.message];
      };
      embedded = dc({data, view});
      embedded.watch();
      embedded2 = embedded.copy();
      embedded2.watch();
      comp = dc({
        view: ['div', embedded, embedded2]
      });
      comp.mount('#demo');
      expect(comp.node.innerHTML).to.equal('<div>I am embedded</div><div>I am embedded</div>');
      data.message = "new embedded message";
      return expect(comp.node.innerHTML).to.equal('<div>new embedded message</div><div>new embedded message</div>');
    });
    it('should mount the embedded component copy 2', function() {
      var comp, data, embedded, embedded2, view;
      data = {
        show1: true,
        message1: "I am embedded 1",
        message2: "I am embedded 2"
      };
      view = function(data) {
        if (data.show1) {
          return ['div', data.message1];
        } else {
          return ['div', data.message2];
        }
      };
      embedded = dc({data, view});
      embedded.watch();
      embedded2 = embedded.copy().watch();
      comp = dc({
        view: ['div', embedded, embedded2]
      });
      comp.mount('#demo');
      expect(embedded.node.innerHTML).to.equal('I am embedded 1');
      expect(comp.node.innerHTML).to.equal('<div>I am embedded 1</div><div>I am embedded 1</div>');
      data.show1 = false;
      return expect(comp.node.innerHTML).to.equal('<div>I am embedded 2</div><div>I am embedded 2</div>');
    });
    return it('should process rebol style function call in view item', function() {
      var if_, item;
      if_ = function(test, then_, else_) {
        if (test) {
          return then_;
        } else {
          return else_;
        }
      };
      item = normalizeItem([if_, 0, 1, 2]);
      return expect(item).to.equal('2');
    });
  });
});
