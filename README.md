# Domcom
  the web framework to provide dom component

## document

  See [doc/](https://github.com/taijiweb/domcom/tree/master/doc) for the document. Both English and Chinese document are provided.

#### 中文文档: **请看 [doc/Chinese/](https://github.com/taijiweb/domcom/tree/master/doc/Chinese) 文件夹。**

## download and install

    npm install --save domcom
    
useDomcom in  page by script tag，add React andReactDom  at first

        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        
or

        <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
        
and then add script tag for Domcom itself:

        <script src="path/to/domcom.js"></script> 
        <script src="path/to/domcom.min.js"></script>  

  or use the cdn provided by unpg or jsdelivr:

    
        https://unpkg.com/domcom@0.8.1/dist/domcom.js  
        https://unpkg.com/domcom@0.8.1/dist/domcom.min.js  
        https://cdn.jsdelivr.net/npm/domcom@0.8.1/dist/domcom.js  
        https://cdn.jsdelivr.net/npm/domcom@0.8.1/dist/domcom.min.js

## Features
* simple API:  

        component = dc({data, view});
        component.mount(parentNode);
        component.update()  

* use plain array tree as view language, long live js, byebye JSX

* MVC pattern( data/view/Component), byebye flux/redux  
  data is the model, Component is just the controller
 
* render to dom by react( maybe  add other proxy, e.g. Vue, in the future)

## Samples
There is [some  samples](https://github.com/taijiweb/domcom/tree/master/demo), and a [todoMVC implementation](https://github.com/taijiweb/domcom/tree/master/demo/coffee/todomvc.coffee).

The code below give a taste of domcom:

In javascript:

    const demoSum = () => {
    
          const data = { a: 1, b: 2 };

          const view = data => {
               let props1 = {
                    value: data.a,
                    onChange(event) {
                        data.a = event.target.value*1
                        comp.update()
                    }
                };
                props2 = {
                    value: data.b,
                    onChange(event) {
                        data.b = event.target.value*1
                        comp.update();
                    };
                };

              return ['div',
                        ['text', props1],
                        ['text', props2],
                        ['p', data.a + data.b]
                     ];
          };
          const comp = dc({data, view});
          comp.mount('#demo');
    }   ​
    demoSum();
    
## LICENSE
MIT, see [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)
