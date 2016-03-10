var BaseComponent, ListMixin, Tag, attrToPropName, classFn, cloneObject, dc, directiveRegistry, domField, domValue, eventHandlerFromArray, extend, flow, funcString, mixin, newLine, react, refreshComponents, styleFrom, updating, _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

extend = require('extend');

refreshComponents = (dc = require('../../dc')).refreshComponents;

_ref = require('../../dom-util'), domField = _ref.domField, domValue = _ref.domValue;

_ref1 = require('../property'), classFn = _ref1.classFn, styleFrom = _ref1.styleFrom, eventHandlerFromArray = _ref1.eventHandlerFromArray, attrToPropName = _ref1.attrToPropName, updating = _ref1.updating;

BaseComponent = require('./BaseComponent');

_ref2 = require('dc-util'), funcString = _ref2.funcString, newLine = _ref2.newLine, cloneObject = _ref2.cloneObject;

directiveRegistry = require('../../config').directiveRegistry;

_ref3 = require('lazy-flow'), flow = _ref3.flow, react = _ref3.react;

module.exports = Tag = (function(_super) {
  __extends(Tag, _super);

  function Tag(tagName, attrs, children) {
    if (attrs == null) {
      attrs = {};
    }
    if (!(this instanceof Tag)) {
      throw 'should use new SubclassComponent(...) with the subclass of Tag';
    }
    Tag.__super__.constructor.call(this);
    this.initChildren(children);
    this.isTag = true;
    tagName = tagName || 'div';
    this.tagName = tagName.toLowerCase();
    this.namespace = attrs.namespace;
    this.initAttrs();
    this.extendAttrs(attrs);
    return;
  }

  Tag.prototype.initAttrs = function() {
    var className, me;
    me = this;
    this.hasActiveProperties = false;
    this.cacheClassName = "";
    this.className = className = classFn();
    this.className.onInvalidate(function() {
      if (className.valid) {
        me.hasActiveProperties = true;
        return me.invalidate();
      }
    });
    this.cacheProps = {};
    this.props = {};
    this.boundProps = {};
    this['invalidateProps'] = {};
    this.nodeProps = {};
    this.hasActiveNodeAttrs = false;
    this.cacheNodeAttrs = {};
    this.nodeAttrs = {};
    this.boundNodeAttrs = {};
    this['invalidateNodeAttrs'] = {};
    this.hasActiveStyle = false;
    this.cacheStyle = {};
    this.style = {};
    this.boundStyle = {};
    this['invalidateStyle'] = {};
    this.hasActiveEvents = false;
    this.events = this.events || {};
    return this.eventUpdateConfig = {};
  };

  Tag.prototype.extendAttrs = function(attrs) {
    var className, generator, handler, key, nodeAttrs, props, style, styles, v, v0, value, _i, _j, _len, _len1, _ref4;
    className = this.className, style = this.style, props = this.props, nodeAttrs = this.nodeAttrs;
    for (key in attrs) {
      value = attrs[key];
      if (key === 'style') {
        styles = styleFrom(value);
        for (key in styles) {
          value = styles[key];
          this.setProp(key, value, style, 'Style');
        }
      } else if (key === 'class' || key === 'className') {
        className.extend(value);
      } else if (key.slice(0, 2) === 'on') {
        if (!value) {
          continue;
        } else if (typeof value === 'function') {
          this.bindOne(key, value);
        } else {
          v0 = value[0];
          if (v0 === 'before' || v0 === 'after') {
            _ref4 = value.slice(1);
            for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
              v = _ref4[_i];
              this.bindOne(key, v, v0 === 'before');
            }
          } else {
            for (_j = 0, _len1 = value.length; _j < _len1; _j++) {
              v = value[_j];
              this.bindOne(key, v);
            }
          }
        }
      } else if (key[0] === '$') {
        generator = directiveRegistry[key];
        if (value instanceof Array) {
          handler = generator.apply(null, value);
        } else {
          handler = generator.apply(null, [value]);
        }
        handler(this);
      } else if (key.slice(0, 5) === 'attr_') {
        this.setProp(key.slice(5), value, nodeAttrs, 'NodeAttrs');
      } else {
        this.setProp(key, value, props, 'Props');
      }
    }
    return this;
  };

  Tag.prototype.prop = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.props, 'Props');
  };

  Tag.prototype.propBind = function(prop) {
    return this._propBind([prop], this.props, 'Props');
  };

  Tag.prototype.css = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.style, 'Style');
  };

  Tag.prototype.cssBind = function(prop) {
    return this._propBind(prop, this.style, 'Style');
  };

  Tag.prototype.attr = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.nodeAttrs, 'NodeAttrs');
  };

  Tag.prototype.attrBind = function(prop) {
    return this._propBind(prop, this.nodeAttrs, 'NodeAttrs');
  };

  Tag.prototype._propBind = function(prop, props, type) {
    var bound, boundProps, me;
    boundProps = this['bound' + type];
    if (bound = boundProps[prop]) {
      return bound;
    } else {
      me = this;
      return boundProps[prop] = react(function() {
        return me._prop(prop, props, type);
      });
    }
  };

  Tag.prototype._prop = function(args, props, type) {
    var key, prop, v, value;
    if (args.length === 0) {
      return props;
    }
    if (args.length === 1) {
      prop = args[0];
      if (typeof prop === 'string') {
        value = props[prop];
        if (value != null) {
          if (typeof value === 'function') {
            return domValue(value());
          } else {
            return domValue(value);
          }
        } else {
          return domValue(this['cache' + type][prop]);
        }
      } else {
        for (key in prop) {
          v = prop[key];
          this.setProp(key, v, props, type);
        }
      }
    } else if (args.length === 2) {
      if (type === 'NodeAttrs') {
        this.setProp(args[0], args[1], props, type);
      } else {
        this.setProp(args[0], args[1], props, type);
      }
    }
    return this;
  };

  Tag.prototype.setProp = function(prop, value, props, type) {
    var bound, fn, me, oldValue;
    prop = attrToPropName(prop);
    value = domField(value);
    oldValue = props[prop];
    if (value === oldValue) {
      return this;
    } else if (oldValue == null) {
      if (typeof value === 'function') {
        me = this;
        this['invalidate' + type][prop] = fn = function() {
          var bound;
          me.addActivity(props, prop, type, true);
          if (bound = me['bound' + type][prop]) {
            bound.invalidate();
          }
          return props[prop] = value;
        };
        value.onInvalidate(fn);
        this.addActivity(props, prop, type);
        props[prop] = value;
      } else if (value !== this['cache' + type][prop]) {
        this.addActivity(props, prop, type);
        if (bound = this['bound' + type][prop]) {
          bound.invalidate();
        }
        props[prop] = value;
      }
    } else {
      if (typeof oldValue === 'function') {
        oldValue.offInvalidate(this['invalidate' + type][prop]);
      }
      if (typeof value === 'function') {
        me = this;
        this['invalidate' + type][prop] = fn = function() {
          me.addActivity(props, prop, type, true);
          if (bound = me['bound' + type][prop]) {
            bound.invalidate();
          }
          return props[prop] = value;
        };
        value.onInvalidate(fn);
      }
      if (bound = this['bound' + type][prop]) {
        bound.invalidate();
      }
      props[prop] = value;
    }
    return this;
  };

  Tag.prototype.addActivity = function(props, prop, type) {
    this['hasActive' + type] = true;
    this.hasActiveProperties = true;
    if (!this.node) {
      return;
    }
    return this.invalidate();
  };

  Tag.prototype.bind = function(eventNames, handler, before) {
    var eventName, _i, _len;
    if (arguments.length === 1) {
      for (eventName in eventNames) {
        handler = eventNames[eventName];
        this.bindOne(eventName, handler);
      }
    } else {
      if (!this.events) {
        this.events = {};
      }
      eventNames = eventNames.split('\s+');
      for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
        eventName = eventNames[_i];
        this.bindOne(eventName, handler, before);
      }
    }
    return this;
  };

  Tag.prototype.bindOne = function(eventName, handler, before) {
    var eventHandlers, events, index;
    if (eventName.slice(0, 2) !== 'on') {
      eventName = 'on' + eventName;
    }
    events = this.events;
    eventHandlers = events[eventName];
    if (!eventHandlers) {
      events[eventName] = [handler];
      if (this.node) {
        this.node[eventName] = eventHandlerFromArray(events[eventName], eventName, this);
      } else {
        this.hasActiveEvents = true;
        this.hasActiveProperties = true;
      }
    } else {
      index = eventHandlers.indexOf(handler);
      if (index >= 0) {
        return this;
      }
      if (before) {
        eventHandlers.unshift.call(eventHandlers, handler);
      } else {
        eventHandlers.push.call(eventHandlers, handler);
      }
    }
    return this;
  };

  Tag.prototype.unbind = function(eventNames, handler) {
    var eventHandlers, eventName, events, index, _i, _len;
    eventNames = eventNames.split('\s+');
    events = this.events;
    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
      eventName = eventNames[_i];
      if (eventName.slice(0, 2) !== 'on') {
        eventName = 'on' + eventName;
      }
      eventHandlers = events[eventName];
      if (!eventHandlers) {
        continue;
      }
      index = eventHandlers.indexOf(handler);
      if (index >= 0) {
        eventHandlers.splice(index, 1);
        if (!eventHandlers.length) {
          events[eventName] = null;
          this.node && (this.node[prop] = null);
        }
      }
    }
    return this;
  };

  Tag.prototype.addClass = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.className.extend(items);
    if (this.node && !this.className.valid) {
      this.hasActiveProperties = true;
      this.invalidate();
    }
    return this;
  };

  Tag.prototype.removeClass = function() {
    var items, _ref4;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    (_ref4 = this.className).removeClass.apply(_ref4, items);
    if (this.node && !this.className.valid) {
      this.hasActiveProperties = true;
      this.invalidate();
    }
    return this;
  };

  Tag.prototype.show = function(display) {
    if (typeof display === 'function') {
      display = display();
      if (display == null) {
        display = '';
      }
    }
    if (display == null) {
      this.setProp('display', 'block', this.style, 'Style');
    } else if (display === 'visible') {
      this.setProp('visibility', 'visible', this.style, 'Style');
    } else {
      this.setProp('display', display, this.style, 'Style');
    }
    dc.update();
    return this;
  };

  Tag.prototype.hide = function(display) {
    if (typeof display === 'function') {
      display = display();
      if (display == null) {
        display = '';
      }
    }
    if (!display) {
      this.setProp('display', 'none', this.style, 'Style');
    } else if (display === 'hidden') {
      this.setProp('visibility', 'hidden', this.style, 'Style');
    } else {
      this.setProp('display', display, this.style, 'Style');
    }
    dc.update();
    return this;
  };

  Tag.prototype.showHide = function(status, test, display) {
    var fn, me, method, oldDisplay, style;
    style = this.style;
    test = domField(test);
    oldDisplay = style.display;
    if (!oldDisplay) {
      this.addActivity(style, 'display', 'Style', this.node);
    } else if (typeof oldDisplay === 'function' && oldDisplay.offInvalidate) {
      oldDisplay.offInvalidate(this.invalidateStyle.display);
    }
    style.display = method = flow(test, oldDisplay, function() {
      var d;
      if ((typeof test === 'function' ? !!test() : !!test) === status) {
        if (display) {
          if (typeof display === 'function') {
            return display();
          } else {
            return display;
          }
        } else if (oldDisplay != null) {
          if (typeof oldDisplay === 'function') {
            d = oldDisplay();
          } else {
            d = oldDisplay;
          }
          if (d !== 'none') {
            return d;
          } else {
            return 'block';
          }
        } else {
          return oldDisplay = 'block';
        }
      } else {
        return 'none';
      }
    });
    me = this;
    this.invalidateStyle.display = fn = function() {
      me.addActivity(style, 'display', 'Style', true);
      return style.display = method;
    };
    method.onInvalidate(fn);
    this.style = style;
    return this;
  };

  Tag.prototype.showOn = function(test, display) {
    return this.showHide(true, test, display);
  };

  Tag.prototype.hideOn = function(test, display) {
    return this.showHide(false, test, display);
  };

  Tag.prototype.getChildParentNode = function(child) {
    return this.node;
  };

  Tag.prototype.createDom = function() {
    var childNodes, children, length, nextNodes, node;
    this.valid = true;
    this.node = node = this.namespace ? document.createElementNS(this.namespace, this.tagName) : document.createElement(this.tagName);
    node.component = this;
    this.hasActiveProperties && this.updateProperties();
    children = this.children;
    this.childNodes = childNodes = [];
    nextNodes = this.nextNodes;
    childNodes.length = nextNodes.length = length = children.length;
    this.childParentNode = this.node;
    this.childNextNode = null;
    if (length = children.length) {
      nextNodes[length - 1] = null;
      this.createChildrenDom();
    }
    return this.firstNode = node;
  };

  Tag.prototype.refreshDom = function() {
    this.valid = true;
    if (this.hasActiveProperties) {
      this.updateProperties();
    }
    refreshComponents.call(this);
    return this.node;
  };

  Tag.prototype.updateProperties = function() {
    var cacheNodeAttrs, cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, events, node, nodeAttrs, prop, props, style, value;
    this.hasActiveProperties = false;
    node = this.node, className = this.className;
    if (!className.valid) {
      classValue = className();
      if (classValue !== this.cacheClassName) {
        this.cacheClassName = node.className = classValue;
      }
    }
    if (this.hasActiveNodeAttrs) {
      nodeAttrs = this.nodeAttrs, cacheNodeAttrs = this.cacheNodeAttrs;
      this.hasActiveNodeAttrs = false;
      for (prop in nodeAttrs) {
        value = nodeAttrs[prop];
        delete nodeAttrs[prop];
        value = domValue(value);
        cacheNodeAttrs[prop] = node[prop] = value;
        node.setAttribute(prop, value);
      }
    }
    if (this.hasActiveProps) {
      props = this.props, cacheProps = this.cacheProps;
      this.hasActiveProps = false;
      for (prop in props) {
        value = props[prop];
        delete props[prop];
        value = domValue(value);
        cacheProps[prop] = node[prop] = value;
      }
    }
    if (this.hasActiveStyle) {
      style = this.style, cacheStyle = this.cacheStyle;
      this.hasActiveStyle = false;
      elementStyle = node.style;
      for (prop in style) {
        value = style[prop];
        delete style[prop];
        value = domValue(value);
        cacheStyle[prop] = elementStyle[prop] = value;
      }
    }
    if (this.hasActiveEvents) {
      events = this.events;
      for (eventName in events) {
        callbackList = events[eventName];
        node[eventName] = eventHandlerFromArray(callbackList, eventName, this);
      }
    }
    this.hasActiveEvents = false;
  };

  Tag.prototype.getPrevChainComponentOf = function(child) {
    var children, index;
    children = this.children;
    if (index = this.dcidIndexMap[child.dcid]) {
      return children[index - 1];
    } else {
      return null;
    }
  };

  Tag.prototype.clone = function() {
    var child, children, _i, _len, _ref4;
    children = [];
    _ref4 = this.children;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      child = _ref4[_i];
      children.push(child.clone());
    }
    return new Tag(this.tagName, this.attrs, children).copyEventListeners(this);
  };

  Tag.prototype.toString = function(indent, addNewLine) {
    var child, children, key, s, v, value, _i, _len, _ref4, _ref5, _ref6;
    if (indent == null) {
      indent = 0;
    }
    s = newLine("<" + this.tagName, indent, addNewLine);
    _ref4 = this.props;
    for (key in _ref4) {
      value = _ref4[key];
      s += ' ' + key + '=' + funcString(value);
    }
    if (this.hasActiveStyle) {
      s += ' style={';
      _ref5 = this.style;
      for (key in _ref5) {
        value = _ref5[key];
        if (typeof value === 'string') {
          s += value;
        } else {
          for (key in value) {
            v = value[key];
            s += ' ' + key + '=' + funcString(v);
          }
        }
      }
      s += '}';
    }
    s += '>';
    children = this.children;
    if (children.length > 1) {
      _ref6 = this.children;
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        child = _ref6[_i];
        s += child.toString(indent + 2, true);
      }
      return s += newLine("</" + this.tagName + ">", indent + 2, true);
    } else {
      if (children.length === 1) {
        s += children[0].toString(indent + 2);
      }
      return s += newLine("</" + this.tagName + ">", indent + 2);
    }
  };

  return Tag;

})(BaseComponent);

mixin = require('dc-util').mixin;

ListMixin = require('./ListMixin');

mixin(Tag.prototype, ListMixin);
