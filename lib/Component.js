var Component, isArray, isMap, isObject, newDcid, normalizeDomElement, watchDataField, watchField,
  hasProp = {}.hasOwnProperty;

import Emitter from './Emitter';

({newDcid, isArray, isObject, normalizeDomElement, watchField, watchDataField, isMap} = require('dc-util'));

/*
  部件基类
  @params config: the config object for the component, it can have the fileds below
    data: the real data of the component or a function to generate the data
    view: the view object or a function to generate the view
    any other fields that do not conflict with component itself
*/
export default module.exports = Component = class Component extends Emitter {
  constructor(config) {
    super();
    this.init();
    this.checkConfig(config);
    this.config = config;
    Object.assign(this, config);
    this.watch();
    return;
  }

  init() {
    this.dcid = newDcid();
    this.base = null;
    this.reactElement = null;
    this.node = null;
    this.mounted = false;
    this.reactElement = dc.React.createElement(dc.ReactProxy, {
      component: this
    });
  }

  checkConfig(config) {
    var illegals, key, value;
    illegals = [];
    for (key in config) {
      if (!hasProp.call(config, key)) continue;
      value = config[key];
      if (this[key] !== void 0) {
        illegals.push(key);
      }
    }
    if (illegals.length) {
      dc.error(`illegal key in config: ${illegals.join(', ')}, they are used by dc.Component itself!`);
    }
  }

  watch() {
    var components, config, data, key, ref;
    if (config = this.config) {
      for (key in config) {
        if (!hasProp.call(config, key)) continue;
        watchField(this, key, this);
      }
    }
    if ((data = this.getData(dc.store)) && isMap(data)) {
      components = data.watchingComponents;
      if (!components) {
        data.watchingComponents = [this];
      } else {
        if (components.indexOf(this) === -1) {
          components.push(this);
        }
      }
      if (data && isMap(data)) {
        ref = config.data;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          watchDataField(config.data, key, this);
        }
      }
    }
    return this;
  }

  stopWatch() {
    var components, config, data, index, key, v;
    if (config = this.config) {
      for (key in config) {
        if (!hasProp.call(config, key)) continue;
        v = this[key];
        delete this[key];
        this[key] = v;
      }
      if ((data = config.data) && isMap(data)) {
        components = data.watchingComponents;
        index = components.indexOf(this);
        if (index >= 0) {
          components.splice(index, 1);
          delete data.watchingComponents;
          if (!components.length) {
            for (key in data) {
              if (!hasProp.call(data, key)) continue;
              v = data[key];
              delete data[key];
              data[key] = v;
            }
          }
        }
      }
    }
    return this;
  }

  copy() {
    var comp;
    comp = new Component({});
    Object.assign(comp, this);
    comp.init();
    comp.watch();
    return comp;
  }

  extend(config) {
    var comp;
    comp = new Component({});
    comp.checkConfig(config);
    Object.assign(comp, this, config);
    comp.init();
    comp.config = Object.assign({}, this.config, config);
    comp.watch();
    return comp;
  }

  mount(mountNode) {
    this._prepareMount(mountNode);
    dc.mountMap[this.dcid] = this;
    dc.ReactDom.render(this.reactElement, this.parentNode);
    this.emit('mounted');
  }

  update() {
    if (this.mounted) {
      // any object to trigger the update
      this.proxy.setState({});
    }
  }

  _prepareMount(mountNode) {
    var parentNode;
    parentNode = normalizeDomElement(mountNode) || document.body;
    if (parentNode.childNodes.length) {
      dc.error('should not mount to node which is not empty:', mountNode);
    }
    this.parentNode = parentNode;
  }

  getData() {
    if (typeof this.data === 'function') {
      return this.data.call(this, dc.store);
    } else {
      return this.data;
    }
  }

  getView() {
    var data, view;
    data = this.getData();
    if (this.view) {
      if (typeof this.view === 'function') {
        view = this.view.call(this, data);
      } else {
        view = this.view;
      }
      return view;
    }
  }

  unmount() {
    var node, parentNode;
    this.emit('unmounting');
    ({parentNode} = this);
    if (parentNode.childNodes.length) {
      node = parentNode.childNodes[0];
      parentNode.removeChild(node);
    }
    //tell React do not warn about this
    parentNode._reactRootContainer = void 0;
    this.proxy.component = null;
    this.proxy = null;
    delete dc.mountMap[this.dcid];
    this.unmounted = false;
  }

};
