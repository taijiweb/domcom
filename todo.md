# todo
dc-directive 12.8
test material-ui in domcom 11.25
self controled component, e.g. dialog.open(), dialog.close() 11.25
test antd in domcom 11.25
documents 11.25
VueProxy 11.25

### done
####new design
watch component and it's data 12.8-12.8
check only one instance of the component in th dom tree.  11.28-12.8
Component.extend, Component.copy 11.28-12.8
go on removing unused code 11.27-11.28
decouple dc and dc-proxy 11.27--11.28
binds function in config field 11.27-11.27
check the fields in config, do not conflict with Component' prototype 11.27-11.27
test event in domcom 11.25-11.25 add one test
test antd in domcom 11.25-11.25 started with simple button
test material-ui in domcom 11.25-11.25 started with simple button
component in view 11.25-11.25
test classname with false value 11.25-11.25
multiple props in on  list element 11.25-11.25
class in both head string and props 11.2-11.25
style in both head string and props 11.25-11.25
dc.update: update all mounted component 11.25-11.25

data:Component.getData()
view:Component.getView
[] (embedded list） style  view
ReactProxy.render(), renderItem, dcutil normalizeItem

====================================================================================================================
####old design
* separate the code for updating dom and attach/detach dom
* flatten the render hierarchy, skip the call to inactive component level
* delegation to events
* error processing: dc.onerror and dc.error
* minify the removing and reinsert of node as possible
* rendering html on the server side: https://github.com/taijiweb/dc-html
* instead of comparing TransformComponent.content too early, only refresh while new baseComponent is different from old baseComponent
* browser compatibility
* use requestAnimationFrame
* Component Event: on, off, emit
* beforeMount, afterMount
* jquery style api
* support object with Each
* rename Repeat to Each
* multiple test if-else if-else, similar to "cond" in lisp
  cond: (test, component, ..., otherwise)
* promise
* allow to modify the component
* route
* the property of the component can only be a function or a value
* the value of the private events property of the component always be array of functions, provide bind/unbind method
* skip the inactive component
* only render the difference, according the cache

