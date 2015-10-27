# domcom
the web framework to provide dom component

## Features
* declarational composable components with reactive function

* automatically render only the invalidate parts in the dom with fine granularity

* decouple with model and controller completely

* simple but powerful router

* convenient support for promise

* never pollute the dom because of the framework itself

* the root of the component may be multiple dom elements

## Samples
There is [some  samples](https://github.com/taijiweb/domcom/tree/master/demo), and a [todoMVC implementation](https://github.com/taijiweb/domcom/tree/master/demo/todomvc).

The code below give a taste of domcom:

In javascript:

    // recommend to use some tool to support ES6 destructive syntax
    {list, text, p, flow, see} = dc

    // otherwise you need write the the code like below
    // var demoSum, flow, list, p, see, text;​
    // list = dc.list, text = dc.text, p = dc.p, flow = dc.flow, see = dc.see;
    ​
    demoSum = function() {
      var a, b, comp, p1, t1, t2;
      a = see(1);
      b = see(2);
      comp = list((t1 = text({
        value: a,
        onchange: (function() {
          return a(this.value * 1);
        })
      })), (t2 = text({
        value: b,
        onchange: (function() {
          return b(this.value * 1);
        })
      })), p1 = p(flow.add(a, b)));
      dc.updateWhen([t1, t2], 'change', p1);
      return comp.mount();
    };
    ​
    demoSum();
​
In coffee-script:

    {list, text, p, flow, see} = dc

    demoSum = ->
      a = see 1; b = see 2
      comp = list \
        (t1 = text value: a, onchange: (-> a @value*1)),
        (t2 = text value: b, onchange: (-> b @value*1)),
        p1 = p flow.add a, b
      dc.updateWhen [t1, t2], 'change', p1
      comp.mount()

    demoSum()

## get start
`npm install domcom`

`<script src="path/to/domcom.js"/>`

`<script src="path/to/domcom.min.js"/>`

## document

  See [doc/](https://github.com/taijiweb/domcom/tree/master/doc) for the document. Both English and Chinese document are provided.

  The files in the [doc/](https://github.com/taijiweb/domcom/tree/master/doc) folder with filename like "somefile.CN.md" is Chinese document.

  [doc/](https://github.com/taijiweb/domcom/tree/master/doc) 文件夹中带"somefile.CN.md"文件名的是中文文档。

## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)
