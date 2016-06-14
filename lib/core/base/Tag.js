var BaseComponent, ListMixin, Tag, addHandlerToCallbackArray, attrToPropName, binaryInsert, classFn, cloneObject, dc, directiveRegistry, domEventHandler, domField, domValue, extend, flow, funcString, mixin, newLine, react, refreshComponents, styleFrom, toComponentArray, _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

extend = require('extend');

refreshComponents = (dc = require('../../dc')).refreshComponents;

_ref = require('../../dom-util'), domField = _ref.domField, domValue = _ref.domValue;

directiveRegistry = require('../../dc').directiveRegistry;

_ref1 = require('../property'), classFn = _ref1.classFn, styleFrom = _ref1.styleFrom, domEventHandler = _ref1.domEventHandler, attrToPropName = _ref1.attrToPropName, addHandlerToCallbackArray = _ref1.addHandlerToCallbackArray;

BaseComponent = require('./BaseComponent');

_ref2 = require('dc-util'), funcString = _ref2.funcString, newLine = _ref2.newLine, cloneObject = _ref2.cloneObject;

_ref3 = require('lazy-flow'), flow = _ref3.flow, react = _ref3.react;

toComponentArray = require('./toComponentArray');

binaryInsert = require('dc-util').binaryInsert;

module.exports = Tag = (function(_super) {
  __extends(Tag, _super);

  Tag.prototype.FakeTag = function() {
    return Tag;
  };

  function Tag(tagName, attrs, children) {
    if (attrs == null) {
      attrs = {};
    }
    if (!(this instanceof Tag)) {
      throw 'should use new SubclassComponent(...) with the subclass of Tag';
    }
    Tag.__super__.constructor.call(this);
    this.isTag = true;
    tagName = tagName || 'div';
    this.tagName = tagName.toLowerCase();
    this.namespace = attrs.namespace;
    this.children = toComponentArray(children);
    this.initListMixin();
    this.initProperties();
    this.extendAttrs(attrs);
    return;
  }

  Tag.prototype.initProperties = function() {
    var className, me;
    this.hasActiveProperties = false;
    this.cacheClassName = "";
    this.className = className = classFn();
    me = this;
    this.className.onInvalidate(function() {
      if (className.valid) {
        me.hasActiveProperties = true;
        return me.invalidate();
      }
    });
    this.hasActiveProps = false;
    this.cacheProps = {};
    this.props = {};
    this.boundProps = {};
    this['invalidateProps'] = {};
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
    this.hasActiveDomEvents = this.hasActiveDomEvents || false;
    if (!this.domEventCallbackMap) {
      this.domEventCallbackMap = {};
    }
    this.eventUpdateConfig = {};
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
        this.hasActiveProperties = true;
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
      } else if (key.slice(0, 3) === 'xxx') {
        continue;
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

  Tag.prototype.css = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.style, 'Style');
  };

  Tag.prototype.attr = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.nodeAttrs, 'NodeAttrs');
  };

  Tag.prototype._prop = function(args, props, type) {
    var key, prop, v;
    if (args.length === 0) {
      return props;
    }
    if (args.length === 1) {
      prop = args[0];
      if (typeof prop === 'string') {
        if (props.hasOwnProperty(prop)) {
          return domValue(props[prop], this);
        } else {
          return this['cache' + type][prop];
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
    value = domField(value, this);
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

  Tag.prototype.propBind = function(prop) {
    return this._propBind(prop, this.props, 'Props');
  };

  Tag.prototype.cssBind = function(prop) {
    return this._propBind(prop, this.style, 'Style');
  };

  Tag.prototype.attrBind = function(prop) {
    return this._propBind(prop, this.nodeAttrs, 'NodeAttrs');
  };

  Tag.prototype._propBind = function(prop, props, type) {
    var bound, boundProps;
    boundProps = this['bound' + type];
    if (bound = boundProps[prop]) {
      return bound;
    } else {
      return boundProps[prop] = react(function() {
        return this._prop([prop], props, type);
      });
    }
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
    var eventName, isBefore, _i, _len, _ref4;
    if (!this.domEventCallbackMap) {
      this.domEventCallbackMap = {};
    }
    if (arguments.length === 1) {
      for (eventName in eventNames) {
        handler = eventNames[eventName];
        this.bind(eventName, handler);
      }
    } else {
      _ref4 = eventNames.split(/\s*:\s*/), eventNames = _ref4[0], isBefore = _ref4[1];
      eventNames = eventNames.split(/\s+/);
      for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
        eventName = eventNames[_i];
        this.bindOne(eventName, handler, before || isBefore);
      }
    }
    return this;
  };

  Tag.prototype.bindOne = function(eventName, handler, before) {
    var domEventCallbackMap, domEventCallbacks;
    if (eventName.slice(0, 2) !== 'on') {
      eventName = 'on' + eventName;
    }
    domEventCallbackMap = this.domEventCallbackMap || (this.domEventCallbackMap = {});
    domEventCallbacks = domEventCallbackMap[eventName] || (domEventCallbackMap[eventName] = []);
    if (this.node) {
      this.node[eventName] = domEventHandler;
    } else {
      this.hasActiveDomEvents = true;
      this.hasActiveProperties = true;
    }
    addHandlerToCallbackArray(handler, domEventCallbacks, before);
    return this;
  };

  Tag.prototype.unbind = function(eventNames, handler) {
    var domEventCallbackMap, domEventCallbacks, eventName, index, _i, _len;
    eventNames = eventNames.split('\s+');
    domEventCallbackMap = this.domEventCallbackMap;
    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
      eventName = eventNames[_i];
      if (eventName.slice(0, 2) !== 'on') {
        eventName = 'on' + eventName;
      }
      domEventCallbacks = domEventCallbackMap[eventName];
      if (!domEventCallbacks) {
        continue;
      }
      index = domEventCallbacks.indexOf(handler);
      if (index >= 0) {
        domEventCallbacks.splice(index, 1);
        if (!domEventCallbacks.length) {
          domEventCallbackMap[eventName] = null;
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
    this.render();
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
    this.render();
    return this;
  };

  Tag.prototype.showHide = function(status, test, display) {
    var fn, me, method, oldDisplay, style;
    style = this.style;
    test = domField(test, this);
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

  Tag.prototype.refreshDom = function(oldBaseComponent) {
    this.renderDom(oldBaseComponent);
    this.attachParent();
  };

  Tag.prototype.createDom = function() {
    var node;
    this.node = this.firstNode = node = this.namespace ? document.createElementNS(this.namespace, this.tagName) : document.createElement(this.tagName);
    node.component = this;
    this.updateProperties();
    this.createChildrenDom();
    this.attachChildren();
    this.removeChildrenDom();
    return node;
  };

  Tag.prototype.updateDom = function() {
    this.updateProperties();
    this.updateChildrenDom();
    this.attachChildren();
    this.removeChildrenDom();
    return this.node;
  };

  Tag.prototype.invalidateAttach = function(child) {
    var index;
    index = this.children.indexOf(child);
    binaryInsert(index, this.attachParentIndexes);
    if (this.holder) {
      if (this.attachValid && this.valid) {
        this.holder.invalidateContent(this);
      }
      this.valid = false;
      this.attachValid = false;
    }
    return this;
  };

  Tag.prototype.updateProperties = function() {
    var cacheNodeAttrs, cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, node, nodeAttrs, prop, props, style, value, _ref4;
    if (!this.hasActiveProperties) {
      return;
    }
    this.hasActiveProperties = false;
    node = this.node, className = this.className;
    if (!className.valid) {
      classValue = className.call(this);
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
        value = domValue(value, this);
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
        value = domValue(value, this);
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
        value = domValue(value, this);
        cacheStyle[prop] = elementStyle[prop] = value;
      }
    }
    if (this.hasActiveDomEvents) {
      _ref4 = this.domEventCallbackMap;
      for (eventName in _ref4) {
        callbackList = _ref4[eventName];
        if (callbackList && callbackList.length) {
          node[eventName] = domEventHandler;
        }
      }
    }
    this.hasActiveDomEvents = false;
  };

  Tag.prototype.clone = function(options) {
    var FakeTag, attrs, domEventCallbacks, eventName, result, _ref4;
    attrs = {
      className: this.className.clone(),
      style: extend({}, this.cacheStyle, this.style)
    };
    extend(attrs, this.cacheProps, this.props, this.cacheNodeAttrs, this.nodeAttrs);
    _ref4 = this.domEventCallbackMap;
    for (eventName in _ref4) {
      domEventCallbacks = _ref4[eventName];
      attrs[eventName] = domEventCallbacks.slice(0);
    }
    FakeTag = this.FakeTag();
    result = new FakeTag(this.tagName, attrs, []);
    result.__proto__ = this.__proto__;
    result.constructor = this.constructor;
    result.cloneChildrenFrom(this, options);
    result.copyEventListeners(this);
    return result.setupCloneComponent(this, options);
  };

  Tag.prototype.setupCloneComponent = function(srcTag, options) {
    return this.setReactive();
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
