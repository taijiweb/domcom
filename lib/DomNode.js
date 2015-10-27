var DomNode, addEventListener, newLine, processProp, removeEventListener, _ref;

newLine = require('./util').newLine;

_ref = require('./dom-util'), addEventListener = _ref.addEventListener, removeEventListener = _ref.removeEventListener;

processProp = function(props, cache, prop, value) {
  var p, _i, _len, _results;
  if (prop == null) {
    return props;
  }
  if (value == null) {
    if (typeof prop === 'string') {
      return props[prop];
    } else {
      _results = [];
      for (value = _i = 0, _len = prop.length; _i < _len; value = ++_i) {
        p = prop[value];
        if ((cacheProps[p] == null) || value !== cacheProps[p]) {
          _results.push(cacheProps[p] = props[p] = value);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  } else {
    if ((cacheProps[prop] == null) || value !== cacheProps[prop]) {
      return cacheProps[prop] = this.node[prop] = value;
    }
  }
};

module.exports = DomNode = (function() {
  function DomNode(node) {
    var n;
    this.node = node;
    if (node instanceof Node) {
      this.cacheProps = {};
      this.cacheStyle = {};
    } else {
      this.cacheProps = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.node;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          n = _ref1[_i];
          _results.push({});
        }
        return _results;
      }).call(this);
      this.cacheStyle = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.node;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          n = _ref1[_i];
          _results.push({});
        }
        return _results;
      }).call(this);
    }
  }

  DomNode.prototype.prop = function(prop, value) {
    var i, n, node, _i, _len;
    node = this.node;
    if (node instanceof Node) {
      processProp(node, this.cacheProps, prop, value);
    } else {
      for (i = _i = 0, _len = node.length; _i < _len; i = ++_i) {
        n = node[i];
        processProp(n, this.cacheProps[i], prop, value);
      }
    }
    return this;
  };

  DomNode.prototype.css = function(prop, value) {
    var i, n, node, _i, _len;
    node = this.node;
    if (node instanceof Node) {
      processProp(node.style, this.cacheStyle, prop, value);
    } else {
      for (i = _i = 0, _len = node.length; _i < _len; i = ++_i) {
        n = node[i];
        processProp(n.style, this.cacheStyle[i], prop, value);
      }
    }
    return this;
  };

  DomNode.prototype.bind = function(eventNames, handler) {
    var n, name, names, node, _i, _j, _len, _len1;
    names = eventNames.split(/\s+/);
    node = this.node;
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      if (name.slice(0, 2) === 'on') {
        name = name.slice(2);
      }
      if (node instanceof Node) {
        addEventListener(node, name, handler);
      } else {
        for (_j = 0, _len1 = node.length; _j < _len1; _j++) {
          n = node[_j];
          addEventListener(n, name, handler);
        }
      }
    }
  };

  DomNode.prototype.unbind = function(eventNames, handler) {
    var n, name, names, node, _i, _j, _len, _len1;
    names = eventNames.split(/\s+/);
    node = this.node;
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      if (name.slice(0, 2) === 'on') {
        name = name.slice(2);
      }
      if (node instanceof Node) {
        removeEventListener(node, name, handler);
      } else {
        for (_j = 0, _len1 = node.length; _j < _len1; _j++) {
          n = node[_j];
          removeEventListener(n, name, handler);
        }
      }
    }
  };

  DomNode.prototype.toString = function(indent, addNewLine) {
    if (indent == null) {
      indent = 0;
    }
    return newLine('', indent, addNewLine) + '<DomNode>' + newLine(this.node.toString(), indent + 2, true) + newLine('</DomNode>', indent, true);
  };

  return DomNode;

})();
