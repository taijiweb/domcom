# domcom
the web framework to provide dom component

## Features
* the value of any property and other stuffs can be a function

    The stuffs, like dom property, the test condition of If, Case component, the items of Repeat component, can be functions. Different from the usage of function as property value in jQuery, the functions are used to declares the computating method for every rendering.
* update only the difference between the dom and the cache

* skip the inative component when updating dom

* decouple with model and controller

* composable component

* the root of the component may be multiple dom elements

## Sample
    # coffee-script
    {bindings, list, text, p} = require 'domcom'
    demoSum = ->
      {$a, $b} = bindings({a: 1, b: 2})
      comp = list(text({onchange:->comp.update()}, $a),
                  text({onchange:->comp.update()}, $b),
                  p(-> parseFloat($a())+parseFloat($b())))
      comp.mount()
    demSum()

## get start
`npm install domcom`, and `<script src="path/to/domcom.js"/>` or `<script src="path/to/domcom.min.js"/>`,


## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)

## Todo
* todo: browser compatibility
* todo: promise
* todo: dom event delegation
* todo: route
* todo: allow or prevent to modify component after creating dom from component
* todo: template similar to JSX(reactjs), MSX(mythil.js)

