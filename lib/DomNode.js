var DomNode, addEventListener, newLine, processProp, removeEventListener;

({newLine} = require('dc-util'));

({addEventListener, removeEventListener} = require('./dom-util'));

processProp = function(props, cache, prop, value) {
  var j, len, p;
  if (value == null) {
    if (typeof prop === 'string') {
      return props[prop];
    } else {
      for (value = j = 0, len = prop.length; j < len; value = ++j) {
        p = prop[value];
        if ((cacheProps[p] == null) || value !== cacheProps[p]) {
          cacheProps[p] = props[p] = value;
        }
      }
    }
  } else {
    if ((cacheProps[prop] == null) || value !== cacheProps[prop]) {
      return cacheProps[prop] = this.node[prop] = value;
    }
  }
};

module.exports = DomNode = class DomNode {
  constructor(node1) {
    var n;
    this.node = node1;
    if (node instanceof Node) {
      this.cacheProps = {};
      this.cacheStyle = {};
    } else {
      this.cacheProps = (function() {
        var j, len, ref, results;
        ref = this.node;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          n = ref[j];
          results.push({});
        }
        return results;
      }).call(this);
      this.cacheStyle = (function() {
        var j, len, ref, results;
        ref = this.node;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          n = ref[j];
          results.push({});
        }
        return results;
      }).call(this);
    }
  }

  prop(prop, value) {
    var i, j, len, n, node;
    ({node} = this);
    if (!arguments.length) {
      return node;
    } else if (node instanceof Node) {
      return processProp(node, this.cacheProps, prop, value);
    } else {
      for (i = j = 0, len = node.length; j < len; i = ++j) {
        n = node[i];
        processProp(n, this.cacheProps[i], prop, value);
      }
    }
  }

  css(prop, value) {
    var i, j, len, n, node;
    node = this.node;
    if (!arguments.length) {
      return ndoe.style;
    } else if (node instanceof Node) {
      return processProp(node.style, this.cacheStyle, prop, value);
    } else {
      for (i = j = 0, len = node.length; j < len; i = ++j) {
        n = node[i];
        processProp(n.style, this.cacheStyle[i], prop, value);
      }
    }
  }

  bind(eventNames, handler) {
    var j, k, len, len1, n, name, node, ref;
    node = this.node;
    ref = eventNames.split(/\s+/);
    for (j = 0, len = ref.length; j < len; j++) {
      name = ref[j];
      if (name.slice(0, 2) === 'on') {
        name = name.slice(2);
      }
      if (node instanceof Node) {
        addEventListener(node, name, handler);
      } else {
        for (k = 0, len1 = node.length; k < len1; k++) {
          n = node[k];
          addEventListener(n, name, handler);
        }
      }
    }
  }

  unbind(eventNames, handler) {
    var j, k, len, len1, n, name, node, ref;
    node = this.node;
    ref = eventNames.split(/\s+/);
    for (j = 0, len = ref.length; j < len; j++) {
      name = ref[j];
      if (name.slice(0, 2) === 'on') {
        name = name.slice(2);
      }
      if (node instanceof Node) {
        removeEventListener(node, name, handler);
      } else {
        for (k = 0, len1 = node.length; k < len1; k++) {
          n = node[k];
          removeEventListener(n, name, handler);
        }
      }
    }
  }

  toString(indent = 0, addNewLine) {
    return newLine('', indent, addNewLine) + '<DomNode>' + newLine(this.node.toString(), indent + 2, true) + newLine('</DomNode>', indent, true);
  }

};
