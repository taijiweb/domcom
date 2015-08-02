# domcom
提供DOM部件的前端web框架

## 框架特性
* 任何dom特性都可以是函数
* 只有在dom和缓存直接有差异的时候才更新dom
* 更新dom的时候跳过不活跃的部件
* 最大化解耦model和controller
* 可以组合的部件
* 部件的根不必限定为单个dom元素

## 示例
    # coffee-script
    {bindings, list, text, p} = require 'domcom'
    demoSum = ->
      {_a, _b} = bindings({a: 1, b: 2})
      comp = list(text({onchange:->comp.update()}, _a),
                  text({onchange:->comp.update()}, _b),
                  p(-> parseFloat(_a())+parseFloat(_b())))
      comp.mount()
    demSum()

## LICENSE
MIT, 参见 LICENSE.md

## todo
* todo: 浏览器兼容性
* todo: promise
* todo: dom事件分派(dom event delegation)
* todo: 路由(route)
* todo: 允许(或阻止？）在为部件创建DOM后修改部件
* todo: 模板：类似于JSX(reactjs), MSX(mythil.js)的东东