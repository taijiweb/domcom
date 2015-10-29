# Domcom

  提供DOM部件的web框架

## 框架特性

* 基于响应函数的声明式可组合部件
* 更好的自动更新检测，只更新无效部件，只刷新实际有变化的Dom节点和Dom特性
* 最大化解耦model和controller
* 简单强大的路由功能
* 方便的Propmise支持
* 绝不因框架原因污染Dom
* 兼容各种浏览器，甚至IE 6, 7, 8
* 无需依赖，无需不可变数据结构，无需浏览器或语言补丁，无需搭配程序库,无需补充解决方案

## 示例

  提供有不少[演示范例](https://github.com/taijiweb/domcom/tree/master/demo)和[todoMVC参考实现](https://github.com/taijiweb/domcom/tree/master/demo/todomvc).

  可从如下代码一窥究竟：

  使用Javascript语言：

    // 并非必须，但是推荐采用某种工具(如babel)支持ES6，特别是解构语法。

    {list, text, p, flow, see} = dc

    // 否则就需象下面这样写代码，不太理想：

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
  使用Coffee-script语言(推荐)：

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

## 开始使用

`npm install domcom`

`<script src="path/to/domcom.js"/>`

`<script src="path/to/domcom.min.js"/>`

请从[doc/Chinese中“介绍和辅导教程"](doc/Chinese/](https://github.com/taijiweb/domcom/tree/master/doc/Chinese/介绍和辅导教程.md)的内容开始起步。

## 文档

  文档在 [doc/](https://github.com/taijiweb/domcom/tree/master/doc) 文件夹. 同时提供中英文文档。

  **中文文档在 [doc/Chinese/](https://github.com/taijiweb/domcom/tree/master/doc/Chinese) 文件夹。**

## LICENSE
MIT, 参见 [LICENSE](https://github.com/taijiweb/domcom/blob/master/LICENSE)
