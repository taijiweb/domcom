var camelCase, camelCaseProps, classname, dcid, exports, inputTypes, isArray, isMap, isObject, isReactClass, j, len, normalizeArrayViewItem, normalizeItem, normalizeReactProps, parseTagString, ref, styleFrom, type;

camelCase = require('camelcase');

export default exports = module.exports = {};

exports.normalizeItem = normalizeItem = function(item) {
  if (typeof item === 'string') {
    return item;
  } else if (item instanceof dc.Component) {
    return item.reactElement;
  } else if (isArray(item)) {
    return normalizeArrayViewItem(item);
  } else if (item != null) {
    return '' + item;
  } else {
    return null;
  }
};

normalizeArrayViewItem = function(item) {
  var _, children, classes, css, i, id, inputType, it, props, tag, x;
  i = 0;
  it = item[i];
  if (it instanceof dc.Component || isArray(it)) {
    tag = 'div';
    props = {};
    children = item.map(function(child) {
      return normalizeItem(child);
    });
    return [tag, props, children];
  } else if (typeof it === 'string') {
    [tag, classes, id, css, inputType] = parseTagString(item[i]);
    classes = classname(classes);
    css = styleFrom(css);
    i++;
  } else if (isReactClass(it)) {
    tag = it;
    i++;
    it = item[i];
    if (typeof it === 'string' && it) {
      if (it.match(/^\.|^#/)) {
        [_, classes, id, css, inputType] = parseTagString(item[i]);
        classes = classname(classes);
        css = styleFrom(css);
        i++;
        it = item[i];
      }
    }
  } else if (typeof it === 'function') {
    x = it(...item.slice(1));
    return normalizeItem(x);
  }
  // props and children
  props = null;
  it = item[i];
  while (isMap(it)) {
    props = Object.assign({id}, it);
    tag = tag || it.tag || 'div';
    delete props.tag;
    classes = classname(classes, it.classes, it.className);
    delete props.classes;
    props.className = classes;
    css = styleFrom(css, it.css, it.style);
    delete props.css;
    props.style = css;
    i++;
    it = item[i];
  }
  if (!props) {
    props = {
      className: classes,
      id,
      style: styleFrom(css)
    };
  }
  if (inputType) {
    props.type = inputType;
  }
  children = item.slice(i).map(function(child) {
    return normalizeItem(child);
  });
  props = normalizeReactProps(props, typeof tag === 'string');
  return [tag || 'div', props, children];
};

normalizeReactProps = function(props, camel = true) {
  var classMap, classes, key, value;
  for (key in props) {
    value = props[key];
    if (camel) {
      delete props[key];
      key = camelCase(key);
    }
    if (value === void 0) {
      delete props[key];
    } else if (key === 'className') {
      classMap = classname(value);
      if (classes = Object.keys(classMap).filter(function(key) {
        return classMap[key];
      }).join(' ')) {
        props.className = classes;
      } else {
        delete props.className;
      }
    } else if (key === 'style') {
      if (Object.keys(value).length) {
        props.style = camelCaseProps(value);
      } else {
        delete props.style;
      }
    } else if (camel) {
      props[key] = value;
    }
  }
  return props;
};

camelCaseProps = function(props) {
  var key, result, value;
  result = {};
  for (key in props) {
    value = props[key];
    key = camelCase(key);
    result[key] = value;
  }
  return result;
};

inputTypes = {};

ref = 'text checkbox radio date email tel number password'.split(' ');
for (j = 0, len = ref.length; j < len; j++) {
  type = ref[j];
  inputTypes[type] = 1;
}

// tag.class#id##css
parseTagString = function(str) {
  var classes, css, id, inputType, list, tag;
  str = str.trim();
  list = str.split('##');
  if (list.length === 2) {
    css = list[1].trim();
    str = list[0].trim();
  }
  list = str.split('#');
  if (list.length === 2) {
    id = list[1].trim();
    str = list[0].trim();
  }
  list = str.split('.');
  if (list.length > 1) {
    tag = list[0];
    classes = classname(list.slice(1));
  } else {
    tag = str;
    classes = [];
  }
  if (inputTypes[tag]) {
    inputType = tag;
    tag = 'input';
  }
  return [tag || 'div', classes, id, css, inputType];
};

styleFrom = function(...items) {
  var def, defs, item, k, key, l, len1, len2, result, value;
  result = {};
  for (k = 0, len1 = items.length; k < len1; k++) {
    item = items[k];
    if (typeof item === 'string') {
      item = item.trim();
      if (!item) {
        continue;
      }
      defs = item.split(/\s*;\s*/);
      for (l = 0, len2 = defs.length; l < len2; l++) {
        def = defs[l];
        if (!def) {
          continue;
        }
        [key, value] = def.split(/\s*:\s*/);
        if (!key || !value) {
          dc.error('format error in css rules: empty key');
        } else if (!value) {
          dc.error('format error in css rules: empty value');
        }
        key = camelCase(key);
        result[key] = value;
      }
    } else if (isMap(item)) {
      Object.assign(result, item);
    }
  }
  return result;
};

classname = function(...items) {
  var classMap, item, k, l, len1, len2, len3, m, name, names;
  classMap = {};
  for (k = 0, len1 = items.length; k < len1; k++) {
    item = items[k];
    if (!item) {
      continue;
    } else if (typeof item === 'string') {
      names = item.trim().split(/(?:\s*,\s*)|s+/);
      for (l = 0, len2 = names.length; l < len2; l++) {
        name = names[l];
        classMap[name] = 1;
      }
    } else if (isArray(item)) {
      for (m = 0, len3 = item.length; m < len3; m++) {
        name = item[m];
        classMap[name] = 1;
      }
    } else if (isObject(item)) {
      Object.assign(classMap, item);
    }
  }
  return classMap;
};

isReactClass = function(item) {
  // investigated on both CreateClass and ES6 extends react.Component
  return item && item.prototype && item.prototype.isReactComponent;
};

exports.watchField = function(data, prop, comp) {
  var closure;
  closure = function() {
    var value;
    value = data[prop];
    Object.defineProperty(data, prop, {
      get: function() {
        return value;
      },
      set: function(v) {
        value = v;
        return comp.update();
      }
    });
  };
  closure();
};

exports.watchDataField = function(data, prop, comp) {
  (function() {
    var value;
    value = data[prop];
    Object.defineProperty(data, prop, {
      get: function() {
        return value;
      },
      set: function(v) {
        var k, len1, ref1;
        if (v !== value) {
          value = v;
          ref1 = data.watchingComponents;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            comp = ref1[k];
            comp.update();
          }
        }
        return v;
      }
    });
  })();
};

exports.normalizeDomElement = function(domElement) {
  if (typeof domElement === 'string') {
    domElement = document.querySelector(domElement);
  }
  return domElement;
};

exports.isArray = isArray = isArray = function(item) {
  return Object.prototype.toString.call(item) === '[object Array]';
};

exports.isObject = isObject = function(item) {
  return typeof item === 'object' && item !== null;
};

exports.isMap = isMap = function(item) {
  return typeof item === 'object' && item !== null && item.constructor === Object;
};

dcid = 0;

exports.newDcid = function() {
  return dcid++;
};
