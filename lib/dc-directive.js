var exports, modelProps;

import {
  isArray
} from './dc-util';

export default exports = module.exports = {};

modelProps = {
  'checkbox': 'checked'
};

exports.$model = function(item, options) {
  var children, comp, event, field, prop, props, tag;
  [tag, props, children] = item;
  comp = this;
  if (typeof options === 'string') {
    field = options;
  } else if (options) {
    field = options.field;
    event = options.event || 'onChange';
    prop = options.prop;
  }
  props = Object.assign({}, props);
  prop = prop || modelProps[props.type] || 'value';
  props[prop] = comp[field];
  props[event || 'onChange'] = (event) => {
    return comp[field] = event.target[prop];
  };
  return [tag, props, children];
};

//$output just reverse node.value to field, but NOT bind field to props.value
exports.$output = function(item, options) {
  var children, comp, event, field, prop, props, tag;
  [tag, props, children] = item;
  comp = this;
  if (typeof options === 'string') {
    field = options;
  } else if (options) {
    field = options.field;
    event = options.event || 'onChange';
    prop = options.prop;
  }
  props = Object.assign({}, props);
  props[event || 'onChange'] = (event) => {
    return comp[field] = event.target[prop];
  };
  return [tag, props, children];
};

exports.$options = function(item, options) {
  var children, props, tag;
  [tag, props, children] = item;
  if (isArray(options)) {
    children = options.map(function(child) {
      return ['option', {}, [child]];
    });
  }
  return [tag, props, children];
};

exports.$show = function(item, options) {
  var children, props, style, tag, value;
  [tag, props, children] = item;
  if (typeof options === 'string' || typeof options === 'number') {
    value = this[options];
  } else {
    value = options;
  }
  style = props.style || (props.style = {});
  if (value) {
    style.display = 'block';
  } else {
    style.display = 'none';
  }
  return [tag, props, children];
};
