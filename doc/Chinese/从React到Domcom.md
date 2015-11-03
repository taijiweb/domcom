# 从React到Domcom： 一个提供DOM部件的web框架

github.com/taijiweb/domcom


## 设计背景  
  
  ReactJS给前端Web应用开发的思路带来巨大转变，颠覆了很多以前的观念。我有多次机会接触和学习ReactJS，在理解它先进的理念的同时也发现它存在一些问题，最初主要集中在性能方面，比如重复生成部件的虚拟dom，整体性计算Diff和进行patch，更新检测机制不够完善等。我的思路是用一种方法标识所有Dom节点特性以及其它所有部件特性的有效性和可变性。首先想到的用普通的值和特殊的对象来加以区别，后来发现用响应函数是最合适的手段。响应函数的采用使我得以进一步改善部件的更新检测机制。后来我发现，相比于性能，不断演进后得到的这些设计决策给数据管理和应用设计带来的提升和便利更为明显和重要。最终Domcom超出预期地实现了我所有的设计目标，不但避免了影响ReactJS性能的基本因素，也同时弥补了ReactJS整体架构影响应用设计和实现复杂性的一些明显缺陷。


## Domcom整体特性

  Domcom是DOM和Component合并后的缩写，宗旨是为开发Web应用提供DOM部件。通过Domcom，可以整体上改善数据管理，尽可能减少不必要的DOM操作，提升程序运行效率。Domcom提供的部件是声明式和响应式的，充分运用函数范式和对象范式两种程序设计风格，提高代码复用，简化设计。以下是本框架主要特性的一个列表：

* 基于响应函数的声明式部件

  任何dom特性以及部件的其它合适属性都可以是响应函数。

* 最小化Dom访问和更新

  Domcom预先通过部件声明和描述了整个Dom，web应用绝大部分时间不需要访问Dom特性和状态。更新的时候应用能跳过有效的部件，只处理当前失效的部件和特性。

* 便于组合扩展的部件

  Domcom可以利用函数范式组合生成部件和设置传递参数，也可以利用对象范式通过继承机制定义新部件。这能提高web应用的代码复用，降低复杂度，令设计更为简单清晰。

* 最大化解耦模型和控制器

  Domcom作为Dom部件的提供者，，在MVC或者MVV*模式专注于解决视图的问题。对模型和控制器完全保持中立和开放的视角。普通的值、变量和响应函数成为通往数据的桥梁和管道。借助这种方法，domcom最大化解耦视图于模型和控制器，给实现带来便利，简化设计。利用Domcom，很多时候我们甚至不需要为Model或者Controller作特意的设计。根据应用的复杂度和相关需求，Domcom当然也可以与POJO, 事件、observable, 基于类的扩展、Flux， immutable等不同解决方案联合使用，甚至可能借用backbone.js, ember.js， react.js等现有框架或库中的相关组件。

* 不向Dom附加任何框架性元素和特性

  Domcom没有针对框架目的在Dom中设置元素id，class或其它辅助特性；也不需要为组合部件添加父元素或者任何其它辅助元素。利用Domcom可以得到一个最小最清洁的Dom。

* 简单强大的路由部件

  Domcom自带路由部件，实现非常简单，然而提供了强大的功能，支持正则表达式、通配符，允许多层次、多点嵌入的参数化路由。

* 方便的Promise支持

  除了通常的Promise使用方式以外，Domcom的特性值和子部件可以直接是Promise，还另外提供了便利的Defer部件，更方便于使用Promise。

* 兼容各种浏览器，甚至IE 6, 7, 8

  框架的设计特点使得自然而然具有良好的兼容性。虽然浏览器兼容性不是Domcom最初的设计目标，但是因为它管理Dom的模式使得它只需用到很少的浏览器及Dom相关的API，刚实现完毕框架即已经自然支持IE9及其它各大主流浏览器，继而用了很少时间就通过修改实现将支持扩展到了IE 6, 7, 8。

* 无需依赖，无需不可变数据结构，无需浏览器或语言补丁，无需搭配程序库,无需补充解决方案

  Domcom自身具有比较适度的代码规模，当前最小化大约60K+。因为框架在更新检测以及数据传递上采用的机制，使得它可以更灵活地使用数据，没有使用不可变数据结构的硬性需求。框架的实现代码不涉及任何非主流的、尖端的浏览器或javascript语言特性。这些方面使得Domcom无需依赖，无需浏览器或语言补丁，无需搭配程序库,无需补充解决方案即可以解决应用程序的通常需求。因为Domcom已经全面彻底地代理Dom，连angular那种通过指令直接操作Dom的需求都已经消失，因此即使是jQuery这样的库都变得不再必要。、

* 不需要模板语言

  Domcom设计的中尽量方便直接使用Coffee-script语言和javascript语言。用Javascript语言的代码已经非常简练可读，还可以用Coffee-script达到更好的效果，基本上能媲美Jade模板语言而灵活性更强。因此Domcom不存在多强的模板语言需求。当然，要为之加上适当的模板语言也是很可行的。如果有人能完成这项工作，我非常欢迎并期待合作。我个人更倾向于缩进风格而不是类似JSX那种XML风格的模板语言。考虑到不同用户的习惯，如果能够两种并存就更好了。 

## 链接、文档和下载

  可以用npm下载安装

	npm install --save domcom

  或者使用cdn

    http://cdn.jsdelivr.net/domcom/0.1.1/domcom.min.js

  [Github项目地址](https://www.github.com/taijiweb/domcom)

  [Github releases](https://github.com/taijiweb/domcom/releases)

  [npm包地址](https://www.npmjs.com/package/domcom)

### 文档

  Domcom已经提供全面的文档（特别是中文文档），都在[doc/文件夹](https://github.com/taijiweb/domcom/blob/master/doc)。中文文档集中在[doc/Chinese文件夹](https://github.com/taijiweb/domcom/blob/master/doc/Chinese)：

  [README](https://github.com/taijiweb/domcom/blob/master/doc/Chinese)

  [介绍和辅导教程](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/介绍和辅导教程.md)： Domcom的基本介绍和入门的辅导教程。

  [概念和原理](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/概念和原理.md)：了解Domcom有关的基本概念和原理。

  [API参考](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/API参考.md)：关于Domcom所有公开的API的正式而详细的参考资料。

  [速查表](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/速查表.md)：熟悉Domcom的API，常用技巧和惯用法。

  [常问问题](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/常问问题.md)：大家经常想了解的一些关于Domcom的问题。

  [doc/](https://github.com/taijiweb/domcom/blob/master/doc)文件夹还有更多的文档内容。

## 社区

  QQ群：DomcomJS社区 371409830

  Google groups: [Domcom](https://groups.google.com/d/forum/domcom)

## 说明

  本框架从2015年1月产生思路，4月份开始开发，其间经历了多次迭代，核心代码进行了多次很大的重构，当前实现合理，简明、优化，具备丰富的测试。今年上半年我的一个项目已经彻底弃用jQuery和Angular转向Domcom，有良好的体验。欢迎参与Domcom项目，共建社区，让Web开发更轻松，开发出更多改变世界的应用。

  