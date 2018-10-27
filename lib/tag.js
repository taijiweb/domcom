var Tag, attrsChildren, extend, getBindProp, i, input, inputTypes, isArray, isAttrs, isComponent, isEven, isObject, j, len, len1, ref, tag, tagName, tagNames, toTagChildren, type;

extend = require('extend');

({isEven} = require('dc-util'));

extend = require('extend');

isComponent = require('./components/isComponent');

Tag = require('./components/Tag');

({getBindProp} = require('./dom-util'));

exports.isAttrs = isAttrs = function(item) {
  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
};

({isArray, isObject} = require('dc-util'));

attrsChildren = function(args) {
  var attrs;
  attrs = args[0];
  if (!args.length) {
    return [{}, []];
  } else if (attrs==null) {
    return [{}, args.slice(1)];
  } else if (attrs instanceof Array) {
    return [{}, args];
  } else if (typeof attrs === 'function') {
    return [{}, args];
  } else if (typeof attrs === 'object') {
    if (isComponent(attrs)) {
      return [{}, args];
    } else {
      return [attrs, args.slice(1)];
    }
  } else {
    return [{}, args];
  }
};

toTagChildren = function(args) {
  if (!(args instanceof Array)) {
    return [args];
  } else if (!args.length) {
    return [];
  } else if (args.length === 1) {
    return toTagChildren(args[0]);
  } else {
    return args;
  }
};

tag = function(tagName, ...args) {
  var attrs, children;
  [attrs, children] = attrsChildren(args);
  return new Tag(tagName, attrs, toTagChildren(children));
};

tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl" + " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object" + " ol optgroup option p param pre q samp script select small span strong style sub sup" + " table tbody td textarea tfoot th thead title tr tt ul var header footer section svg iframe" + " article aside bdi details dialog figcaption figure footer header main mark menuitem meter nav progress rp rt ruby summary time wbr";

tagNames = tagNames.split(' ');

for (i = 0, len = tagNames.length; i < len; i++) {
  tagName = tagNames[i];
  (function(tagName) {
    return exports[tagName] = function(...args) {
      return tag(tagName, ...args);
    };
  })(tagName);
}

// Because the name 'html' under dc has been used to instantiate Html component
// So use tagHtml here, instead.
// in client side, html is not necessary, because the dc component must be mounted somewhere
exports.tagHtml = function(...args) {
  return tag('html', ...args);
};

inputTypes = 'text checkbox radio date email number'.split(' ');

input = exports.input = function(type, attrs, value) {
  var component;
  if (typeof type === 'object') {
    value = attrs;
    attrs = type;
    type = 'text';
  }
  attrs = extend({
    type: type
  }, attrs);
  component = tag('input', attrs);
  if (value != null) {
    component.prop(getBindProp(component), value);
    if (value.isDuplex) {
      component.bind('onchange', (function(event, node) {
        return value.call(this, node.value);
      }), 'before');
    }
  }
  return component;
};

ref = 'text checkbox radio date email tel number'.split(' ');
for (j = 0, len1 = ref.length; j < len1; j++) {
  type = ref[j];
  (function(type) {
    return exports[type] = function(value, attrs) {
      var temp;
      if (typeof value === 'object') {
        temp = attrs;
        attrs = value;
        value = temp;
      }
      attrs = attrs || {};
      return input(type, attrs, value);
    };
  })(type);
}

exports.textarea = function(attrs, value) {
  var component;
  if (isAttrs(attrs)) {
    if (value != null) {
      attrs = extend({
        value: value
      }, attrs);
      component = tag('textarea', attrs);
      if (value.isDuplex) {
        component.bind('onchange', (function(event, node) {
          return value.call(this, node.value);
        }), 'before');
      }
    } else {
      component = tag('textarea', attrs);
    }
  } else {
    if (attrs != null) {
      component = tag('textarea', {
        value: attrs
      });
      if (attrs.isDuplex) {
        component.bind('onchange', (function(event, node) {
          return attrs.call(this, node.value);
        }), 'before');
      }
    } else {
      component = tag('textarea'); // attrs is value
    }
  }
  return component;
};
