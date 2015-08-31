# domcom
the web framework to provide dom component

## Features
* the value of any property and other stuffs can be reactive function

    The stuffs, like dom property, the test condition of If, Case component, the items of Repeat component, can be functions. Different from the usage of function as property value in jQuery, the functions are used to declares the computating method for every rendering.

* update only the difference between the dom and the cache

* skip the inative component when updating dom

* decouple with model and controller

* composable component

* the root of the component may be multiple dom elements

## Sample
There is some [basic samples](path/to/basic/samples), and a [todoMVC implementation](path/to/basic/samples). The code below give a taste of domcom:

    # coffee-script
    {list, text, p, flow, bind} = require 'domcom'
    demoSum = ->
      a = bind 1; b = bind 2
      comp = list(text(value: a, {onchange:-> a @value*1}),
                  text(value: b, {onchange:-> b @value*1}),
                  p(flow.add a, b))
      dc.updateWhen([text1, text2], 'change', p1)
      comp.mount()

    demSum()

## get start
`npm install domcom`

`<script src="path/to/domcom.js"/>`

or

`<script src="path/to/domcom.min.js"/>`


## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)

## Todo
* todo: browser compatibility
* todo: promise
* todo: dom event delegation
* todo: route
* todo: template similar to JSX(reactjs), MSX(mythil.js)

