var addReactProxy, globalKey, normalizeItem,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

({normalizeItem} = require('dc-util'));

globalKey = 0;

/*
addReactProxy should be attached to dc and called like below:
  dc.addReactProxy(React, ReactDom, ReactComponent)
*/
export default module.exports = addReactProxy = function(React, ReactDom, ReactComponent) {
  var ReactProxy, dc;
  dc = this;
  dc.React = React;
  dc.ReactDom = ReactDom;
  return dc.ReactProxy = ReactProxy = class ReactProxy extends ReactComponent {
    constructor(props) {
      var component;
      super(props);
      this.renderNormalized = this.renderNormalized.bind(this);
      this.renderItem = this.renderItem.bind(this);
      ({component} = props);
      this.component = component;
      component.proxy = this;
      return;
    }

    componentWillMount() {
      this.component.emit('mounting');
    }

    componentDidMount() {
      this.component.node = ReactDom.findDOMNode(this);
      this.component.watch();
      if (this.component.mounted) {
        dc.error('component should be mounted under only one place');
      }
      this.component.emit('mounted');
      dc.emit('mounted');
      this.component.mounted = true;
    }

    componentWillUnmount() {
      dc.emit('unmounting');
      this.component.emit('unmounting');
      this.component.mounted = false;
      this.component.node = null;
    }

    componentDidCatch(error) {
      return dc.error(error);
    }

    componentWillUpdate(prevProps, prevState) {
      dc.emit('updating');
      this.component.emit('updating');
    }

    componentDidUpdate(prevProps, prevState) {
      this.component.node = ReactDom.findDOMNode(this);
      this.component.emit('updated');
      dc.emit('updated');
    }

    renderNormalized(item) {
      var children, directive, focusid, keepid, key, onBlur, onFocus, props, reactElement, ref, tag, value;
      boundMethodCheck(this, ReactProxy);
      if (item == null) {
        return null;
      } else if (typeof item === 'string') {
        return item;
      } else if (dc.React.isValidElement(item)) {
        return item;
      } else {
        props = Object.assign({}, item[1]);
        for (key in props) {
          value = props[key];
          if (key[0] === '$') {
            directive = dc.directives[key];
            delete item[1][key];
            item = directive.call(this.component, item, value);
          }
        }
        [tag, props, children] = item;
        if (tag === 'input') {
          if (children.length > 1) {
            dc.error('input element should not have multiple children');
          } else if (children.length === 1) {
            if (typeof children[0] !== 'string') {
              dc.error('the child of input is used as model field, it should be a string');
            }
            item = dc.directives.$model.call(this.component, item, children[0]);
            props = item[1];
            children = [];
          }
        }
        if (!props.key) {
          props.key = globalKey++;
        }
        if ((focusid = props.focusid) != null) {
          ref = props.ref;
          props.ref = function(el) {
            ref && ref(el);
            if (focusid === dc.focusid) {
              dc.focusNode = el;
            }
          };
          onFocus = props.onFocus;
          props.onFocus = function(event) {
            onFocus && onFocus(event);
            dc.focusid = focusid;
          };
          onBlur = props.onBlur;
          props.onBlur = function(event) {
            onBlur && onBlur(event);
            dc.focusid = null;
          };
        }
        children = children.map((child) => {
          return this.renderNormalized(child);
        });
        if (!children.length) {
          children = null;
        } else if (children.length === 1) {
          if (props.useSingleChildren) {
            children = children[0];
          }
        }
        if (keepid = props.keepid) {
          if (reactElement = dc.keepReactElementMap[keepid]) {
            return reactElement;
          } else {
            delete props.keepid;
            reactElement = React.createElement(tag, props, children);
            dc.keepReactElementMap[keepid] = reactElement;
            return reactElement;
          }
        } else {
          return React.createElement(tag, props, children);
        }
      }
    }

    renderItem(item) {
      boundMethodCheck(this, ReactProxy);
      item = normalizeItem(item);
      return this.renderNormalized(item);
    }

    render() {
      var component, reactElement, view;
      ({component} = this);
      //      try
      view = component.getView();
      reactElement = this.renderItem(view);
      //      catch err
      //        dc.error "catched error in ReactProxy.render:#{err}"
      return reactElement;
    }

  };
};
