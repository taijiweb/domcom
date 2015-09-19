# Domcom  

一个提供DOM部件的前端web框架

github.com/taijiweb/domcom

设计背景

影响web前端编程效率的因素主要在于各种浏览器的兼容需求，复杂的Dom结构及其导致的笨重DOM操作，以及繁琐冗长的DOM API。因此jQuery应运而生，其简明优雅的API大大便利了前端浏览器程序设计，迅速成为该领域的王者。然而，随着web的发展，web前端应用的架构设计和数据组织变得越来越重要，同时也变得越来越困难。angularjs和reactjs.js是目前响应这方面需求的两个最成功框架。我在学习，使用和研究jQuery，angular.js, react.js以及其它前端的web框架和项目（包括knockout.js, backbone.js，virtual-dom, mercury.js, mithril.js, riot.js和一组响应式函数编程库如bacon.js, flyd.js等）的过程中，感觉到了这些工具在设计上的提升和带来的便利，但是也逐步发现它们都还存在的一些不足和改进的空间，并产生了自己关于web前端框架的整体构想， 设计实现了Domcom这一个部件化的web前端框架。


Domcom整体特性

Domcom是DOM和Component合并后的缩写，表明本框架的设计宗旨是为开发Web应用提供DOM部件。通过Domcom，可以整体上简化提升Web应用设计架构和数据组织，同时尽可能减少不必要和重复的DOM操作，提升程序运行效率。Domcom提供的部件是声明式和响应式的，充分运用并有机结合函数范式和对象范式两种程序设计风格，提高代码复用，简化设计。以下是本框架主要特性的一个列表：

* 响应式，声明式的部件描述

任何dom特性以及部件的其它合适属性都可以是响应式函数

* 最小化Dom访问和更新

Domcom预先通过部件声明和描述了整个Dom，因此，一方面web应用绝大部分时间不需要访问Dom特性和状态。另一方面，应用只有在当前状态与缓存状态有差异的时候才需要更新dom，在更新dom的时候还可以跳过不活跃的部件

* 便于组合扩展的部件

利用Domcom，可以利用函数范式组合生成部件，设置、传递参数，也可以利用对象范式，利用继承机制扩展和定义新的部件。这能提高web应用的代码复用，降低复杂度，令设计更为简单清晰。

* 最大化解耦

可以将Domcom理解为MVC或者MVV*模式中View的提供者，因为它只提供了针对Dom的部件化描述方法，而没有提供针对Model或者Controller的专有工具。然而，正因为Domcom将View最大化解耦model和controller，以最简单便捷的值或者响应式函数作为通向model和controller的桥梁和管道，反而为model和controller的设计带来了最大的便利。利用Domcom，很多时候我们甚至不需要为Model或者Controller作特意的设计。根据应用的复杂度和相关需求，Domcom当然也可以与POJO, 事件、observable, 基于类的扩展、Flux等不同解决方案联合使用，借用backbone.js, ember.js， react.js等等现有框架或库中的相关组件都是可能的。

* 不需要向Dom附加任何元素和特性来辅助框架运作

Domcom不需要也没有针对框架目的在Dom中设置元素id，class，或者添加其它辅助特性或者style；Domcom也不需要为组合部件添加父元素或者任何其它辅助元素。利用Domcom可以得到一个最小最清洁的Dom。

* 灵活而简单的路由机制

Domcom自带路由部件，其实现非常简单，然而提供了丰富强大的功能，支持正则表达式、通配符，可以为应用设置多层次、多嵌套的参数化路由。


## Domcom入门

### 获取Domcom
  npm install --save domcom
  git clone https://www.github.com/taijiweb/domcom
  下载
  cdn: jsDeliver

  domcom/dist/domcom.js

### 在页面中设置Domcom
<script src="path/to/domcom.js"/>
<script src="path/to/my-app.js"/>

### 关于目前编写Domcom应用的工具

  Domcom的实现采用了coffee-script然后转译成javascript的方法。当然，这并不妨碍我们采用javascript来编写基于Domcom的应用，虽然这样做可能代码会稍微冗长一点，可读性稍差一点。对大多数习惯于编写javascript原生代码的程序员来说，这是完全可行的，没有其它任何不好的地方。因为coffee-script的简洁优雅，我个人很喜欢这门语言，Domcom在实现上针对coffee-script做了很多便于阅读和编写的专门设计。即使不借助专用的模板语言工具，我们也可以借助coffee-script的帮助在这方面做得非常好。当前，在还没有专门的针对Domcom的模板语言工具的情况下，我建议在使用Domcom时尽可能用coffee-script。

  以下的实例都采用coffee-script语言。Coffee-script和Javascript基本是一一对应的。对于不熟悉coffee-script的朋友，我建议阅读时按照直觉理解就好。

### Hello, Domcom
  {div} = dc
  comp = div "Hello, Domcom" 
  comp.mount()

### 使用变量 
  {div} = dc

  hello = (who) ->
    div "Hello, ", -> who
  
  comp = hello "Angular"
  comp.mount()
  comp = hello "Domcom"
  comp.mount()

### 动态声明

  {div} = dc

  who = "Angular"
  comp = div "Hello, ", txt1=(-> who)
  comp.mount()
  who = "Domcom"
  comp.render()


### 响应式更新

  在上例中, div的第二个child元素txt1=(-> who)是一个无条件函数，因此每次更新(render)的时候，它的值会需要无条件地重新计算（只是Domcom部件内部的计算，如果新计算值与缓存值相同，并不需要刷新Dom，不会引起Dom操作），同时还可能会进一步增加需要更新的容器部件。如果我们在上例的最后再增加调用一次·comp.render()·，虽然who的值甚至整个应用的状态都没有变化，但是comp和txt1都会执行一遍更新过程。


  我们可以利用响应式函数来避免上述问题。

  {div, see} = dc

  who = see "Angular"
  comp = div "Hello, ", who
  comp.mount()
  who "Domcom"
  comp.render()

  现在，如果我们只是在最后一行再次调用`comp.render()`, 不会引起部件层次的更新计算，当然更不会有Dom的刷新。即使我们增加这样的代码，·who "Domcom"; comp.render()`也是同样。因为who被设置的新值和缓存的值相同，也就不会令依赖于who的任何计算变得无效。但是，当我们增加·who "React"; comp.render()`这组语句，部件更新和Dom刷新就会按需求执行了。相反，因为Dom元素“Hello”是完全静态的，一旦创建就已经从更新集合中完全排除，不管在哪种情况下都再也无需触及。

### 事件处理

  {div} = dc
  comp = div onclick: -> alert("Hello, Domcom!"),
    "Say hello!"
  comp.mount()

### 事件与更新
  {div, text, list, see} = dc

  who = see "Angular"
  comp = list div("Hello, ", who),
    text value: who,
      onchange: -> who @value; comp.update()  
  comp.mount()

### Domcom指令
  
  为了编写方便代码，Domcom设计了指令。指令是一个函数，调用该函数会产生一个指令处理函数。其基本定义模式如下：
  `registerDirective '$directiveName', (args...) -> (comp) -> ...`
  Domcom提供了一组内置指令：$bind, $model, $options, $show, $hide, $splitter, $blink。我们可以在应用中使用这组指令，也可以参考这组指令的写法定义新的指令。

  {div, text, list, see} = dc

  who = see "Angular"
  comp = text $bind: who
  comp.mount()
  who "Domcom"
  comp.render()

  可以看到，在这里$bind:who与value:who相比并没有任何的优越性，反而增加了复杂度。因为$bind可以用在所有的input元素，select，textarea上，这种统一性也许可以让减轻一些记忆负担。而下面的双向绑定指令则可以在写法上带来实质性的便利。

### 双向绑定
  {div, text, list, see2} = dc

  who = see2 "Angular"
  comp = list div1 = div("Hello, ", who),
    text($model: who).bind('onchange', -> div1.update())
  comp.mount()

  $model指令可以看作两个声明的结合，即{$model: model}相当于{value: model, onchange: -> model(@value)}, 其中model应该是一个可以设置值的响应式函数，例如flow.see2和flow.duplex。

  Tag.bind可以对Tag部件绑定事件函数。bind方法会返回部件自身。


### if_条件部件

### case_多分支部件

### each重复部件

### 定制更新方法

### 路由示例


### 更多例子

#### 求和

    {bindings, list, number, p, flow} = require 'Domcom'
    demoSum = ->
      {_a, _b} = bindings({a: 1, b: 2})
      list(n1=number(_a), n2=number(_b), p(flow.add _a, _b)).renderWhen(n1, n2, 'change').mount()
    demoSum()

### todoMVC

## API介绍

### 部件及实例化函数

Component 

BaseComponent

TransformComponent


Tag, tag
  div, p, span, input, textarea, select, ...
  input元素
  text, number, checkbox, radio, email, date, tel

Text, txt

Comment, comment

Html, html,

UnescapeHtml, unescape

List, list

If, if_

Case, case_

Cond, cond

Each, each

Route, route

Flow函数

react 

renew 

flow

depend

see

see2


bind

duplex

reactive.invalidate

### 工具函数

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

  
  汝之蜜糖，吾之砒霜；
  对人如此，对机亦然。

  Domcom用coffee-script实现，Domcom喜欢coffee-script。

### 曙光在前

  Domcom为我们提供了一种新的组织Web应用的方式。前面的范例已经演示了Domcom的一些基本用法。我们现在可以学习Domcom提供的更多API，在最简捷地编写Web应用的同时追求最好的运行效率。
