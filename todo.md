### todo
* flatten the render hierarchy, skip the call to inactive component level
* more utilties for flow, to help convert normal function to reactive, reduce appended computation in reactive function, or directly invalidate the component from the changing

#### done
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

