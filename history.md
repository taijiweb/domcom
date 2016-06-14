### 2016-6-14
* bug fix: core/index is removed

### 2016-6-14: v0.5.0 on github, npm
* big refactor: restore to update from top to bottom
* separate the code for updating and attaching/detaching dom

### 2016-3-17: v0.2.0 on github, npm
* a very big refactor: do not update from top to bottom, directly update the component in renderingMap instead
* Each component is removed, in favor of the new every, each, funcEacn and mapEach function, which generate watched list component
* Case component supports to use array as map
* set attributes by using  attr_xxx
* new api: ListMixin.insertChildBefore, insertAfter;
* fix bug about Component.destroy
* rename life time events to willXXXX/didXXXX,
* make Component.listeners and Tag.events field always be available, avoid to add .on or .bind after component super(...)

### 2016-1-31: v0.1.6 on github, npm
* fix a bug in webpack.config, remove the file path in .min.js file
* stop pass component as the parameter to eventHandlerFromArray, just use "node.component"
* always emit "attach" event while component to the tree, and "detach" event while removing the component from the tree

### 2016-1-16: v0.1.5 on github, npm
* api(new): new api for delegating event: Tag.delegateByHolder, Tag.delegateByComponent, Tag.delegate
* api(new): dc.error, dc.onerror
* api(change): rename component event: beforeMount -> mount, afterUnmount -> 'unmount', beforeAttatch -> attach, afterDetach -> detach; remove afterMount
* api(change): Hmtl component's super class becomes Tag, wrap with div, add Html.text setter, add attrs
* api(change): Component.renderDom() -> Component.renderDom(oldBaseComponent), delete Component.getBaseComponent
* api(change): remove Component.setNode and Component.setFirstNode
* api(change): add BaseComponent.removing field to mark removing, split Component.setParentAndNextNode to setParentNode and setNextNode
* api(change): api for new If(test, then, else, , merge, recursive), dc.mergeIf, dc.recursiveIf
* improvement: Tag.propBind, Tag.cssBind: return bound reactive function for Tag props or style props
* improvement: Tag.prop(propName) and Tag.css(propName) return domValue of props at first, if undefined then return cache value
* improvement: Component.on, Component.off
* refactor: split property.coffee to core/property/ folder (classFn, events, style, ...), and move core/prop-util.coffee to core/property/css-arith.coffee
* refactor: Both Tag and List use ListMixin
* refactor: remove constructTextLikeComponent for Text, Comment, Html, Cdata, use super(text) directly
* fix two bug: one in Component.setParentAndNextNode, another one in Component.on
* fix a bug about List.nextNode

### 2015-12-19: v0.1.4 on github, npm
* a group of new utilities: unitAdd, unitSub, unitMul, unitDiv, Tag.cssAdd, Tag.cssSub, Tag.cssMul, Tag.cssDiv
* add lost minify js back (uglifyjs)

### 2015-12-12: v0.1.3 on github, npm
* let domcom can be required out of browser
* new component: Cdata component (core/base/Cdata)
* new component: Pick component (core/base/Pick )
* change the behavior of the namespace for svg and math tag
* refactor gulp scripts
* new utility: toComponentList
* add default arguments for List and Tag (by using toComponentList)
* getBaseComponent method back: [issue #1](github.com/taijiweb/domcom/issues/1)
* decrease dom operation: [issure #5 ](https://github.com/taijiweb/domcom/issues/5)
* add some tests on every, all, nItems, fix bug in it.
* bug fix: Text Component's field "textValid" is processed wrongly
*  fix bug: fail to emit beforeAttach for content component in some cases
* fix bug: should mark removing transform component
* update document

### 2015-11-15: v0.1.2 on github, npm
* add method: Component.addController
* add method: Tag.extendAttrs
* remove extend.coffee, use npm package [extend](https://github.com/justmoon/node-extend) instead
* dc-util becomes the npm package "dc-util"
* flow/ becomes the npm package "lazy-flow"
* flow/watch-list becomes the npm package "dc-watch-list"
* update document: add some content, doc/api-reference.html(English) is finished

### 2015-11-1: v0.1.1 on github, npm
* bug fix: Each compnent attach and detach
* bug fix: flow.bind and flow.duplex caused after browser compatibility
* small update to demo, documents
* run test and demo html for the code in dist

### 2015-10-31: v0.1 on github
* finish Chinese document, add some English document
* browser compatibility
* requestAnimationFrame, updateWhen/renderWhen
* Component Event: on, off, emit
* jquery style api for Tag: prop, css, addClass, removeClass, bind, unbind
* allow to modify the component
* rename Repeat to Each, support object with Each
* every, all utility function
* Cond, Html and Nothing component
* Defer Component and other support to promise
* route
* big refactor

### 2015-8-9: v0.0.2 on github
* add autoWidthEdit component

### 2015-8-9: v0.0.1 on github
* the value of any property and other stuffs can be a function
The stuffs, like dom property, the test condition of If, Case component, the items of Repeat component, can be functions. Different from the usage of function as property value in jQuery, the functions are used to declares the computating method for every rendering.
* update only the difference between the dom and the cache
* skip the inative component when updating dom
* decouple with model and controller
* composable component
* the root of the component may be multiple dom elements

### 2015-8-2: becomes an independent project and git repository

### 2015-3: start coding for this framework, embedded another bigger project and git repository

### 2014-11: Got the idea for this project
