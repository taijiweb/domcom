# domcom
the web framework to provide dom component

## feature
* the value of any property can be a function which lead to update dynamically
* update dom only when there is some differences between the dom and the cache
* skip the inative component when updating dom
* maximiumly decouple with model and controller
* composable component
* the root of the component is NOT restricted to be a dom element

## sample
    # coffee-script
    bindings, list, text, p} = require 'domcom'
    demoSum = ->
      {_a, _b} = bindings({a: 1, b: 2})
      comp = list(text({onchange:->comp.update()}, _a),
                  text({onchange:->comp.update()}, _b),
                  p(-> parseFloat(_a())+parseFloat(_b())))
      comp.mount()
    demSum()

## LICENSE
MIT, see LICENSE.md

## todo
* todo: browser compatibility
* todo: promise
* todo: dom event delegation
* todo: route
* todo: allow or prevent to modify component after creating dom from component
* todo: template similar to JSX(reactjs), MSX(mythil.js)

