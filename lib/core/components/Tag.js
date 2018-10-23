var BaseComponent, ListMixin, Tag, addEventListenerMap, addHandlerToCallbackArray, attrToPropName, binaryInsert, cacheElement, classFn, cloneObject, createElement, dc, directiveRegistry, domEventHandler, domField, domValue, extend, flow, funcString, mixin, newLine, react, refreshComponents, styleFrom, toComponentArray;

extend = require('extend');

({refreshComponents} = dc = require('../../dc'));

({domField, domValue} = require('../../dom-util'));

({directiveRegistry} = require('../../dc'));

classFn = require('../property/classFn');

({styleFrom} = require('../property/style'));

({attrToPropName} = require('../property/attrs'));

({domEventHandler, addEventListenerMap, addHandlerToCallbackArray} = require('../property/events'));

BaseComponent = require('./BaseComponent');

({funcString, newLine, cloneObject} = require('dc-util'));

({flow, react} = require('lazy-flow'));

toComponentArray = require('./toComponentArray');

({binaryInsert} = require('dc-util'));

({createElement, cacheElement} = require('dc-util/element-pool'));

module.exports = Tag = class Tag extends BaseComponent {
  // used for Tag.clone(...)
  FakeTag() {
    return Tag;
  }

  constructor(tagName, attrs, children) {
    super();
    if (!(this instanceof Tag)) {
      throw 'should use new SubclassComponent(...) with the subclass of Tag';
    }
    this.isTag = true;
    if (tagName && typeof tagName === 'object') {
      if (!children) {
        children = attrs;
      }
      attrs = tagName;
      tagName = attrs && attrs.tagName;
      delete attrs.tagName;
    }
    tagName = tagName || 'div';
    this.tagName = tagName.toLowerCase();
    this.namespace = attrs.namespace;
    this.poolLabel = this.generatePoolLabel();
    children = children || attrs.children;
    delete attrs.children;
    // initChildren must put before extendAttrs
    this.children = toComponentArray(children);
    this.initListMixin();
    this.initProperties();
    this.extendAttrs(attrs);
    return;
  }

  initProperties() {
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
    if (!this.domEventCallbackMap) {
      this.domEventCallbackMap = {};
    }
    this.eventUpdateConfig = {};
  }

  extendAttrs(attrs) {
    var className, generator, handler, i, j, key, len, len1, nodeAttrs, props, ref, style, styles, v, v0, value;
    ({className, style, props, nodeAttrs} = this);
    for (key in attrs) {
      value = attrs[key];
      if (key === 'style') {
        // style is this.style
        styles = styleFrom(value);
        for (key in styles) {
          value = styles[key];
          this.setProp(key, value, style, 'Style');
        }
      } else if (key === 'class' || key === 'className') {
        this.hasActiveProperties = true;
        if (typeof value === 'function') {
          value = value();
        }
        className.extend(value);
      // dom event
      } else if (key.slice(0, 2) === 'on') {
        if (!value) {
          continue;
        } else if (typeof value === 'function') {
          this.bindOne(key, value);
        } else {
          v0 = value[0];
          if (v0 === 'before' || v0 === 'after') {
            ref = value.slice(1);
            for (i = 0, len = ref.length; i < len; i++) {
              v = ref[i];
              // value is an array of handlers
              this.bindOne(key, v, v0 === 'before');
            }
          } else {
            for (j = 0, len1 = value.length; j < len1; j++) {
              v = value[j];
              // value is an array of handlers
              this.bindOne(key, v);
            }
          }
        }
      } else if (key[0] === '$') {
        // $directiveName: generator arguments list
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
  }

  restoreCacheProperties() {
    var key, nodeAttrs, props, ref, ref1, ref2, style, value;
    ({style, props, nodeAttrs} = this);
    this.hasActiveProperties = true;
    if (this.className) {
      this.hasActiveProperties = true;
      this.cacheClassName = '';
      this.className.valid = false;
    }
    ref = this.cachePropes;
    for (key in ref) {
      value = ref[key];
      if (props[key] == null) {
        this.hasActiveProps = true;
        props[key] = value;
      }
    }
    ref1 = this.cacheStyle;
    for (key in ref1) {
      value = ref1[key];
      if (style[key] == null) {
        this.hasActiveStyle = true;
        style[key] = value;
      }
    }
    ref2 = this.nodeAttrs;
    for (key in ref2) {
      value = ref2[key];
      if (nodeAttrs[key] == null) {
        this.hasActiveNodeAttrs = true;
        nodeAttrs[key] = value;
      }
    }
    this.hasActiveDomEvents = true;
    return this;
  }

  prop(...args) {
    return this._prop(args, this.props, 'Props');
  }

  css(...args) {
    return this._prop(args, this.style, 'Style');
  }

  attr(...args) {
    return this._prop(args, this.nodeAttrs, 'NodeAttrs');
  }

  _prop(args, props, type) {
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
  }

  setProp(prop, value, props, type) {
    var bound, fn, me, oldValue;
    if (type !== 'NodeAttrs') {
      prop = attrToPropName(prop);
    }
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
      // do not need to check cache
      // do not need check typeof value == 'function'
      // else null # do nothing
      if (typeof oldValue === 'function') {
        oldValue.offInvalidate(this['invalidate' + type][prop]);
      }
      // else null # do not need to offInvalidate old callback
      if (typeof value === 'function') {
        me = this;
        this['invalidate' + type][prop] = fn = function() {
          me.addActivity(props, prop, type, true);
          if (bound = me['bound' + type][prop]) {
            bound.invalidate();
          }
          return props[prop] = value;
        };
        // value will always be a reactive function after executing "value = domField(value, this)"
        value.onInvalidate(fn);
      }
      // else null # do not need  value.onInvalidate
      if (bound = this['bound' + type][prop]) {
        bound.invalidate();
      }
      props[prop] = value;
    }
    return this;
  }

  propBind(prop) {
    return this._propBind(prop, this.props, 'Props');
  }

  cssBind(prop) {
    return this._propBind(prop, this.style, 'Style');
  }

  attrBind(prop) {
    return this._propBind(prop, this.nodeAttrs, 'NodeAttrs');
  }

  _propBind(prop, props, type) {
    var bound, boundProps;
    boundProps = this['bound' + type];
    if (bound = boundProps[prop]) {
      return bound;
    } else {
      return boundProps[prop] = react(function() {
        return this._prop([prop], props, type);
      });
    }
  }

  addActivity(props, prop, type) {
    this['hasActive' + type] = true;
    this.hasActiveProperties = true;
    if (!this.node) {
      return;
    }
    return this.invalidate();
  }

  bind(eventNames, handler, before) {
    var eventName, i, isBefore, len;
    if (!this.domEventCallbackMap) {
      this.domEventCallbackMap = {};
    }
    if (arguments.length === 1) {
      for (eventName in eventNames) {
        handler = eventNames[eventName];
        this.bind(eventName, handler);
      }
    } else {
      [eventNames, isBefore] = eventNames.split(/\s*:\s*/);
      eventNames = eventNames.split(/\s+/);
      for (i = 0, len = eventNames.length; i < len; i++) {
        eventName = eventNames[i];
        this.bindOne(eventName, handler, before || isBefore);
      }
    }
    return this;
  }

  bindOne(eventName, handler, before) {
    var domEventCallbackMap, domEventCallbacks;
    if (!handler) {
      dc.error('Tag.bind: handler is undefined for event: ' + eventName);
    }
    if (eventName.slice(0, 2) !== 'on') {
      eventName = 'on' + eventName;
    }
    domEventCallbackMap = this.domEventCallbackMap || (this.domEventCallbackMap = {});
    domEventCallbacks = domEventCallbackMap[eventName] || (domEventCallbackMap[eventName] = []);
    if (this.node) {
      // the event in addEventListenerMap do not execute node[eventName]
      // e.g. https://developer.mozilla.org/en/docs/Web/Events/compositionstart
      // [2] The event was fired in versions of Gecko before 9.0, but didn't have the DOM Level 3 attributes and methods.
      // so it's necessary to addEventListener
      if (addEventListenerMap[eventName]) {
        node.addEventListener(eventName.slice(2), domEventHandler);
      } else {
        this.node[eventName] = domEventHandler;
      }
    } else {
      this.hasActiveDomEvents = true;
      this.hasActiveProperties = true;
    }
    addHandlerToCallbackArray(handler, domEventCallbacks, before);
    return this;
  }

  unbind(eventNames, handler) {
    var domEventCallbackMap, domEventCallbacks, eventName, i, index, len, node;
    eventNames = eventNames.split('\s+');
    domEventCallbackMap = this.domEventCallbackMap;
    for (i = 0, len = eventNames.length; i < len; i++) {
      eventName = eventNames[i];
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
          if (node = this.node) {
            node[prop] = null;
            node.removeEventListener(domEventHandler);
          }
        }
      }
    }
    return this;
  }

  addClass(...items) {
    this.className.extend(items);
    if (this.node && !this.className.valid) {
      this.hasActiveProperties = true;
      this.invalidate();
    }
    return this;
  }

  removeClass(...items) {
    this.className.removeClass(...items);
    if (this.node && !this.className.valid) {
      this.hasActiveProperties = true;
      this.invalidate();
    }
    return this;
  }

  show(display) {
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
    return this;
  }

  hide(display) {
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
    return this;
  }

  showHide(status, test, display) {
    var fn, me, method, oldDisplay, style;
    ({style} = this);
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
  }

  refreshDom(oldBaseComponent) {
    this.renderDom(oldBaseComponent);
    this.attachParent();
  }

  createDom() {
    var node;
    this.valid = true;
    this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
    node.component = this;
    this.updateProperties();
    this.createChildrenDom();
    this.attachChildren();
    return node;
  }

  updateDom() {
    var child, i, len, namespace, node, ref;
    this.valid = true;
    namespace = this.namespace || "http://www.w3.org/1999/xhtml";
    if (this.tagName !== this.node.tagName.toLowerCase() || namespace !== this.node.namespaceURI) {
      node = this.node;
      node.parentNode && node.parentNode.removeChild(node);
      this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
      node.component = this;
      this.childParentNode = null;
      this.restoreCacheProperties();
      this.updateProperties();
      this.createChildrenDom();
      this.holder.invalidateAttach(this);
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        child.resetAttach();
      }
      this.attachChildren();
      this.holder.propagateChildNextNode(this, node);
      return node;
    } else {
      this.updateProperties();
      this.updateChildrenDom();
      this.attachChildren();
      return this.node;
    }
  }

  invalidateAttach(child) {
    var index;
    index = this.children.indexOf(child);
    binaryInsert(index, this.attachingIndexes);
    this.attachValid = false;
    if (this.valid) {
      this.valid = false;
      this.holder && this.holder.invalidateContent(this);
    }
    return this;
  }

  updateProperties() {
    var cacheNodeAttrs, cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, node, nodeAttrs, prop, props, ref, style, value;
    if (!this.hasActiveProperties) {
      return;
    }
    this.hasActiveProperties = false;
    ({node, className} = this);
    if (!className.valid) {
      classValue = className.call(this);
      if (classValue !== this.cacheClassName) {
        this.cacheClassName = node.className = classValue;
      }
    }
    if (this.hasActiveNodeAttrs) {
      ({nodeAttrs, cacheNodeAttrs} = this);
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
      ({props, cacheProps} = this);
      this.hasActiveProps = false;
      for (prop in props) {
        value = props[prop];
        delete props[prop];
        value = domValue(value, this);
        cacheProps[prop] = node[prop] = value;
      }
    }
    if (this.hasActiveStyle) {
      ({style, cacheStyle} = this);
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
      ref = this.domEventCallbackMap;
      for (eventName in ref) {
        callbackList = ref[eventName];
        if (callbackList && callbackList.length) {
          // the event in addEventListenerMap do not execute node[eventName]
          // e.g. https://developer.mozilla.org/en/docs/Web/Events/compositionstart
          // [2] The event was fired in versions of Gecko before 9.0, but didn't have the DOM Level 3 attributes and methods.
          // so it's necessary to addEventListener
          if (addEventListenerMap[eventName]) {
            node.addEventListener(eventName.slice(2), domEventHandler);
          } else {
            node[eventName] = domEventHandler;
          }
        }
      }
    }
    this.hasActiveDomEvents = false;
  }

  setPoolLabel(poolLabel) {
    this.poolLabel = poolLabel;
    return this;
  }

  generatePoolLabel() {
    return '';
  }

  destroy() {
    var node;
    if (this.poolLabel && (node = this.node)) {
      cacheElement(node, this.poolLabel);
    }
    super.destroy();
    if (this.poolLabel && node) {
      node.innerHTML = '';
    }
    return this;
  }

  clone(options) {
    var FakeTag, attrs, domEventCallbacks, eventName, ref, result;
    attrs = {
      className: this.className.clone(),
      style: extend({}, this.cacheStyle, this.style)
    };
    extend(attrs, this.cacheProps, this.props, this.cacheNodeAttrs, this.nodeAttrs);
    ref = this.domEventCallbackMap;
    for (eventName in ref) {
      domEventCallbacks = ref[eventName];
      attrs[eventName] = domEventCallbacks.slice(0);
    }
    FakeTag = this.FakeTag();
    result = new FakeTag(this.tagName, attrs, []);
    result.__proto__ = this.__proto__;
    result.constructor = this.constructor;
    result.cloneChildrenFrom(this, options);
    result.copyEventListeners(this);
    return result.setupCloneComponent(this, options);
  }

  setupCloneComponent(srcTag, options) {
    return this.setReactive();
  }

  toString(indent = 0, addNewLine) {
    var child, children, i, key, len, ref, ref1, ref2, s, v, value;
    s = newLine(`<${this.tagName}`, indent, addNewLine);
    ref = this.props;
    for (key in ref) {
      value = ref[key];
      s += ' ' + key + '=' + funcString(value);
    }
    if (this.hasActiveStyle) {
      s += ' style={';
      ref1 = this.style;
      for (key in ref1) {
        value = ref1[key];
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
      ref2 = this.children;
      for (i = 0, len = ref2.length; i < len; i++) {
        child = ref2[i];
        s += child.toString(indent + 2, true);
      }
      return s += newLine(`</${this.tagName}>`, indent + 2, true);
    } else {
      if (children.length === 1) {
        s += children[0].toString(indent + 2);
      }
      return s += newLine(`</${this.tagName}>`, indent + 2);
    }
  }

};

({mixin} = require('dc-util'));

ListMixin = require('./ListMixin');

mixin(Tag.prototype, ListMixin);
