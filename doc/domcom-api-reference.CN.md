# Domcom API 参考文档

## 文档说明

### 本文档的记法习惯

* 函数原型记法：

functionName arg1[: Type1], arg2[: Type2], ...
functionName()

* 方法原型记法:
class.methodName arg1[: Type1], arg2[: Type2], ...
object.methodName arg1[: Type1], arg2[: Type2], ...
class.methodName()
object.methodName()

上文中[]表示其中的内容可能省略。

如果根据上下文类型是显然的，不便描述或不用描述，就会省略类型部分。

上述记法适用于下一节“类型说明”以及后文中任何关于原型说明的文字。

[...]出现在实际的原型说明中，如果不是代表数组类型的含义，就表示其中的内容是可选参数。

### 类型说明

以下是本文档函数原型说明中可能出现的一些类型:

* item:toComponent: 代表item可以是任何值，但是所有的值(item)都会经过toComponent(item)转换成合适的部件。
* value:domValue: 代表value:可以是任何值，但是所有的值(value)都会经过domValue(value)转换成适用的dom节点特性值。
* fn:Reactive：fn是响应函数
* x:Any: x可以是任何类型
* items:[Type]: items是元素类型为Type的数组
* Array: 数组类型
* item：ArrayIndex: 代表item是数组的下标索引。该数组一般是相关函数的某个参数或宿主对象的某个字段。
* items:[Type1, Type2, ...]: items是元素按照Type1与Type2依次成对出现的数组
* hash:Hash： hash是Object，要求不是数组或null
* item：HashValue: 代表item是Hash对象的值。Hash对象一般是相关函数的某个参数或宿主对象的某个字段。
* item：HashKey: 代表item是Hash对象的键。Hash对象一般是相关函数的某个参数或宿主对象的某个字段。
* fn:(param1[: Type1] [, param2[: Type2] [, ...] ]) -> [Type]: 函数类型
* item: Type1|Type2: 代表item:可以是类型1或者类型2的值
* item:ValueReactive： item可以是任何值，也可以是响应函数，如果item是普通函数，会被转换为强制响应函数
* attrs:Attrs: 代表attrs可以作为Tag部件的attrs属性。在instantiate.coffee中，isAttrs(attrs)应该为true

### 关于方法的说明

本文档只描述公用的方法，包括类或类的实例提供的公用方法和模块提供的模块方法。

## 导入和引用domcom提供的api

在浏览器环境下，添加domcom的`<script>`标签后，dc会成为全局变量，即window.dc。建议使用Coffee-script，或者babel以支持ES6语法，借助它们就可以参照如下的语法引用domcom提供的api：

	{see, div, list, if_} = window.dc

### webpack

如果采用webpack工具(或者browserify)，也可以参照如下的语法：

    {see, div, list, if_} = dc = require('domcom')

或者直接导入和引用单个文件(不提倡)：

    {see} = require('domcom/src/flow'
    {div} = require('domcom/src/core/')

## API参考

### 部件

部件是构成Domcom骨架的最核心概念。domcom框架用部件代理和管理dom节点。每个部件最终将生成一个或一组Dom节点，某些特殊的部件不生成Dom节点，如Nothing部件和children.length为0的List部件。部件根据其基类的不同可以分成两大类：基础部件和变换部件。其中基础部件直接管理Dom，包括创建和刷新Dom，附着/删除节点等方法。变换节点最关键的方法是getContentComponent，通过这个方法逐步变成基础部件。Domcom通过部件提供了对于Dom包括节点、节点特性以及Dom事件在内的完整的声明式描述，并利用值和响应函数描述了Dom和数据的静态以及动态的交互关系，并以此为基础管理部件的更新过程和Dom刷新过程，最大限度提供时间和空间效率。

#### 部件基类： Component

这是所有部件的基类，提供了部件类的公有方法，包括mount/unmount/remount用于管理部件的挂载与卸载, render/update管理部件的创建、绘制或更新，renderWhen/updateWhen便利设置重绘更新时机，on/off/emit管理部件内事件。

##### 部件方法
* **mount，unmount，remount**

  > 函数原型：`component.mount mountNode：Null|domNode, beforeNode：Null|domNode`
  
  挂载部件。如果Dom节点不存在，挂载前将创建Dom节点。mountNode是将要挂载的父节点，如果省略，将挂载到document.body节点。beforeNode将成为部件节点的下一相邻节点。假设实际挂载的父节点是parentNode，部件创建的Dom节点是Node，则挂载方法如下：`parentNode.insertBefore(node, beforeNode)`

  > 函数原型：`component.unmount()`
  
  移除挂载。将部件从Dom中移除。

  > 函数原型：`component.remount()`

  恢复挂载。将部件重新挂载到Dom，挂载位置保持不变。

* **render，update**

  > 函数原型：`component.render()`

  绘制部件。如果部件的Dom节点还不存在，将创建Dom节点。如果Dom节点已经存在，而部件已失效，将执行合适的更新操作。如果部件有效，但是Dom节点的父节点`component.node.parentNode`不是部件的父节点`component.parentNode`，则会将部件的Dom节点挂载到部件父节点之下，`component.nextNode`代表的Dom节点之前。

  > 函数原型：`component.update()`
  
  更新部件。本方法和render方法唯一的区别是本方法将先调用`component.emit('update')`

* **renderWhen，updateWhen**

  定制部件的更新时机：可以是其它某个或一组部件上发生的某些Dom事件，也可以采用window.setInterval或者dc.raf方法。

  > 函数原型：
  
  `component.renderWhen [Component]|Component, [DomEventName], "render"|"update"`
  `component.renderWhen setInterval, ms, options`
  `component.renderWhen dc.raf, options`  
  

  > 函数原型：

  `component.updateWhen [Component]|Component, [DomEventName], "render"|"update"`
  `component.renderWhen setInterval, ms, options`
  `component.renderWhen dc.raf, options`

* **on, off, emit**

  这三个方法管理直接发生在部件上的事件。这类事件称为部件事件。部件事件不同于发生在Dom上的事件， 是Domcom框架自带的事件处理机制，完全独立于Dom事件处理机制。部件事件注册在Component.listeners特性上，通过Component.on, off, emit三个方法进行处理。domcom内部也发送了一组部件事件，包括beforeMount, update, afterUnmount, beforeAttach, contentChanged等。

  > 函数原型：`component.on event, callback`
  
  注册部件事件回调函数fn，部件对象将成为fn的this上下文。

  > 函数原型： `component.off event, callback`

  移除已经注册在名为event的事件上的部件事件回调函数callback

  > 函数原型： `component.emit event, args...`

  执行注册在event上的所有回调。对于每个回调callback都执行`callback.apply(component, args)`

* **clone**

  Component类自身没有定义本方法，但是domcom内建的可以实例化的派生类都定义了这个方法。扩充新的部件类时，如果该部件有可能需要复制自身产生一个copy部件，应该定义这个方法。clone方法可以复制一个component的拷贝。当部件需要用于多处，而直接引用可能引起Dom节点附着位置冲突的时候，可以考虑使用这个方法。

  > 函数原型: `component.clone()`


* **toString**

  Component自身没有定义本方法，但是domcom内建的可以实例化的派生类都定义了这个方法，主要作用是为了帮助调试。

  > 函数原型: `component.toString indent:Int=0, addNewLine:Boolean`



#### 基础部件基类： BaseComponent

基础部件具有直接管理Dom的方法，包括createDom, updateDom，attachNode，removeNode等。大多数基础部件都直接生成Dom节点，List部件则间接通过子部件生成Dom节点，Nothing节点和空的List部件不会生成Dom节点。

##### 模块: Core/Base/BaseComponent

##### 直接父类：Component

##### 子类：List, Tag, Text, Html, Comment, Nothing

##### 构造函数和实例化函数

  不要直接使用基础部件对象。



#### 列表部件：List

##### 模块: Core/Base/List

##### 直接父类：BaseComponent

##### 子类：Tag

##### 构造函数原型：	new List(children: [toComponent])

##### 实例化函数原型： list children...: [toComponent]

##### 示例
	list \
	    label "user name: ",
	    text placeholder: "input here: ", value: username$

##### 相关实例化函数: every, all, nItems

every arrayItems:[Any], itemFn: (item:Any, index:int, arrayItems:arrayItems!) ->

all objectItems:Hash, (value, key, index:int, objectItems!) ->

##### List部件方法

列表部件提供了一组动态管理子部件的方法。这组方法可以增减childr中包含的子部件。注意，这些方法并不会立即影响Dom，而是先失效列表部件，等到调用部件更新方法时才会实际刷新Dom。除了在定制、扩展部件的时候，程序绝大多数时候可能不需要使用这些方法。

* **pushChild**

* **unshiftChild**

* **insertChild**

* **removeChild**

* **setChildren**

* **setLength**

#### 标签部件：Tag

##### 模块: Core/Base/Tag

##### 直接父类：List

##### 构造函数原型
    new Tag(tagName, attrs, children)

##### 实例化函数原型

	anyTagName attrs:Attrs, children...:[toComponent]
    inputType attrs:Attrs, value:domValue
	tag(tagName:TagName, children...)
	tag(tagName, attrs:Attrs, children...)

  上文中anyTagName或tagName是html页面中可以出现的标签名，例如div, p, span, input, textarea, select等，inputType是<intput>标签允许的类型值，包括text, number, checkbox, radio, email, date, tel等。这两项内容欲知完整列表参阅src/core/tag.coffee。

##### 示例

    span "hello"
    li -> x

	text({$model: model}), select $options:[['domcom', 'angular', 'react']]

	input {type:"text", value: who$, onchange: -> alert "hello, "+who$()}

##### Tag部件方法

发生在Dom节点上的事件，比如onclick，onchange等。对于Dom事件处理函数，domcom主要通过在构造Tag部件时利用attrs参数进行声明，也可以通过Tag.bind，Tag.unbind来管理。$model指令，Component.renderWhen, Component.updateWhen, dc,renderWhen, dc,updateWhen等函数也可以添加事件处理函数。

* prop

    tag.prop(prop, value)

    prop: 如果参数个数是1，则prop为特性名，此时函数返回部件对应的node的该特性名的值，或者为包含特性与值的集合的object，函数将扩展部件的特性集，如果参数个数为2， 则本方法将设置部件的prop特性为（tag.props[prop]=value）。

    value: undefined,或者被设置的特性的值，可以是函数。如果是函数，部件对应的dom node的prop特性（tag.node[prop])将在每次更新的时候与该函数的值动态保持一致。

* css

    tag.css(prop, value)
    如果参数个数是1，则prop为特性名，此时本方法返回部件的style中prop的值（tag.style[prop]），或者为包含特性与值的集合的object，本方法将扩展部件的style的特性集；如果参数个数为2， 则本方法将设置部件的style的prop特性（tag.style[prop]=value）。
    prop: 特性名，或者包含特性与值的集合的object，函数将扩展部件的style的特性集
    value: undefined，或者为部件的style的prop特性的值。value可以是函数。如果是函数，部件对应的dom node的style的prop特性（tag.node.style[prop])将在每次更新的时候与该函数的值动态保持一致。

* addClass, removeClass

    tag.addClass(items...)

    tag.removeClass(classes...)

* show, hide

    tag.show(display)

    tag.hide()

* bind, unbind

    tag.bind(eventName, handlers...)

    tag.unbind(eventName, handlers...)

### 文本部件：Text

##### 模块: Core/Base/Text

##### 直接基类：BaseComponent

##### 子类：Html, Comment

##### 构造函数原型

    nex Text text:domValue

##### 实例化函数原型

    txt attrs:Attrs, string:DomValue

##### 说明

  任何需要部件的位置，如果传入的不是部件，也不是null或者undefined，都会被转为Text部件，如示例中的(1)。

##### 示例

  div 1; p "hello", who$; li someVariable; span -> someVariable  # （1）


### Html部件: Html

##### 模块: Core/Base/Html

##### 直接基类：Text

##### 构造函数原型
	new Html htmlText:domValue[, transform:(String) -> String]

##### 实例化函数原型

	html attrs:Attrs, htmlText:domValue[, transform:(String) -> String]

##### 示例

	html "<div> This is domcom </div> <div> That is angular </div>"
	html someHtmlTextString, escapeHtml


### 注释部件: Comment

##### 模块: Core/Base/Comment

##### 直接基类：Text

##### 构造函数原型

	new Comment text:domValue

##### 实例化函数原型

	comment text:domValue

    注释部件实例化不提供attrs:Attrs参数。

##### 示例

	comment "this is a comment"


### 空部件: Nothing

##### 模块: Core/Base/Nothing

##### 直接基类：BaseComponent

##### 构造函数原型

	new Nothing()

##### 实例化函数原型

	nothing()

    空部件实例化不提供attrs:Attrs参数。

##### 说明

  当toComponent(item)中item是null或undefined时，将创建空部件。





#### 变换部件基类： TransformComponent

变换部件具有getContentComponent方法。重绘Dom前变换部件先调用getContentComponent方法，先获取内容部件后再决定重绘过程。

##### 模块: Core/Base/TransformComponent

##### 直接父类：Component

##### 子类：If, Case, Cond, Func, Each, Route, Defer

##### 构造函数和实例化函数

  不要直接使用变换部件对象。



### If部件：If

##### 直接基类：TransformComponent

##### 模块: Core/Base/If

##### 构造函数原型

	new If test:ValueReactive, then_:toComponent[, else_:toComponent]

##### 实例化函数原型

	if_ attrs:Attrs, test:ValueReactive, then_:toComponent[, else_:toComponent]

##### 示例


### Case部件：Case

##### 模块: Core/Base/Case

##### 直接基类：TransformComponent

##### 构造函数原型

	new Case test:ValueReactive, caseMap:Hash[, else_:toComponent]

##### 实例化函数原型

	case_ attrs:Attrs, test:ValueReactive, caseMap:Hash[, else_:toComponent]

##### 示例



### Cond部件

##### 模块: Core/Base/Cond

##### 构造函数原型

	new Cond testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]

##### 实例化函数原型

	Cond attrs:Attrs, testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]

##### 示例



##### Func函数部件

##### 模块: Core/Base/Func

##### 构造函数原型

	new Func func:Reactive

##### 实例化函数原型

	func attrs:Attrs, func:Reactive

##### 示例



### Each部件

##### 模块: Core/Base/Each

##### 构造函数原型

	new Each attrs:Attrs, items:[Any]|Reactive->[Any][,options:Options]

##### 实例化函数原型

	each attrs:Attrs, items:[Any]|Reactive->[Any][,options:Options]

##### 示例



#### Route部件

##### 模块: Core/Base/route

##### 构造函数原型

	new Html htmlText:domValue[, transform:(String) -> String]

##### 实例化函数原型

	if_ attrs:Attrs, test:ValueReactive[, then_:toComponent[, else:toComponent]]

##### 示例

	html "<div> This is domcom </div> <div> That is angular </div>"
	html someHtmlTextString, escapeHtml

### Defer部件

##### 模块: Core/Base/Defer


##### 构造函数原型

	new Defer
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]

##### 实例化函数原型

	defer attrs:Attrs,
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]

##### 示例


### 响应函数

响应函数是Domcom框架区别于其它框架的关键要素。Domcom中一切连接数据的成分，包括Dom特性，If,Case, Cond部件的测试条件，Func部件的func特性，Each部件基于的数组和对象，等等，都可以是响应函数。响应函数具有invalidateCallbacks，它包含该响应函数的失效回调函数的列表；还具有invalidate和onInvalidate两个方法，其中onInvalidate用于注册失效回调函数，invalidate用于执行onInvalidate注册的所有失效回调函数。

响应函数通过响应函数生成器来产生。

domcom与响应函数相关的方法都定义在domcom/srs/flow/文件夹，其中所有方法名都直接定义在dc.flow名字空间，可以用flow.someName或者{someName,...} = dc.flow的方式引用。为了方便flow/index模块下的常用方法名也导入到了dc名字空间，因此也可以通过dc.someName或{someName,...} = dc的方式引用。

#### flow/index模块

react

reactive.invalidate

renew

dependent

flow

pipe

depend

see

* 函数原型：see value: Any[, Transform:(Value) -> Any]

username$ = see "Tom"

num1$ = see 1,
num2$ = see 2

seeN


bind

score = { name: "Tom", points:95}

name$ = bind(scores, "name")

duplex

points$ = duplex(scores, "points")

unary

binary


#### flow/watch-list模块


#### flow/addon模块

bindings

flow.neg = (x) -> unary(x, (x) -> -x)
flow.no = (x) -> unary(x, (x) -> !x)
flow.bitnot = (x) -> unary(x, (x) -> ~x)
flow.reciprocal = (x) -> unary(x, (x) -> 1/x)
flow.abs = (x) -> unary(x, Math.abs)
flow.floor = (x) -> unary(x, Math.floor)
flow.ceil = (x) -> unary(x, Math.ceil)
flow.round = (x) -> unary(x, Math.round)
sum$ = flow.add num1$, num2$

flow.add = (x, y) -> binary(x, y, (x, y) -> x+y)
flow.sub = (x, y) -> binary(x, y, (x, y) -> x-y)
flow.mul = (x, y) -> binary(x, y, (x, y) -> x*y)
flow.div = (x, y) -> binary(x, y, (x, y) -> x/y)
flow.min = (x, y) -> binary(x, y, (x, y) -> Math.min(x, y))

flow.if_ = (test, then_, else_) ->

### Tag特性工具函数

#### 模块：src/core/property

#### 说明

为处理Tag的class，style及其它特性提供便利的一组工具函数。包括classFn, styleFrom, extendAttrs等

#### classFn

classFn(items...)

    递归地，items中的项可以是className的字符串, 或者是classFn产生的函数, 或者是项的集合

### styleFrom

styleFrom(value)

    value: 形如"stylePropName:value; ..."的style字符串, 或者形如"stylePropName:value"的项的数组, 可包含空白字符, 或者形如[stylePropName, value]的项的数组

#### extendAttrs

extendAttrs(attrs, obj)

    扩展部件的属性集对象

    attrs: 待扩展的属性集, 如果是null或undefined, 将创建一个新的空对象

    obj: 用来覆盖或增强属性集特性的对象

overAttrs = overAttrs = (attrs, obj) ->

#### extendEventValue

extendEventValue(props, prop, value, before)

    props: 部件的events特性

    prop: 事件名, 如"click", "onclick"等等

    value: 事件处理函数或者事件处理函数的数组

    before: 如果是javascript任何可以为真的值则value将被添加或连接到原事件处理器数组之前, 否则将被添加或连接到之前。默认为假。


### 指令

 domcom通过使用指令可以在某些情况下让代码更为简明，更为符合人的书写和阅读习惯。domcom的指令设计借鉴了angular的指令，但是，在domcom中指令只是作为语法糖存在，并不具有独立的不可替代的作用。任何时候都可以用普通的函数代替指令来实现完全相同的需求，区别只存在于代码格式方面。

 指令只允许用在Tag部件上。指令的使用方法是：

   tag { ..., $directiveName: directiveArguments, ...}, ...

 在执行Tag部件的初始化期间处理Tag的属性集的时候，如果遇到以"$"字符开头的属性，domcom认为这是一个指令，会查找预先注册的指令集，如果找到该指令的指令处理函数生成器，则以directiveArguments作为参数调用该生成器，然后用该调用返回的指令处理函数来处理该部件。如果没有注册该指令，domcom将认为是一个错误。

#### 注册指令

  domcom中使用任何指令前必须显式地注册。注册方法有两种。可以批量注册
    dc.directives {$directiveName:directiveGenerator, ...}


  或者注册单个指令
    dc.directives $directiveName:directiveGenerator

  directiveGenerator应该是个指令处理函数生成器。

#### 指令处理函数

  指令处理函数接受部件参数，对该部件进行处理，并返回该部件。

#### 指令处理函数生成器

  指令处理函数生成器是个返回指令处理函数的函数，返回的函数用于处理部件。

#### 内建指令

##### 文件夹路径：src/directives/

##### 说明

在上述文件夹定义了一组内建指令，也就是说定义了一组函数，这组函数可以充当指令处理函数生成器。可以通过如下代码注册所有内置指令:

    dc.directives dc.builtinDirectives

也可以单个地注册需要使用的指令, 例如：

    {$model} = dc
    dc.directives $model:$model

##### $model指令

* 模块：src/directives/model

* 用法：tag $model: model

##### $bind指令

* 模块：src/directives/bind
* 用法：tag $bind: model

##### $show和$hide指令

* 模块：src/directives/show-hide
* 用法：
  tag $show:test
  tag $show: [test, display]
  tag $hide: test
  tag $hide: [test, display]

##### $splitter指令

* 模块：src/directives/splitter
* $splitter: direction

##### $options指令

* 模块：src/directives/options

* 说明：只能配合`<select>标签部件使用

* 用法：select $options: [items]

##### $blink指令

* 模块：src/directives/blink
* tag $blink: delay

#### 示例

    {input, model, duplex} = require('domcom')
    obj = {a:1}
    a = duplex obj, 'a'
    comp = text type:'text', $model:a

### 内置部件

#### 说明

  combo, comboEdit, dialog, arrow, accordion

#### 子文件夹路径：domcom/src/builtins

### domcom工具

#### DomNode类

#### dc直属工具函数

##### 模块： domcom/src/dc

* dc

dc(element, options={})

* dc.directives

* dc.onReady

* dc.onReady(fn)

* dc.ready

* dc.ready()

* dc.render

* dc.render()

* dc.onRender

* dc.onRender(fn)

* dc.offRender

* dc.offRender(fn)

* dc.renderLoop

* dc.$document(与window.$document相同)

* dc.$body(与window.$body)

* dc.renderWhe

* dc.updateWhen

#### util工具函数

isArray

cloneObject

pairListDict

newLine

isEven

intersect

substractSet

binarySearch

binaryInsert

numbers

##### 模块： domcom/src/util

#### dom-util工具函数

##### 模块： domcom/src/dom-util

domValue

requestAnimationFrame

#### extend函数

# https://github.com/justmoon/node-extend

##### 模块： domcom/src/extend

