# Domcom
  the web framework to provide dom component

## Features
* declarational composable components with reactive function

* only render the invalidated components and refresh the really changed dom nodes with better automatic updation checking

* decouple with model and controller completely

* simple but powerful route

* convenient support for promise

* never pollute the dom because of the framework itself

* good browser compatiblity, even wieh IE 6, 7, 8

* no dependencies, no polyfill, no immutable data, no companion libraries is necessary

* no necessary to use any template language

## Samples
There is [some  samples](https://github.com/taijiweb/domcom/tree/master/demo), and a [todoMVC implementation](https://github.com/taijiweb/domcom/tree/master/demo/todomvc).

The code below give a taste of domcom:

In javascript:

    // Although it's not necessary, 
    // but I recommend to use some tool like babel to support ES6, especially destructive syntax

    {list, text, p, flow, see} = dc

    // otherwise you need write the the code like below, it's not an ideal method:
    // var demoSum, flow, list, p, see, text;​
    // list = dc.list, text = dc.text, p = dc.p, flow = dc.flow, see = dc.see;
    ​
    demoSum = function() {
      var a, b, comp, p1, t1, t2;

      a = see(1);
      b = see(2);

      comp = list((t1 = text({
        value: a,
        onchange() { return a(this.value * 1); } // ES 6

        // onchange: function() { return a(this.value * 1) } // ES5

      })), (t2 = text({
        value: b,
        onchange() { return b(this.value * 1); } // ES 6

        // onchange: function() { return b(this.value * 1);}  // ES5

      })), p1 = p(flow.add(a, b)));

      dc.updateWhen([t1, t2], 'change', p1);

      return comp.mount();
    };
    ​
    demoSum();
​
In coffee-script(recommended):

    {list, text, p, flow, see} = dc

    demoSum = ->

        a = see 1; b = see 2

        comp = list \
            (t1 = text value: a, onchange: -> a @value*1),
            (t2 = text value: b, onchange: -> b @value*1),
            p1 = p flow.add a, b

        dc.updateWhen [t1, t2], 'change', p1

        comp.mount()

    demoSum()

## download and install:
    npm install --save domcom

    `<script src="path/to/domcom.js"/>`

    `<script src="path/to/domcom.min.js"/>`

  or use the cdn provided by jsdelivr.net:

    `<script src="http://cdn.jsdelivr.net/domcom/0.1/domcom.min.js"/>`

## document

  See [doc/](https://github.com/taijiweb/domcom/tree/master/doc) for the document. Both English and Chinese document are provided.

  **中文文档在 [doc/Chinese/](https://github.com/taijiweb/domcom/tree/master/doc/Chinese) 文件夹。**

## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)
