# domcom
the web framework to provide dom component

## Features
* composable component

* the value of any property and other stuffs can be reactive function

    The stuffs, like dom property, the test condition of If, Case component, the items of Repeat component, can be functions. Different from the usage of function as property value in jQuery, the functions are used to declares the computating method for every rendering.

* update only the difference between the dom and the cache, and skip the inactive component when updating dom

* decouple with model and controller

* simple but powerful router

* the root of the component may be multiple dom elements

## Sample
There is some basic samples, and a todoMVC implementation. The code below give a taste of domcom:

    # domcom likes coffee-script
    {list, text, p, flow, see} = require 'domcom'
    demoSum = ->
      a = see 1; b = see 2
      comp = list(t1=text(value: a, {onchange:-> a @value*1}),
                  t2=text(value: b, {onchange:-> b @value*1}),
                  p1=p(flow.add a, b))
      dc.updateWhen([t1, t2], 'change', p1)
      comp.mount()

    demoSum()

## get start
`npm install domcom`

`<script src="path/to/domcom.js"/>`

or

`<script src="path/to/domcom.min.js"/>`


## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)
