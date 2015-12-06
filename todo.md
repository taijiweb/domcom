### todo
* Isomorphic JavaScript: rendering html on the server side
* error processing: dc.onerror and dc.error: should can skip error and continue to process the components afterwards
* minify the removing and reinsert of node as possible
  A B C D -> B C D A, should only removing and reinsert A, because only A's succ is changed
  A B C D -> D A B C, should only removing reinsert D, because only D's succ is changed.
  method:
    record parent and nextNode, and the status of whether they are lived in dom
    Component.alive field

#### done
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

