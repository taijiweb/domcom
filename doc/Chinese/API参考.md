# Domcom API 参考文档

************************************************************************

## 使用Domcom
### 获取Domcom
  `npm install --save domcom`  
  `git clone https://www.github.com/taijiweb/domcom`  
  下载：[github版本](https://github.com/taijiweb/domcom/releases)  
  cdn: 感谢cdn.jsdelivr.net 提供cdn链接(替换x.y.z为实际版本号）  

      http://cdn.jsdelivr.net/domcom/x.y.z/domcom.min.js
      
### 在页面中设置Domcom
先要添加React和ReactDom链接。

        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        
或

        <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
        
  根据开发和应用需要从安装或下载的文件夹中选择domcom/dist/下的适当文件，向html页面添加script标签：  
  > 开发版本：`<script src="path/to/domcom.js"/>`  
  > 产品版本：`<script src="path/to/domcom.min.js"/>`

  如果使用cdn链接， 则应该添加如下的script标签

  >
        https://unpkg.com/domcom@0.8.4/dist/domcom.js
        https://unpkg.com/domcom@0.8.4/dist/domcom.min.js
        https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.js
        https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.min.js


  在domcom的script标签之后添加自己的js脚本：

  > `<script src="path/to/my-app.js"/>`

### 导入和引用domcom提供的api
在浏览器环境下，添加domcom的`<script>`标签后，dc会成为全局变量，即window.dc。

domcom的API有意设计得非常简练。即使在ES5下编写domcom程序，其简洁优雅程度依然可以胜过用JSX编写的reactJS。

***********************************************************

## API参考

### 部件

Domcom用部件管理dom节点，部件是框架的最核心概念。每个部件都有自己对应的Dom节点。

***********************************************************

#### 部件基类： Component

提供了部件实例的共有方法，其中mount, unmount方法管理部件的挂载与卸载, update， watch， stopWatch方法管理部件的绘制或触发更新。

##### 部件特性：

以下是所有部件都具有的内部特性。罗列在此的目的是为了帮助了解框架原理，方便编写代码。这些特性都由框架管理，除非处于扩展框架的目的，并且已经非常熟悉整个框架的内部实现，不鼓励在用户代码中直接使用和修改这些特性。

* `dcid`  
  为了方便部件管理引入的全局唯一的整数索引。
* `listeners`  
  部件事件及其回调的映射对象，通过Componet的emit，on，off，once方法管理。
* `base`
  扩展部件对应的基础部件。
* `parentNode`  
  在Dom中挂载的parentNode。
* `node`
  对应的Dom节点。虽然domcom的实现能够避免绝大多数直接操作dom的需求，但是，在真正有这类特殊需求时，部件的node成员使用起来非常简单便捷。
* `mounted`
  此部件是否已经挂载到DOM中？


##### 部件方法
* **mount，unmount** 
  挂载和卸载部件
 
  > `component.mount(mountNode：Null|domNode`
  挂载部件。如果Dom节点不存在，挂载前将创建Dom节点。mountNode是将要挂载的父节点，如果省略，将挂载到document.body节点。beforeNode将成为部件节点的下一相邻节点。挂载后部件创建的Dom节点是node。

  > `component.unmount()`  
  移除挂载。将部件从Dom中移除。
  
* **update**
  重绘部件。  
  > `component.update()`

* **emit, on, off**  
  这三个方法管理直接发生在部件上的事件。这类事件称为部件事件。部件事件不同于发生在React元素或者Dom上的事件， 是Domcom框架自带的事件处理机制，完全独立于Dom事件处理机制。部件事件注册在Component.listeners特性上，domcom内部会发送一些预定义部件事件，对应于React Component的生命周期方法，componentWillMount发出mounting, componentDidMount发出mounted, componentWillUpdate发出updating, componentDidMountUpdate发出updated, componentWillUnmount发出unmounting。

  > `component.emit(event, args...)`  
  执行注册在event上的所有回调函数。对于每个回调函数callback都执行`callback.apply(component, args)`
    
  > `component.on(event, callback)`  
  注册部件事件回调函数callback，部件对象将成为callback的this上下文。

  > `component.off(event, callback)`  
  移除已经注册在名为event的事件上的部件事件回调函数callback


* **copy**
  复制部件。因为一个部件智能挂载到DOM中一个位置，如果需要挂载多次，可以使用此方法。
  > `component.copy()`

* **extend**
 创建扩展部件，可以通过此方法建立部件的继承层次。

* **watch**
 让部件开始watch部件上的字段，这些字段由config对象提供；也会watch component.data（或compnent.data()，如果component.data是函数）上的字段。
 当部件被挂载后此方法被自动调用。因此部件会持续自动watch，直到下面的stopWatch方法被调用。

* **stopWatch**
  停止上述watch机制。停止watch后可以通过直接调用component.update()手动控制部件更新。



### Domcom指令

 domcom通过使用指令可以在某些情况下让代码更为简明，更为符合人的书写和阅读习惯。domcom的指令设计借鉴了angular的指令，但是，在domcom中指令只是作为语法糖存在，并不具有独立的不可替代的作用。任何时候都可以用普通的函数代替指令来实现完全相同的需求，区别只存在于代码格式方面。
   
 指令只允许用在Tag部件上。指令的使用方法是：  
   `tag({ ..., $directiveName: directiveArguments, ...}, ...)` 
    
 在执行Tag部件的初始化期间处理Tag的属性集的时候，如果遇到以`$`字符开头的属性，domcom认为这是一个指令，会查找预先注册的指令集，如果找到该指令的指令处理函数，则以directiveArguments作为参数调用该函数。如果没有注册该指令，domcom将认为是一个错误。


#### 内建指令

  Domcom预定义了一组内建指令。

##### $model指令

* 用途，在value和部件字段间建立双向绑定。
用法：`[tag, {$model: model}]`


##### $show指令

* 用途：控制部件的显示。
  `[tag, {$show:test}]`

##### $options指令

* 说明：只能配合`<select>`标签部件使用

* 用法：`[‘select’, {$options: items}]`
