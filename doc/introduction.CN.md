# Domcom  

一个提供DOM部件的前端web框架

github.com/taijiweb/domcom

设计背景

影响web前端编程效率的主要因素在于兼容各种浏览器的困难，复杂笨重的Dom结构及其导致的DOM操作的时间空间效率的相对低下。同时，DOM API的繁琐冗长也加剧了这一问题。因此jQuery应运而生，其简明优雅的API大大便利了前端浏览器程序设计，而jQuery也迅速成为这一领域绝对的王者。然而，随着web的发展，web前端软件的架构和数据组织等方面在变得越来越重要的同时也变得越来越困难。angularjs和reactjs.js是面向这方面诉求目前最为成功和流行的两个框架。我在工作和个人项目中，大量地用到了jQuery，angular.js。基于工作或者个人兴趣的双重原因，我也涉猎或者研究了很多前端的web框架和项目，包括knockout.js, backbone.js，virtual-dom, mercury.js, mithril.js, riot.js, bacon.js, flyd.js。通过应用学习和探索研究，我感觉到了这些工具设计上的提升和带来的便利，但是也逐步发现了还存在的一些不足和提升的空间，并产生了自己关于web前端框架的整体创意，在这些积累和思考的基础上，设计实现了Domcom这一个部件化的web前端框架。


Domcom整体特性

现在从整体上介绍一下Domcom框架的特性。Domcom是DOM和Component合并后的缩写，表明它是一个提供DOM部件的面向前端的Web框架。Domcom整体上以简化提升前端软件架构和数据组织作为设计目标，同时尽可能减少不必要和重复的DOM操作，提升程序运行效率。Domcom提供的Domcom部件是声明式和响应式部件，充分运用并有机结合函数式和面向对象两种程序设计风格，提高代码复用，简化设计。

* 任何dom特性以及很多部件成员属性都可以是响应式函数

* 只有在dom和缓存有差异的时候才更新dom

* 更新dom的时候跳过不活跃的部件

* 最大化解耦model和controller

* 便于组合扩展的部件

* 部件的根不必限定为单个dom元素

## 示例

    # coffee-script
    {bindings, list, text, p} = require 'Domcom'
    demoSum = ->
      {_a, _b} = bindings({a: 1, b: 2})
      comp = list(text({onchange:->comp.update()}, _a),
                  text({onchange:->comp.update()}, _b),
                  p(-> parseFloat(_a())+parseFloat(_b())))
      comp.mount()
    demoSum()

## 与其它框架的比较

响应式

flyd.js, bacon.js, rx.js
因为flyd.js实现非常简洁，只有100多行代码，我仔细研究过它的源码。而bacon.js 和 rx.js只是从整体上了解过。这些响应式框架虽然为我们的设计提供某种帮助，但是我个人总觉得遵循这些框架的程序整体设计并没有变得更加清晰和更好理解，有些陷入面条式响应流的感觉。虽然Domcom的大部分元素都是响应式的，但并不象上述框架一样按照响应流的模式来组织整体结构，而只是作为一种声明属性的方法，因此程序显得更为直观和清晰。和这些主流的响应式框架相比，Domcom的响应式是更为懒惰的。源头的变化并不立即触发后继的实际计算，而只是更新各级后继的无效标记，并传播到Dom特性和部件以指导DOM刷新算法。

更新检测

angularjs使用脏值检测触发watcher的机制，当$apply某一个scope上的变化时，会反复运行该scope及以下各个层次scope上的watcher，有的时候因为持续的变化会导致watcher在一个$digest循环中执行多遍，甚至因为超过限制次数而触发infdig异常。infdig就象是马戏团的一个小丑，经常性地冒出来向我们提示angularjs存在这样一个不得已的补救措施，同时也表明整体设计上的某种缺憾，令人感觉十分奇怪和不爽。另外，angularjs这种方法还是需要使用者在directive和watcher中进行dom操作，并不能从根本上杜绝不必要的的DOM访问和dom更新。
reactjs采用缓存和差异比较的方式，如果需要定制某个部件的刷新，普通办法是覆盖shouldComponentUpdate方法。

* 解耦

  model和controller

  knockout.js, ember.js, backbone.js等采用定制对象作为model或者controler的方式。

  不象angularjs那样必须将模型数据和事件处理方法挂到附属于controller上的$scope层次下，也不象reactjs那样必须将模型数据挂到this.props或者this.states

  因为domcom中的各种元素都可以是响应式的函数，因此，我们可以根据自己的意愿任意地组织数据，这将极大地便利我们改进整个系统的架构设计。

* 可组合性

angularjs 1.x 提供了一组复杂的概念框架，一方面提升了学习曲线，另一方面也阻碍部件之间的组合。要实现controller，directive的组合、继承和扩展，要采用很多不平常的手法，克服很多技术障碍，经常令人望而生畏。


Domcom, template以及coffee-script

  
  Domcom用coffee-script实现，Domcom喜欢coffee-script。
