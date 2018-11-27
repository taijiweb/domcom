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
* simple API:  

        component = dc({data, view});
        component.mount(parentNode);
        component.update()  

* use plain array tree as view language, long live js, byebye JSX

* MVC pattern( data/view/Component), byebye flux/redux  
  data is the model, Component is just the controller
 
* render to dom by react( maybe  add other proxy, e.g. Vue, in the future)

## Samples
There is [some  samples](https://github.com/taijiweb/domcom/tree/master/demo), and a [todoMVC implementation](https://github.com/taijiweb/domcom/tree/master/demo/todomvc).

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
                        data.a = event.target.value*1
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
