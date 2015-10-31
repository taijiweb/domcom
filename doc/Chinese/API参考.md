# Domcom API 参考文档

## 文档说明

### 记法、体例

#### 函数原型记法

	functionName arg1[: Type1], arg2[: Type2], ...
	
	functionName()

#### 方法原型记法:

	object.methodName arg1[: Type1], arg2[: Type2], ...
	
	object.methodName()

此处[]表示其中的内容可能省略。后文中函数或方法原型说明中出现的[...]，如果不是表示数组类型，就表示其中的内容是可选参数。

根据上下文，如果类型是显然的，不便描述或不用描述，就会省略类型部分。

上述记法适用于下一节“类型说明”以及后文中的函数或方法原型说明。


### 类型说明

本类型说明只是一个非正式的规范，为我们理解文档和编写用户程序提供帮助之用，不应该被当作精确的形式化体系。

以下是本文档函数原型说明中可能出现的一些类型:

* item:toComponent:    代表item可以是任何值，但是item会经过toComponent(item)转换成合适的部件。

* value:domField:    代表value可以是任何值，但是value会经过domField(value)转换成适用的dom节点特性值。

* fn:Reactive：   fn是响应函数

* x:Any:    x可以是任何类型

* items:[Type]:    items是元素类型为Type的数组

* Array:    数组类型

* items:[Type1, Type2, ...]:    items是元素按照Type1与Type2依次成对出现的数组

* hash:Hash：    hash是Object，要求不是数组或null

* item：HashValue:    代表item是Hash对象的值。Hash对象一般是相关函数的某个参数或宿主对象的某个字段。

* item：HashKey:    代表item是Hash对象的键。Hash对象一般是相关函数的某个参数或宿主对象的某个字段。

* item: Set:    代表item是个集合（特指键值总是为true或1的Object）。

* fn:(param1[: Type1] [, param2[: Type2] [, ...] ]) -> [Type]:    函数类型。

* item:Type1|Type2:    代表item:可以是类型1或者类型2的值。

* item:ValueReactive：    item可以是任何值，也可以是响应函数，如果item是普通函数，会被转换为强制响应函数。

* attrs:Attrs:    代表attrs可以作为Tag部件的attrs属性。在instantiate.coffee中，isAttrs(attrs)应该为true

* item：Index:    代表item是数组的下标索引。该数组一般是相关函数的某个参数或宿主对象的某个字段。

* item：Boolean:  代表item是布尔类型。

* item：Int: 代表item是整数类型

* item：String:    代表item是字符串。

* item：Promise:    代表item是Promise类型，应该带有then方法和catch方法。

* item:TagName:    代表item是可以作为Html标签名使用的合适的字符串，如div, custom-tag等等。

* item:PropName:    代表item是合适的Node特性名或者Node的Style中的特性名。根据不同的方法，使用这两者其中之一。

* item:PropSet:    代表item是从PropName到特性值的Hash类型。其中特性值是domField类型。

* item:ClassFn:    代表item是className(或class)特性的值或值列表，该值会被classFn作为参数，合并到一起作为className的特性。

### 关于方法的说明

本文档只描述公用的方法，包括类或类的实例提供的公用方法和模块提供的模块方法。

************************************************************************

## 获取Domcom、设置页面和引用Domcom API

### 获取Domcom
  npm install --save domcom

  git clone https://www.github.com/taijiweb/domcom

  下载github发布版本： [Github releases](https://github.com/taijiweb/domcom/releases)

  使用cdn: 感谢cdn.jsdelivr.net 提供cdn链接：

    http://cdn.jsdelivr.net/domcom/0.1/domcom.min.js

### 在页面中设置Domcom

  根据开发和应用需要从安装或下载的文件夹中选择domcom/dist/下的domcom.js, domcom.min.js, domcom-basic.js， domcom-basic.min.js中合适的文件，按照通常方法向html页面添加script标签：

    `<script src="path/to/domcom.min.js"/>`

  如果使用cdn.jsdelivr.net提供的cdn链接， 则应该添加如下的script标签

    `<script src="http://cdn.jsdelivr.net/domcom/0.1/domcom.min.js"/>`

  在domcom的script标签之后添加自己的js脚本：

    `<script src="path/to/my-app.js"/>`

### 导入和引用domcom提供的api

在浏览器环境下，添加domcom的`<script>`标签后，dc会成为全局变量，即window.dc。建议使用Coffee-script，或者babel以支持ES6语法，借助它们就可以参照如下的语法引用domcom提供的api：

	{see, div, list, if_} = window.dc

#### ES 6

如果采用webpack工具(或者browserify)，利用babel.js对ES 6 也可以参照如下的语法：

    {see, div, list, if_} = dc = require('domcom')

或者直接导入和引用单个文件(不提倡)：

    {see} = require('domcom/src/flow'
    {div} = require('domcom/src/core/')

### 原生的ES 5的语法

如果不借助上述工具，单纯采用原生的ES 5，就只能用以下的方法：

	var see = dc.see, div = dc.div, if_ = dc.if_;

或者象这样：

	dc.see(1); dc.div({}, "hello"); dc.if_(x, "hello",  "hi")

这显然不是很理想。还是建议尽量采用Coffee-script或者ES6的语法。 

***********************************************************

## API参考

### 部件

部件是构成Domcom骨架的最核心概念。domcom框架用部件代理和管理dom节点。每个部件最终将生成自己对应的Dom节点或者生成空节点。部件根据其基类的不同可以分成两大类：基础部件和变换部件。其中基础部件直接管理Dom，带有创建和刷新Dom，附着/删除节点等方法。变换节点最关键的方法是getContentComponent，通过这个方法逐步变换成基础部件。Domcom通过部件提供了对于Dom包括节点、节点特性以及Dom事件在内的完整的声明式描述，并利用值和响应函数描述了Dom和数据之间静态以及动态的交互关系，并以此为基础管理部件的更新过程和Dom刷新过程，改善时间和空间效率。

***********************************************************

#### 部件基类： Component

这是所有部件的基类，提供了部件类的公有方法，其中mount, unmount和remount方法管理部件的挂载与卸载, render和update方法管理部件的创建、绘制或更新，renderWhen和updateWhen方法设置重绘和更新时机，on，off和emit方法管理部件事件。

##### 部件方法
* **mount，unmount，remount**

  > 函数原型：`component.mount mountNode：Null|domNode, beforeNode：Null|domNode`
  
  挂载部件。如果Dom节点不存在，挂载前将创建Dom节点。mountNode是将要挂载的父节点，如果省略，将挂载到document.body节点。beforeNode将成为部件节点的下一相邻节点。假设实际挂载的父节点是parentNode，部件创建的Dom节点是node，则挂载方法如下：`parentNode.insertBefore(node, beforeNode)`

  > 函数原型：`component.unmount()`
  
  移除挂载。将部件从Dom中移除。

  > 函数原型：`component.remount()`

  恢复挂载。将部件重新挂载到Dom，挂载位置保持不变。

* **render，update**

  > 函数原型：`component.render()`

  绘制部件。如果部件的Dom节点还不存在，将创建Dom节点。如果Dom节点已经存在，而部件已失效，将执行合适的更新操作。如果部件有效，但是Dom节点的父节点`component.node.parentNode`不是部件的父节点`component.parentNode`，则会将部件的Dom节点挂载到部件父节点之下，`component.nextNode`代表的Dom节点之前。

  > 函数原型：`component.update()`
  
  更新部件。本方法和render方法的区别是本方法将先调用`component.emit('update')`

* **renderWhen，updateWhen**

  定制部件的更新时机：可以是其它某个或一组部件上发生的某些Dom事件，也可以采用window.setInterval或者dc.raf方法。以下是这两个函数的类型说明：
  
  > 函数原型： `component.renderWhen components:[Component]|Component, events:[DomEventName], options`
  
  > 函数原型： `component.updateWhen components:[Component]|Component, events:[DomEventName], options`
    
  当components的dom事件events发生时绘制或更新component。如果dc.config.useSystemUpdating为真，则这种方式配置的绘制或更新不会发生，除非在选项中设定options.alwaysUpdating = true 

  > 函数原型： `component.renderWhen event:setInterval, interval:Int(ms), options`
  
  > 函数原型： `component.renderWhen event:setInterval, interval:Int(ms), options`
  
  用window.setInterval函数设置每个interval毫秒绘制或更新一次部件。options可设置test函数在绘制或更新前进行测试。clear可以控制停止绘制或更新的时机。可以参考如下代码来帮助理解：
	
	addSetIntervalUpdate = (method, component, options) ->
	  handler = null
	  {test, interval, clear} = options
	  callback = ->
	    if !test or test() then component[method]()
	    if clear and clear() then clearInterval handler
	  handler = setInterval(callback, interval or 16)
  

  > 函数原型： `component.renderWhen event:dc.render, options`

  > 函数原型： `component.renderWhen when:dc.render, options`  

  dc.render函数中绘制或更新部件component。options可设置test函数在绘制或更新前进行测试。clear可以控制停止绘制或更新的时机。可以参考如下代码来帮助理解：

	addRenderUpdate = (method, component, options) ->
	  {test, clear} = options
	  callback = ->
	    if !test or test() then component[method]()
	    if clear and clear() then dc.offRender callback
	  dc.onRender callback 

* **on, off, emit**

  这三个方法管理直接发生在部件上的事件。这类事件称为部件事件。部件事件不同于发生在Dom上的事件， 是Domcom框架自带的事件处理机制，完全独立于Dom事件处理机制。部件事件注册在Component.listeners特性上，通过Component.on, off, emit三个方法进行处理。domcom内部也发送了一组部件事件，包括beforeMount, update, afterUnmount, beforeAttach, contentChanged等。

  > 函数原型：`component.on event, callback`
  
  注册部件事件回调函数callback，部件对象将成为callback的this上下文。

  > 函数原型： `component.off event, callback`

  移除已经注册在名为event的事件上的部件事件回调函数callback

  > 函数原型： `component.emit event, args...`

  执行注册在event上的所有回调函数。对于每个回调函数callback都执行`callback.apply(component, args)`

* **clone**

  Component类自身没有定义本方法，但是domcom内建的可以实例化的派生类大多定义了这个方法。扩充新的部件类时，如果该部件有可能需要复制自身产生一个copy部件，应该定义这个方法。clone方法可以复制一个component的拷贝。当部件需要用于多处，而直接引用可能引起Dom节点附着位置冲突的时候，可以考虑使用这个方法。

  > 函数原型: `component.clone()`


* **toString**

  Component自身没有定义本方法，但是domcom内建的可以实例化的派生类大多定义了这个方法，主要作用是为了帮助调试。

  > 函数原型: `component.toString indent:Int=0, addNewLine:Boolean`

***********************************************************
#### 部件辅助工具函数

#### toComponent函数

将任何项转化为部件。如果是部件，返回自身。如果是函数，返回文本部件，部件的文本域是该函数。如果是数组，返回列表部件。如果是promise，返回该promise的代理响应函数。如果是空值(null或undefined)，返回Nothing部件。其它情况返回文本部件。

##### 函数类型

  > 函数原型: `toComponent item:Any`

##### 参考实现

	toComponent = (item) ->

	  if isComponent(item) then item
	
	  else if typeof item == 'function' then new Text(item)
	
	  else if item instanceof Array
	    new List(for e in item then toComponent(e))
	
	  else if !item? then new Nothing()
	
	  else if item.then and item.catch
	    component = new Func react -> component.promiseResult
	
	    item.then (value) ->
	      component.promiseResult = value
	      component.invalideTransform()
	
	    item.catch (error) ->
	      component.promiseResult = error
	      component.invalideTransform()
	
	    component
	
	  else new Text(item)

#### isComponent函数

  判断任何项是否为部件。

##### 函数类型

  > 函数原型: `isComponent item:Any`

##### 参考实现
	
	isComponent = (item) -> item and item.renderDom

***********************************************************

#### 基础部件基类： BaseComponent

  基础部件具有直接管理Dom的方法，包括createDom, updateDom，attachNode，removeNode等。大多数基础部件都直接生成Dom节点，List部件则间接通过子部件生成Dom节点，空的List部件(`children.length==0`)和Nothing节点不会生成实际的Dom节点，而是以空数组[]表示空节点。节点特性为this.node。Tag，Text，Comment部件的node特性是实际的Dom节点；Html部件的node特性是数组，包含一组实际的Dom节点；List的node特性是数组，包含实际的Dom节点或者是别的List节点的node。

##### 模块: Core/Base/BaseComponent

##### 直接父类：Component

##### 子类：List, Tag, Text, Html, Comment, Nothing

##### 构造函数和实例化函数

  不要直接使用基础部件对象。

***********************************************************

#### 列表部件：List

##### 模块: Core/Base/List

##### 直接父类：BaseComponent

##### 子类：Tag

##### 构造函数
  > 函数原型： new List(children: [toComponent])

##### 实例化函数

  > 函数原型： list children...: [toComponent]

##### 示例
	list \
	    label "user name: ",
	    text placeholder: "input here: ", value: username$

##### 相关实例化函数: every, all, nItems

  every, all和nItems都返回列表部件的实例。

  > 函数原型： `every arrayItems:[Any], itemFn:(item:Any, index:int, arrayItems:arrayItems!) -> toComponent`

  > 函数原型： `all objectItems:Hash, itemFn:(value, key, index:Index, objectItems!) -> toComponent`

  > 函数原型： `nItems n:Int|Function|Reactive, itemFn:(value, key, index:Index, objectItems!) -> toComponent`  
  
  itemFn称为部件模板函数，返回部件，如果返回值不是部件，将被toComponent函数转化为部件。

##### List部件方法

列表部件提供了一组动态管理子部件的方法。这组方法可以增减部件特性children中包含的子部件。注意，这些方法并不会立即影响Dom，而是先失效列表部件，等到调用部件更新方法时才会实际刷新Dom。除了在定制、扩展部件的时候，程序绝大多数时候可能不需要使用这些方法。建议尽量不要使用这组方法直接强制性动态修改部件结构。

* **pushChild**

  从List.children后面压入一个子部件child。

  > 函数原型： `component.pushChild child:toComponent`


* **unshiftChild**

  从List.children前面压入一个子部件child。

  > 函数原型： `component.unshiftChild child:toComponent`

* **insertChild**

  向List.children的index位置插入一个子部件child。

  > 函数原型： `component.indexChild index:Index, child:toComponent`

* **removeChild**

  删除List.children的index位置的子部件。

  > 函数原型： `component.removeChild index:Index`

* **setChildren**

  设置从List.children的index位置开始的一组位置的各个子部件分别为newChildren中对应的部件。

  > 函数原型： `component.setChildren startIndex:Index, newChildren:[toComponent]...`

* **setLength**

  设置从List.children的长度为newLength，从newLength开始所在位置的子部件将被删除。如果newLength大于等于List.children的原长度，此方法没有作用。

  > 函数原型： `component.setLength newLength:Int`

***********************************************************

#### 标签部件：Tag

##### 模块: Core/Base/Tag

##### 直接父类：List

##### 构造函数原型
  > 函数原型： new Tag(tagName, attrs, children)

##### 实例化函数原型

  > 函数原型： `dcTagName([attrs:Attrs] [, children:[toComponent]...])`
  
  DCTagName是可以实例化Tag部件的函数名，必须从dc名字空间引入对于的名字方可使用，例如div, p, span, input, textarea, select等。

  > 函数原型： `inputType([attrs:Attrs][, value:domField])`

  inputType是<intput>标签允许的类型值，包括text, number, checkbox, radio, email, date, tel等。

  关于dcTagName和inputType这两项内容的完整列表请参阅src/core/tag.coffee。

  > 函数原型： `tag tagName:TagName [attrs:Attrs][, children:[toComponent]...]`

  tagName是任何可以作为html标签名的字符。

##### 示例

    span "hello"
    li -> x

	text({$model: model}), select $options:[['domcom', 'angular', 'react']]

	input {type:"text", value: who$, onchange: -> alert "hello, "+who$()}

##### Tag部件方法

  Tag部件对应于Dom的Element类型节点，可以管理对应Dom节点的特性，Css Style， Dom事件等。Tag部件所定义的Dom节点特性是响应式的，即这些值如果是函数，则成为响应函数。只有响应函数的计算失效时，Tag部件才需要更新这些特性。而更新特性时，会将计算所得新值与缓存值进行比较，只有两者不相同才需要实际修改Dom节点特性，执行Dom操作以刷新Dom。Dom事件是发生在Dom节点上的事件，不同于Domcom部件事件，这些事件包括onclick，onchange等。对于Dom事件处理函数，domcom主要通过构造Tag部件时利用attrs参数进行声明，也可以通过Tag.bind，Tag.unbind来管理。$model指令，Component.renderWhen, Component.updateWhen, dc,renderWhen, dc,updateWhen等函数也可以添加事件处理函数。

  Tag部件的大部分方法都不直接操作Dom，也不会立即起作用。而是要等到调用本部件或上层部件的render或update方法才会刷新Dom。如果设置的新特性和缓存特性有相等的值，不会导致Dom操作。因此Domcom可以提高应用的性能。这些方法包括Tag.prop, Tag.css, Tag.addClass, Tag.removeClass, Tag.show, Tag.hide等。

  Tag.bind, Tag.unbind和上述描述不同。这两个方法则将直接操作Dom节点事件处理函数中用到的Dom部件事件处理函数数组，从而也将会直接影响Dom节点的事件行为，如果Dom部件事件处理函数数组中的事件函数增加第一个处理函数数或者全都被删除，则会向Dom节点赋值或解除Dom节点的事件处理函数。这种机制是不会影响性能的。因为Dom节点事件处理函数的赋值或解除赋值是不会引起Dom刷新或重新布局的。

* prop

  > 函数原型： `tag.prop prop:PropName|PropSet, value：domField`

   prop: 如果参数个数是1，则prop为特性名，此时函数返回部件对应的node的该特性名的值，或者为包含特性与值的集合的object，函数将扩展部件的特性集，如果参数个数为2， 则本方法将设置部件的prop特性为（tag.props[prop]=value）。

   value: undefined,或者被设置的特性的值，可以是函数。如果是函数，部件对应的dom node的prop特性（tag.node[prop])将在每次更新的时候与该函数的值动态保持一致。

* css

  > 函数原型： `tag.css prop:PropName|PropSet, value：domField`
    
  如果参数个数是1，则prop为特性名，此时本方法返回部件的style中prop的值（tag.style[prop]），或者为包含特性与值的集合的object，本方法将扩展部件的style的特性集；如果参数个数为2， 则本方法将设置部件的style的prop特性（tag.style[prop]=value）。
    
  prop: 特性名，或者包含特性与值的集合的object，函数将扩展部件的style的特性集
  
  value: undefined，或者为部件的style的prop特性的值。value可以是函数。如果是函数，部件对应的dom node的style的prop特性（tag.node.style[prop])将在每次更新的时候与该函数的值动态保持一致。

* addClass, removeClass

  > 函数原型： `tag.addClass items：[ClassFn]...`

  > 函数原型： `tag.removeClass classes:[ClassName]...`

* show, hide

  > 函数原型： `tag.show [display]`

  > 函数原型： `tag.hide()`

* bind, unbind

  > 函数原型： `tag.bind eventName, handlers:DomEventHandler`

  > 函数原型： `tag.unbind eventName, handler`

  绑定或移除Tag部件的eventName所指Dom事件使用的Dom事件处理函数。Domcom将事件处理函数收集到一个数组，并产生一个真正的事件处理函数，将此函数设置到Dom节点的EventName特性。

  handler将这样被调用：handler.call(node, event, component), 其中，本Tag部件对应的Dom节点node成为handler的this，event是实际发生的Dom事件，component是本Tag部件。当事件的所有事件处理函数执行完毕后，将执行event.preventDefault()和event.stopPropagation()，除非event.executeDefault或者event.continuePropagation各自被显式地设置为真。

  具体实现请参考如下代码：

	eventHandlerFromArray = (callbackList, eventName, component) ->
 		(event) ->
			node = component.node
			for fn in callbackList then fn and fn.call(node, event, component)
			updateList = component.eventUpdateConfig[eventName]
			if updateList
			 for [comp, options] in updateList
			   # the comp is in updateList, so it need to be updated
			   # if config.useSystemUpdating then update this component in dc's system update scheme
			   if options.alwaysUpdating or !config.useSystemUpdating then comp[options.method]()
			if !event then return
			!event.executeDefault and event.preventDefault()
			!event.continuePropagation and event.stopPropagation()
			return


***********************************************************

### 文本部件：Text

##### 模块: Core/Base/Text

##### 直接基类：BaseComponent

##### 子类：Html, Comment

##### 构造函数

  > 函数原型： `new Text text:domField`

##### 实例化函数

  > 函数原型： `txt [attrs:Attrs, ]string:domField`

##### 说明

  任何需要部件的位置，如果传入的不是部件，也不是null或者undefined，都会被转为Text部件，如示例中的(1)。

##### 示例

  div 1; p "hello", who$; li someVariable; span -> someVariable  # （1）


***********************************************************

### Html部件: Html

##### 模块: Core/Base/Html

##### 直接基类：Text

##### 构造函数

  > 函数原型： `new Html htmlText:domField[, transform:(String) -> String]`

##### 实例化函数

  > 函数原型： `html [attrs:Attrs, ]htmlText:domField[, transform:(String) -> String]`

##### 示例

	html "<div> This is domcom </div> <div> That is angular </div>"
	html someHtmlTextString, escapeHtml


***********************************************************

### 注释部件: Comment

##### 模块: Core/Base/Comment

##### 直接基类：Text

##### 构造函数

  > 函数原型：new Comment text:domField

##### 实例化函数

  > 函数原型：comment text:domField

  注释部件实例化不提供attrs:Attrs参数。

##### 示例

	comment "this is a comment"


***********************************************************

### 空部件: Nothing

##### 模块: Core/Base/Nothing

##### 直接基类：BaseComponent

##### 构造函数

  > 函数原型：new Nothing()

##### 实例化函数

  > 函数原型：nothing()

  空部件实例化不提供attrs:Attrs参数。

##### 说明

  当toComponent(item)中item是null或undefined时，将创建空部件。


***********************************************************



#### 变换部件基类： TransformComponent

  变换部件具有getContentComponent方法。重绘Dom前变换部件先调用getContentComponent方法，先获取内容部件后再决定重绘过程。变换部件通过内容部件链连接到基础部件，也会对应到Dom节点或空节点。节点特性为this.node。

##### 模块: Core/Base/TransformComponent

##### 直接父类：Component

##### 子类：If, Case, Cond, Func, Each, Route, Defer

##### 构造函数和实例化函数

  不要直接使用变换部件对象。

***********************************************************


### If部件：If

##### 直接基类：TransformComponent

##### 模块: Core/Base/If

##### 构造函数

  > 函数原型： `new If test:ValueReactive, then_:toComponent[, else_:toComponent]`

##### 实例化函数

  > 函数原型： `if_ [attrs:Attrs, ]test:ValueReactive, then_:toComponent[, else_:toComponent]`
  
  else_是可以选的，如果else_参数没提供，则If部件的else_特性是Nothing部件。

##### 示例

	x = see 0, parseFloat
	comp = list \
        text({onchange: -> comp.update()}, x)
        if_(x, div('It is not 0.'), div('It is 0 or NaN.')))

***********************************************************

### Case部件：Case

##### 模块: Core/Base/Case

##### 直接基类：TransformComponent

##### 构造函数

  > 函数原型： `new Case test:ValueReactive, caseMap:Hash[, else_:toComponent]`

##### 实例化函数

  > 函数原型： `case_ [attrs:Attrs, ]test:ValueReactive, caseMap:Hash[, else_:toComponent]`

##### 示例

    case_(x, {
        A: "Angular",
        B: "BackBone",
        D: "Domcom",
        E: "Ember",
        R: "React"
    },  "some other")

***********************************************************

### Cond部件

##### 模块: Core/Base/Cond

##### 构造函数

  > 函数原型： `new Cond testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]`

##### 实例化函数

  > 函数原型： `Cond attrs:Attrs, testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]`


***********************************************************

##### Func函数部件

##### 模块: Core/Base/Func

##### 构造函数

  > 函数原型： `new Func func:Function|Reactive`

##### 实例化函数原型

  > 函数原型： `func [attrs:Attrs, ]func:Function|Reactive`


##### 示例

	x = 0
	comp = null
	indexInput = number({onchange: -> x = parseInt(@value); comp.render()})
	comp = list(indexInput, func(-> if x>=0 and x<=3 then div x))

***********************************************************

### Each部件

##### 模块: Core/Base/Each

##### 构造函数

  > 函数原型： `new Each attrs:Attrs, items:[Any]|Reactive->[Any][,options:Options]`

##### 实例化函数

  > 函数原型： `each [attrs:Attrs, ]items:[Any]|Reactive->[Any][,options:Options]`

##### 示例

***********************************************************

#### Route部件

##### 模块: Core/Base/route

##### 构造函数

  > 函数原型： `new Route routeList, otherwise, baseIndex`
  
  基本没有必要直接使用Route构造函数，使用route函数总是更方便。route附带有to方法，而Route则没有。

##### 实例化函数

  > 函数原型： `route routeList:[RoutePattern, RouteHandler...], [otherwise：toComponent][, baseIndex]`
  
  其中，RoutePattern是路由模式字符串或者路由模式字符串及测试函数，路由模式字符串中可以包括包括查询字段名(冒号:引导的标识符)及正则表达式，通配符(*或**)及普通字符串。

  RouteHandler是如下类型的函数：

  > 函数原型： `(match:RouteMatchResult, childRoute: RouteInstantiateFunction) -> toComponent`

  RouteMatchResult的类型如下：
    { 
      items: 匹配的查询字段结果。
      basePath: 传入路由部件的基路径
      segment: [String]：与模式相匹配的字符段
      leftPath: String： 与模式匹配过后剩余的字符段
      childBase: Int：子路由部件的字符段基索引
    }
  
  route和childRoute带有to方法，可用于设置`location.href`或者`window.history`。

  > 函数原型： `route.to path:RelativePath|AbsolutePath`
  
  > 函数原型： `childRoute.to path:RelativePath|AbsolutePath`

##### 示例

    comp = route(
      'a/*/**', (match, route2) ->
        route2 1, (-> 1),
          2, -> 2,
          3, -> 3
          otherwise: 'otherwise 2'
      'b/**', -> 'b/**'
      otherwise: 'otherwise 1'
    )
	
***********************************************************

### Defer部件

##### 模块: Core/Base/Defer


##### 构造函数

  > 函数原型：new Defer
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]

##### 实例化函数

  > 函数原型：defer attrs:Attrs,
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]

##### 示例

***********************************************************

### 响应函数

  响应函数是Domcom框架区别于其它框架的关键要素。Domcom中一切连接数据的成分，包括Dom特性，If,Case, Cond部件的测试条件，Func部件的func特性，Each部件基于的数组和对象，等等，都可以是响应函数。响应函数具有invalidateCallbacks，它包含该响应函数的失效回调函数的列表；还具有invalidate和onInvalidate两个方法，其中onInvalidate用于注册失效回调函数，invalidate用于执行onInvalidate注册的所有失效回调函数。

  响应函数通过响应函数生成器来产生。

  domcom与响应函数相关的方法都定义在domcom/srs/flow/文件夹，其中所有方法名都直接定义在dc.flow名字空间，可以用flow.someName或者{someName,...} = dc.flow的方式引用。为了方便flow/index模块下的常用方法名也导入到了dc名字空间，因此也可以通过dc.someName或{someName,...} = dc的方式引用。

#### flow/index模块

##### react

* 函数原型： ``

##### reactive.invalidate

* 函数原型： ``

##### renew

* 函数原型： ``

##### dependent

* 函数原型： ``

##### flow

  * 函数原型： ``

##### pipe

  * 函数原型： ```

##### see

  * 函数原型： `see value: Any[, Transform:(Value) -> Any]`

  * 示例
    
    username$ = see "Tom"

    num1$ = see 1,
    num2$ = see 2

##### seeN

  * 函数原型： ``


##### bind

  * 示例

	score = { name: "Tom", points:95}
	
	name$ = bind(scores, "name")
	
##### duplex
	
	points$ = duplex(scores, "points")
	
##### unary
	
##### binary

****************************************************************************

#### flow/watch-list模块

##### watchEachList

##### watchEachObject

****************************************************************************

#### flow/addon模块

以下函数都会根据给定的参数生成响应函数。

##### 自动绑定

  根据模型数据生成一组单向绑定(flow.bind)和双向绑定(flow.duplex),其中单向绑定的特性名前缀为"_", 双向绑定的的特性名前缀为"$"。

  > 函数原型：bindings model:Object[, name:String]

  name参数可选，为生成的响应函数的toString所用。

  以下为参考实现：

    dc.bindings = flow.bindings =  (model, name) ->
      result = {}
      for key of model
        result[key+'$'] = duplex(model, key, name)
        result[key+'_'] = bind(model, key, name)
      result

  * 示例：

     m = {a:1, b: 2}
     bindings$ = bindings m

     {a_, b$} = m

##### 一元运算
  neg， no， bitnot， reciprocal，abs， floor，ceil， round

##### 二元运算
  add， sub，mul，div，min

##### 条件判断：
  if_

******************************************************************

### domcom辅助工具

#### DomNode类

#### dc直属工具函数

##### 模块： domcom/src/dc

##### 方法

* dc

  > 函数原型：`dc element: DomSelector|Node|[Node]|NodeList, options={}`
   

* dc.directives

  注册一条或多条指令。关于指令以及此方法的详细说明请参考后面“指令”一节的专门描述。

* dc.onReady

  > 函数原型：`dc.onReady fn:Callback`


* dc.ready
  
  执行dc.onReady注册的所有回调函数。

  > 函数原型：`dc.ready()`


* dc.onRender

  注册应该在dc.render中执行的回调函数。


  > 函数原型：`dc.onRender callback:Callback`
  

* dc.offRender

  移除已经注册的应该在dc.render中执行的回调函数。

  > 函数原型：`dc.offRender callback:Callback`


* dc.render

  执行经由dc.onRender注册的所有回调函数。

  > 函数原型：`dc.render()`
  

* dc.renderLoop

  通过requestAnimFrame（或者其腻子函数）循环执行`dc.render()`。
  
  > 函数原型：`dc.renderLoop()`
  
  如下代码是dc.renderLoop的实现，位于domcom/src/dc.coffee：

	dc.renderLoop = renderLoop = ->
	  requestAnimFrame renderLoop
	  render()
	  return

* dc.renderWhen和dc.updateWhen


##### dc特性
 
* dc.$document
  
  与window.$document是同一个变量，dc.$document = dc(window.document)

* dc.$body
 
  与window.$body)，dc.$body = dc(window.body)


#### Tag特性工具函数

##### 模块：src/core/property

##### 说明

为处理Tag的class，style及其它特性提供便利的一组工具函数。包括classFn, styleFrom, extendAttrs等

##### classFn

  > 函数原型: classFn： items：[classFnType]...

  classFnType是个递归定义的类型，其定义为：`ClassName|MultipleClassNames|classFn(...)|classFnType`

    
#### styleFrom

  > 函数原型: styleFrom value

    value: 形如"stylePropName:value; ..."的style字符串, 
      或: 形如"stylePropName:value"的项的数组, 可包含空白字符, 
      或: 形如[stylePropName, value]的项的数组


##### extendAttrs

  > 函数原型: extendAttrs toAttrs:Attrs|Null, fromAttrs:Attrs|Null

  > 函数原型: overAttrs fromAttrs:Attrs|Null, toAttrs:Attrs|Null

    toAttrs: 待扩展的属性集, 如果是null或undefined, 将创建一个新的空对象

    fromAttrs: 用来覆盖或增强属性集特性的对象

##### extendEventValue

  > 函数原型: extendEventValue props, prop, value, before

    props: 部件的events特性

    prop: 事件名, 如"click", "onclick"等等

    value: 事件处理函数或者事件处理函数的数组

    before: 如果是javascript任何可以为真的值则value将被添加或连接到原事件处理器数组之前, 否则将被添加或连接到之前。默认为假。

***********************************************************

#### util工具函数

##### 模块： domcom/src/util

Domcom实现的这组util工具函数主要提供给框架代码使用，并非出于提供一组通用性的工具函数的目的。用户程序请视情况使用。

##### isArray

  判断任何项是不是数组类型。

* 类型定义

  > 函数原型: `isArray item:Any`

* 参考实现：

  当前的实现代码如下，仅作参考，有可能在后续版本进行修改。代码位于domcom/src/util.coffee：

	exports.isArray = (item) -> Object.prototype.toString.call(item) == '[object Array]'


##### cloneObject

  复制对象参数。

* 类型定义

  > 函数原型: `cloneObject obj:Object`

##### pairListDict

  将列表数组中的项成对地复制成字典类型(或者叫hash，map， object）。

* 类型定义

  > 函数原型: `pairListDict keyValuePairs[key, value, ...]...`

##### newLine

  返回一个带起始新行以及指定缩进的字符串。

* 类型定义

  > 函数原型: `newLine str:String, indent:Int, addNewLine:Boolean`

##### isEven

  判断某数是否是偶数。

* 类型定义

  > 函数原型: `isEven n:Int`

##### intersect

  求两个集合的交集。

* 类型定义

  > 函数原型: `intersect maps:[Set]`

##### substractSet

  求两个集合的差集。

* 类型定义

  > 函数原型: `substractSet whole：Set, part:Set`

##### binarySearch

  对排序的项进行二分搜索查找item。如果item已经存在，返回item已存在的位置的索引，否则返回适合插入item的位置的索引。

* 类型定义

  > 函数原型: `binarySearch item:Sortable, items[Sortable]`

##### binaryInsert

  将项item按序插入已经排序的数组中。如果项item已经存在，则不做插入。使用二分搜索算法。返回插入item的位置或item已存在的位置的索引。

  Domcom通过binarySearch和binaryInsert提高更新List部件children的时间效率。

* 类型定义

  > 函数原型: `binaryInsert item:Sortable, items[Sortable]`

##### numbers

  如果n是整数(必须大于等于0），返回小于n的整数列表，如果n是函数，则返回一个响应依赖于n的响应函数，该响应函数返回小于n()的整数列表。

* 类型定义

  > 函数原型: `numbers n:Int|Function|Reactive`

**********************************************

#### dom-util工具函数

##### 模块： domcom/dom-util

##### domField

  如果value是undefind或null，返回""；如果是普通函数，返回强制响应函数; 如果是响应函数，直接返回该项；如果是Promise(有then方法和catch方法), 返回该promise的响应函数代理。其它情况返回该项自身(因为domField一般用作Dom特性，因此后续一般会因Javascript语言的类型转换机制而调用该项的toString转换成字符串）。

  domField通常由domcom自动调用。用户程序一般无需直接使用该函数。

* 类型定义：
  
  > 函数原型: `domField item:domField`
  
* 实现代码参考：

  如下代码位于domcom/src/dom-util.coffee：

	exports.domField = (value) ->

	  if !value? then return ''
	
	  if typeof value != 'function'
	
	   if value.then and x.catch
	     fn = react -> fn.promiseResult
	
	     value.then (value) ->
	        fn.promiseResult = value
	        fn.invalidate()
	
	     .catch (error) ->
	        fn.promiseResult = error
	        fn.invalidate()
	
	     return fn
	
	   else return value
	
	  if !value.invalidate then return renew(value)
	
	  value

##### domValue

  如果value是undefind或null，返回""；如果是函数fn, 则返回fn()（如果函数值是是undefind或null，返回"")。其它情况返回该项自身(因为domValue一般用作Dom特性，因此后续一般会因Javascript语言的类型转换机制而调用该项的toString转换成字符串）。

  domValue通常由domcom自动调用。用户程序一般无需直接使用该函数。

* 类型定义：

  > 函数原型: `domValue item:domField`

* 实现代码参考：

  如下代码位于domcom/src/dom-util.coffee：

    exports.domValue = (value) ->
      if !value? then return ''
      else if typeof value != 'function' then value
      else
        value = value()
        if !value? then return ''
        else value

##### requestAnimationFrame (即dc.raf)

  window.requestAnimationFrame或其腻子函数，被dc.renderLoop使用。

* 类型定义：
  
  > 函数原型: `requestAnimationFrame callback:Callback`
  
* 示例
   
 如下代码位于domcom/src/dc.coffee：

	dc.renderLoop = renderLoop = ->
	  requestAnimFrame renderLoop
	  render()
	  return   

*********************************************************
 
#### 模块：domcom/extend 

##### extend函数

将第二个开始的对象类型参数(或者叫做hasn, map)的特性补充到底一个对象类型参数。采用https://github.com/justmoon/node-extend。

* 模块： domcom/src/extend

* 函数原型

 > 函数原型: ` extend toObject:Object, fromObjects:[Object]:...`
  
* 示例
   
  如下代码位于domcom/src/index.coffee：
  
	extend dc,
	
	  require './config'
	
	  # utilities
	  require './flow/index'
	  require './flow/watch-list'
	  require './dom-util'
	  require './util'
	
	  # component
	  require './core/index'

### Domcom指令

 domcom通过使用指令可以在某些情况下让代码更为简明，更为符合人的书写和阅读习惯。domcom的指令设计借鉴了angular的指令，但是，在domcom中指令只是作为语法糖存在，并不具有独立的不可替代的作用。任何时候都可以用普通的函数代替指令来实现完全相同的需求，区别只存在于代码格式方面。

 指令只允许用在Tag部件上。指令的使用方法是：

   tag { ..., $directiveName: directiveArguments, ...}, ...

 在执行Tag部件的初始化期间处理Tag的属性集的时候，如果遇到以"$"字符开头的属性，domcom认为这是一个指令，会查找预先注册的指令集，如果找到该指令的指令处理函数生成器，则以directiveArguments作为参数调用该生成器，然后用该调用返回的指令处理函数来处理该部件。如果没有注册该指令，domcom将认为是一个错误。

#### 注册指令

  domcom中使用任何指令前必须显式地注册。注册方法有两种。可以批量注册

  > 函数原型： `dc.directives {$directiveName:generator:DirectiveHandlerGenerator ... }`
  
  或者注册单个指令

  > 函数原型： `dc.directives $directiveName:String, generator:DirectiveHandlerGenerator`
  
  其中，DirectiveHandlerGenerator表示指令处理函数生成器，是个返回指令处理函数的函数。其类型如下
  
  > 函数原型： `DirectiveHandlerGenerator: (...) -> DirectiveHandler`
  
  DirectiveHandler表示指令处理函数，它接受部件参数，对该部件进行处理，并返回该部件，其类型如下：

  > 函数原型： `DirectiveHandler: (component) -> component` 

#### 内建指令

  Domcom预定义了一组内建指令。

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

* 说明：只能配合`<select>`标签部件使用

* 用法：select $options: [items]

##### $blink指令

* 模块：src/directives/blink
* tag $blink: delay

#### 示例

    {input, model, duplex} = require('domcom')
    obj = {a:1}
    a = duplex obj, 'a'
    comp = text type:'text', $model:a

***********************************************************

### 内置部件

  Domcom预定义了一组内置部件，包括combo, dialog, triangle, autoWidthEdit, accordion等。这些部件主要起演示作用，实际项目中请视情况选用。从这些实例可以看到，在Domcom框架下，要扩充新的部件是非常简单的。

#### 子文件夹路径：domcom/src/builtins/
