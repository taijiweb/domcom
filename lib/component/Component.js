var Component, dc, dcEventMixin, extend, flow, flowBind, isArray, isComponent, newDcid, normalizeDomElement;

extend = require('extend');

import Emitter from '../Emitter';

({normalizeDomElement} = require('../dom-util'));

({newDcid, isArray} = require('dc-util'));

({flow} = require('lazy-flow'));

flowBind = flow.bind;

isComponent = require('./isComponent');

dc = require('../dc');

/*
  所有部件的基类

*/
module.exports = Component = class Component extends Emitter {
  constructor(template, model) {
    super();
    this.view = null;
    this.model = null;
    this.backend = null;
    this.listeners = {}; // 部件事件侦听方法映射
  }

  /*
  设置部件模版 this.view
  */
  with(view) {
    this.view = view;
    return this;
  }

  /*
  设置部件数据模型 this.model
  */
  data(model1) {
    this.model = model1;
    return this;
  }

  /*
  设置部件后端 this.backend
  */
  use(backend) {
    this.backend = backend;
    return this;
  }

  /*
  ## 渲染部件
  * 基本步骤
  * 计算即时数据映像
  * 计算vdom
  * 更新dom
   */
  render() {
    this.data = this.compute();
    this.vdom = this.refresh();
    this.update();
    return this;
  }

  /*
  根据部件数据模型this.model计算即时数据映像this.data
  */
  compute() {}

  _prepareMount(mountNode, beforeNode) {
    if (mountNode && mountNode.component) {
      mountNode = mountNode.component;
    } else if (beforeNode && beforeNode.component) {
      console.log(mountNode);
      console.log(beforeNode);
      throw new Error('error while mounting: mountNode is not a component, but beforeNode is a component');
    }
    if (isComponent(mountNode)) {
      if (!beforeNode) {
        if (!mountNode.children) {
          console.log(mountNode);
          throw new Error('error while mounting: mountNode is a component, but is not a Tag or List component');
        }
        return mountNode.pushChild(this);
      } else {
        if (!isComponent(beforeNode)) {
          beforeNode = beforeNode.component;
          if (!beforeNode) {
            console.log(beforeNode);
            throw new Error('error while mounting: can not mount beforeNode');
          }
        }
        if (beforeNode.holder !== mountNode || !mountNode.children) {
          console.log(mountNode);
          console.log(beforeNode);
          throw new Error('both mountNode and beforeNode is component, but mountNode is not the parent of beforeNode');
        }
        return mountNode.insertChildBefore(this, beforeNode);
      }
    } else {
      this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.body;
      this.nextNode = beforeNode || this.nextNode;
      this.setHolder(dc);
      this.clearRemoving();
      return dc.rootComponentMap[this.dcid] = this;
    }
  }

  /* if mountNode is given, it should not be the node of any Component
  only use beforeNode if mountNode is given
  */
  mount(mountNode, beforeNode, forceRender) {
    this.emit('willMount');
    this._prepareMount(mountNode, beforeNode);
    this.render(forceRender);
    return this.emit('didMount');
  }

  unmount(forceRender) {
    this.emit('willUnmount');
    this.remove();
    //this.removeNode()
    dc.clean();
    return this.emit('didUnmount');
  }

  remove() {
    var firstNode, holder;
    holder = this.holder;
    if (!holder || holder === dc) {
      delete dc.rootComponentMap[this.dcid];
      firstNode = this.firstNode;
      if (firstNode && firstNode.parentNode) {
        this.markRemovingDom();
      }
    } else if (holder && holder.children) {
      holder.removeChild(this);
    } else if (holder) {
      dc.error('Should not remove the content of TransformComponent');
    }
    return this;
  }

  /* 注册部件的事件侦听回掉
   ## 调用示例
  comp.on(name, callback, before = false)
  comp.on(name, callbacks, before = false)
  comp.on({name: callback, ...}, before = false)
   */
  on(event, callback) {
    return callback;
  }

  /* 取消注册部件的事件侦听回掉
   ## 调用示例
  comp.off(name, callback)
  comp.off(name)
  comp.off(names)
  comp.off()
  comp.on({name: callback, ...})
   */
  on(event, callback) {}

  /* 发送部件事件
  */
  emit(name) {}

  replace(oldComponent, forceRender) {
    var holder;
    if (!this.destroyed && this !== oldComponent && !oldComponent.removing && !oldComponent.removed) {
      holder = oldComponent.holder;
      if (holder && holder !== dc) {
        if (holder.isTransformComponent) {
          dc.error('Should not replace the content of TransformComponent');
        } else {
          // holder is List or Tag
          holder.replaceChild(oldComponent, this);
        }
      //          holder.render(forceRender)
      //          oldComponent.removeDom()
      } else if (holder === dc) {
        this.parentNode = oldComponent.parentNode;
        this.nextNode = oldComponent.nextNode;
        oldComponent.markRemovingDom();
        this.setHolder(holder);
        this.invalidate();
        dc.rootComponentMap[this.dcid] = this;
        delete dc.rootComponentMap[oldComponent.dcid];
      }
    }
    return this;
  }

  /*
  component.renderWhen components, events, options
  component.renderWhen setInterval, interval, options
  component.renderWhen setTimeout, interval, options
  */
  renderWhen(cause, events, options) {
    options = options || {};
    options.target = [this];
    dc.renderWhen(cause, events, options);
    return this;
  }

  destroy() {
    this.emit('willDestroy');
    this.executeDestroy();
    return this.emit('didDestroy');
  }

  executeDestroy() {
    this.unmount(true);
    this.destroyed = true;
    this.listeners = null;
    if (this.node) {
      this.node.component = null;
      this.node = null;
    }
    this.baseComponent = null;
    return this.parentNode = null;
  }

  getPrevComponent() {
    var children, holder;
    if (!(holder = this.holder)) {
      return null;
    } else if (children = holder.children) {
      return children[children.indexOf(this) - 1];
    }
  }

  getNextComponent() {
    var children, holder;
    if (!(holder = this.holder)) {
      return null;
    } else if (children = holder.children) {
      return children[children.indexOf(this) - 1];
    }
  }

  setNextNode(nextNode) {
    this.nextNode = nextNode;
  }

  setHolder(holder) {
    if (this.holder && this.holder !== holder) {
      this.holder.invalidateAttach(this);
    }
    this.holder = holder;
    return this;
  }

  isOffspringOf(ancestor) {
    var holder;
    holder = this.holder;
    while (holder) {
      if (holder === ancestor) {
        return true;
      }
      holder = holder.holder;
    }
    return false;
  }

  inFamilyOf(ancestor) {
    return this === ancestor || this.isOffspringOf(ancestor);
  }

  setReactive() {
    var invalidateThis, me, reactField, reactive, ref, srcField;
    if (this.reactMap) {
      me = this;
      invalidateThis = function() {
        return me.invalidate();
      };
      ref = this.reactMap;
      for (srcField in ref) {
        reactField = ref[srcField];
        reactive = flowBind(this, srcField);
        if (typeof reactField === 'string') {
          reactive.onInvalidate(function() {
            var reaction;
            if (reaction = me[reactField]) {
              return reaction.invalidate();
            }
          });
        } else {
          reactive.onInvalidate(invalidateThis);
        }
      }
    }
    return this;
  }

  copyEventListeners(srcComponent) {
    var event, myListeners, srcListeners;
    myListeners = this.listeners;
    srcListeners = srcComponent.listeners;
    for (event in srcListeners) {
      srcListeners[event] && (myListeners[event] = srcListeners[event].splice());
    }
    return this;
  }

};

dcEventMixin = require('../dc-event');

extend(Component.prototype, dcEventMixin);
