# 从React到Domcom： 一个提供DOM部件的web框架

github.com/taijiweb/domcom


## 设计背景  
  
  ReactJS给前端Web应用开发的思路带来巨大转变，颠覆了很多以前的观念。我有多次机会接触和学习ReactJS，在理解它先进的理念的同时也发现它存在一些问题，最初主要集中在性能方面，比如重复生成部件的虚拟dom，整体性计算Diff和进行patch，更新检测机制不够完善等。我的思路是用一种方法标识所有Dom节点特性以及其它所有部件特性的有效性和可变性。首先想到的用普通的值和特殊的对象来加以区别，后来发现用响应函数是最合适的手段。响应函数的采用使我得以进一步改善部件的更新检测机制。后来我发现，相比于性能，不断演进后得到的这些设计决策给数据管理和应用设计带来的提升和便利更为明显和重要。最终Domcom超出预期地实现了我所有的设计目标，不但避免了影响ReactJS性能的基本因素，也同时弥补了ReactJS整体架构影响应用设计和实现复杂性的一些明显缺陷。


## Domcom整体特性

  Domcom是DOM和Component合并后的缩写，宗旨是为开发Web应用提供DOM部件。通过Domcom，可以整体上改善数据管理，尽可能减少不必要的DOM操作，提升程序运行效率。Domcom提供的部件是声明式和响应式的，充分运用函数范式和对象范式两种程序设计风格，提高代码复用，简化设计。以下是本框架主要特性的一个列表：

* 基于响应函数的声明式部件

  任何dom特性以及部件的其它合适属性都可以是响应函数。

* 最小化Dom访问和更新

  Domcom预先通过部件声明和描述了整个Dom，web应用绝大部分时间不需要访问Dom特性和状态。
  
* 便于组合扩展的部件

  Domcom可以利用函数范式组合生成部件和设置传递参数，也可以利用对象范式通过继承机制定义新部件。这能提高web应用的代码复用，降低复杂度，令设计更为简单清晰。

* 最大化解耦模型和控制器

  Domcom作为Dom部件的提供者，，在MVC或者MVV*模式专注于解决视图的问题。对模型和控制器完全保持中立和开放的视角。普通的值、变量和函数成为通往数据的桥梁和管道。借助这种方法，domcom最大化解耦视图于模型和控制器，给实现带来便利，简化设计。利用Domcom，很多时候我们甚至不需要为Model或者Controller作特意的设计。根据应用的复杂度和相关需求，Domcom当然也可以与POJO, 事件、observable, 基于类的扩展、Flux， immutable等不同解决方案联合使用，甚至可能借用backbone.js, ember.js， react.js等现有框架或库中的相关组件。


* 无需不可变数据结构，无需额外的数据管理方案

  Domcom自身具有比较适度的代码规模，当前最小化大约21K。因为框架在更新检测以及数据传递上采用的机制，使得它可以更灵活地使用数据，没有使用不可变数据结构的额外需求。
  
* 不需要模板语言，无需jsx

  Domcom设计上尽量方便直接使用Coffee-script语言和javascript语言。用Javascript语言的代码已经非常简练可读，还可以用Coffee-script达到更好的效果，基本上能媲美Jade模板语言而灵活性更强。Domcom基于javascript语言嵌套数组形式来描述React元素层次结构，非常易读易写，灵活性和可用性更胜于jsx。 

## 链接、文档和下载

  可以用npm下载安装

	npm install --save domcom

  或者使用cdn

    http://cdn.jsdelivr.net/domcom/x.y.z/domcom.min.js

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

  [常见问题](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/常问问题.md)：大家经常想了解的一些关于Domcom的问题。

  [doc/](https://github.com/taijiweb/domcom/blob/master/doc)文件夹还有更多的文档内容。

## 社区

  QQ群：DomcomJS社区 371409830

  Google groups: [Domcom](https://groups.google.com/d/forum/domcom)

## 说明

  本框架从2015年1月产生思路，4月份开始开发，其间经历了多次迭代，核心代码进行了多次很大的重构，当前实现合理，简明、优化，具备丰富的测试。今年上半年我的一个项目已经彻底弃用jQuery和Angular转向Domcom，有良好的体验。欢迎参与Domcom项目，共建社区，让Web开发更轻松，开发出更多改变世界的应用。2018年我对项目做了基于React框架的彻底的重新设计和实现，整个框架概念更简单，实现大大简化（从原来的80k减少到了20k），而且能利用React广泛的资源，框架可用性大大提高了。

  