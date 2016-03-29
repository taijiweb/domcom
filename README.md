# Domcom
  the web framework to provide dom component

## document

  See [doc/](https://github.com/taijiweb/domcom/tree/master/doc) for the document. Both English and Chinese document are provided.

#### 中文文档: **请看 [doc/Chinese/](https://github.com/taijiweb/domcom/tree/master/doc/Chinese) 文件夹。**

## download and install

    npm install --save domcom

  or use the cdn provided by jsdelivr.net (replace "x.y.z" with the real version number):

    `<script src="http://cdn.jsdelivr.net/domcom/x.y.z/domcom.min.js"/>`

## Features
* declarative composable components with reactive function

* only render the invalidated components and refresh the really changed dom nodes with better automatic update status checking

* decouple with model and controller completely

* simple but powerful route

* convenient support for promise

* never pollute the dom because of the framework itself

* good browser compatiblity, even with IE 6, 7, 8

* no dependencies, no polyfill, no immutable data, no companion libraries is necessary

* no necessary to use any template language

## Samples
There is [some  samples](https://github.com/taijiweb/domcom/tree/master/demo), and a [todoMVC implementation](https://github.com/taijiweb/domcom/tree/master/demo/todomvc).

The code below give a taste of domcom:

In javascript:

    // Although it's not necessary, 
    // but I recommend to use some tool like babel to support ES6, especially destructive syntax

    const {list, text, p, flow, see} = dc

    // otherwise you need write the the code like below, it's not an ideal method:
    // var demoSum, flow, list, p, see, text;​
    // list = dc.list, text = dc.text, p = dc.p, flow = dc.flow, see = dc.see;
    ​
    demoSum = function() {
      var a, b, comp, p1, t1, t2;

      a$ = see(1);
      b$ = see(2);

      comp = list((t1 = text({
        value: a$,
        onchange() { return a$(this.value * 1); } // ES 6

        // onchange: function() { return a$(this.value * 1) } // ES5

      })), (t2 = text({
        value: b$,
        onchange() { return b$(this.value * 1); } // ES 6

        // onchange: function() { return b$(this.value * 1);}  // ES5

      })), p1 = p(flow.add(a$, b$)));

      dc.updateWhen([t1, t2], 'change');

      return comp.mount();
    };
    ​
    demoSum();
​
In coffee-script(recommended):

    {list, text, p, flow, see} = dc

    demoSum = ->

        a$ = see 1; b$ = see 2

        comp = list \
            (t1 = text value: a$, onchange: -> a$ @value*1),
            (t2 = text value: b$, onchange: -> b$ @value*1),
            p1 = p flow.add a$, b$

        dc.updateWhen [t1, t2], 'change'

        comp.mount()

    demoSum()

## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)
