# Domcom API 参考文档

## 文档说明
### 函数原型记法
	functionName(arg1[: Type1], arg2[: Type2], ...）
	functionName()
### 方法原型记法
	object.methodName(arg1[: Type1], arg2[: Type2], ...）
	object.methodName()
此处[]表示其中的内容可能省略。后文中函数或方法原型说明中出现的[...]，如果不是表示数组类型，就表示其中的内容是可选参数。 arg:Type中的Type是一个非正式的类型说明。根据上下文，如果类型是显然的，不便描述或不用描述，会省略类型部分。请参看[API类型说明.md](https://github.com/taijiweb/domcom/blob/master/doc/Chinese/API类型说明.md)。  
本文档只描述公用的接口，包括类、类成员，类方法、函数等。

************************************************************************

## 获取Domcom、设置页面和引用Domcom API
### 获取Domcom
  `npm install --save domcom`  
  `git clone https://www.github.com/taijiweb/domcom`  
  下载github发布版本： [Github releases](https://github.com/taijiweb/domcom/releases)  
  使用cdn: 感谢cdn.jsdelivr.net 提供cdn链接(替换x.y.z为实际版本号）：  

      http://cdn.jsdelivr.net/domcom/x.y.z/domcom.min.js
### 在页面中设置Domcom
  根据开发和应用需要从安装或下载的文件夹中选择domcom/dist/下的domcom.js, domcom.min.js中合适的文件，按照通常方法向html页面添加script标签：  
  > 开发版本：`<script src="path/to/domcom.js"/>`  
  > 产品版本：`<script src="path/to/domcom.min.js"/>`

  如果使用cdn.jsdelivr.net提供的cdn链接， 则应该添加如下的script标签(替换x.y.z为实际版本号）

  > `<script src="http://cdn.jsdelivr.net/domcom/x.y.z/domcom.min.js"/>`

  在domcom的script标签之后添加自己的js脚本：

  > `<script src="path/to/my-app.js"/>`

### 导入和引用domcom提供的api
在浏览器环境下，添加domcom的`<script>`标签后，dc会成为全局变量，即window.dc。建议使用Coffee-script，或者babel以支持ES6语法，借助它们就可以参照如下的语法引用domcom提供的api：

    {see, div, list, if_} = window.dc

#### ES6
如果采用webpack工具(或者browserify)，利用babel.js对ES 6 也可以参照如下的语法：

    const {see, div, list, if_} = dc = require('domcom')

### ES5
如果不借助上述工具，单纯采用ES5，就只能用以下的方法：

    var see = dc.see, div = dc.div, if_ = dc.if_;

或者象这样：

    dc.see(1);
	dc.div({}, "hello")
    dc.if_(x, "hello",  "hi")

这类写法显然不是很理想。还是建议尽量采用Coffee-script或者ES6的语法。 

***********************************************************

## API参考

### 部件

Domcom用部件管理dom节点，部件是框架的最核心概念。每个部件都有自己对应的Dom节点（除非是Nothing部件或者空列表）。部件根据其基类的不同可以分成两大类：基础部件和变换部件。其中基础部件直接管理Dom，带有创建和刷新Dom，挂载/删除节点等方法。变换节点最关键的方法是getContentComponent，通过它变换成别的变换部件或基础部件，最终都终会变换成基础部件。Domcom通过部件提供了对于Dom的完整的声明式描述（包括节点、子节点，节点特性以及Dom事件等等），并利用值和响应函数描述了Dom和数据之间静态以及动态的交互关系，并以此为基础管理部件更新和Dom刷新过程，改善运行性能。

***********************************************************

#### 部件基类： Component

这是所有部件的基类，提供了部件类的共有方法，其中mount, unmount方法管理部件的挂载与卸载, render方法管理部件的创建、绘制或更新，renderWhen方法设置重绘和更新时机，on，off和emit方法管理部件事件。

##### 部件特性：

以下是所有部件都具有的内部特性。罗列如此的目的是为了帮助了解框架原理，方便编写代码。这些特性都由框架管理，除非处于扩展框架的目的，并且已经非常熟悉整个框架的内部实现，用户代码不鼓励使用和修改这些特性。

* `dcid`  
  为了方便部件管理引入的全局唯一的整数索引。
* `listeners`  
  部件事件映射对象，通过Componet的emit，on，off，once方法管理。
* `baseComponent`  
  部件对应的基础部件。所有BaseComponent子类部件的baseComponent总是this自身。
* `parentNode`  
  在Dom中挂载的parentNode。
* `nextNode`  
  在Dom中挂载的下一邻接节点，即如下调用中的beforeNode：`parentNode.insertBefore(node, beforeNode)`。
* `node`  
  对应的Dom节点。虽然domcom的实现能够避免绝大多数直接操作dom的需求，但是，在真正有这类特殊需求时，部件的node成员使用起来非常简单便捷。
* `holder`  
  本部件的持有者，父部件。
* `valid`  
  此部件自身是否有效（是否需要更新）
* `attachValid`  
  此部件的挂载点是否有效（是否需要重新挂载）？
* `removing`  
  此部件是否正等待删除？
* `removed`  
  此部件是否已经完成删除（从Dom中实际删除）？
* `destroyed`  
  此部件是否已经被销毁（不应再被使用，更新和刷新）？

##### 部件方法
* **mount，unmount** 
  挂载和卸载部件
 
  > `component.mount mountNode：Null|domNode, beforeNode：Null|domNode`    
  挂载部件。如果Dom节点不存在，挂载前将创建Dom节点。mountNode是将要挂载的父节点，如果省略，将挂载到document.body节点。beforeNode将成为部件节点的下一相邻节点。假设实际挂载的父节点是parentNode，部件创建的Dom节点是node，则挂载方法如下：`parentNode.insertBefore(node, beforeNode)`

  > `component.unmount()`  
  移除挂载。将部件从Dom中移除。
  
* **render**  
  重绘部件。  
  > `component.render(forceRender)`  
  注意：如果部件中有等待删除的子部件，render之后应该记得调用`dc.clean()`执行实际的dom删除操作。

* **renderWhen**  
  定制部件的更新时机：可以是其它某个或一组部件上发生的某些Dom事件，也可以是setInterval，setTimeout。
  > `component.renderWhen components:[Component]|Component, events:[DomEventName], options`  
  用window.setInterval函数设置每个interval毫秒绘制或更新一次部件。options可设置test函数控制是否实际进行绘制。clear可以控制停止绘制或更新的时机。

* **remove**  
  删除部件，从holder中删除，并从dom中删除节点。
  > `component.remove()`  
  注：此方法会执行实际的dom删除操作。
  
* **destroy**  
  删除部件，从holder中删除，并从dom中删除节点。复位所有部件成员。此方法的主要目的是为了避免dom或javascript语言引起的内存泄漏。
  > `component.destroy()`  
  注：此方法会执行实际的dom删除操作。
  
* **replace**  
  替换部件。
  > `component.replace(oldComponent, forceRender)`  
  注：此方法会调用render方法。

* **emit, on, off**  
  这三个方法管理直接发生在部件上的事件。这类事件称为部件事件。部件事件不同于发生在Dom上的事件， 是Domcom框架自带的事件处理机制，完全独立于Dom事件处理机制。部件事件注册在Component.listeners特性上，通过Component.on, off, emit三个方法进行处理。domcom内部也发送了一组部件事件，包括willMount, didUnmount, willAttach。  

  > `component.emit event, args...`  
  执行注册在event上的所有回调函数。对于每个回调函数callback都执行`callback.apply(component, args)`
    
  > `component.on event, callback`  
  注册部件事件回调函数callback，部件对象将成为callback的this上下文。

  > `component.off event, callback`  
  移除已经注册在名为event的事件上的部件事件回调函数callback

* **getPrevComponent, getNextComponent**  
  获取holder的children中的前后相邻部件  
  > `component.getPrevComponent()`  
  > `component.getNextComponent()`
  
* **isOffspringOf, inFamilyOf**   
  component是不是在ancestor的后代或家族中。  
  > `component.isOffspringOf(ancestor)`  
  > `component.inFamilyOf(ancestor)`

* **clone**  
  Component类自身没有定义本方法，但是domcom内建的可以实例化的派生类大多定义了这个方法。扩充新的部件类时，如果该部件有可能需要复制自身产生一个copy部件，应该定义这个方法。clone方法可以复制一个component的拷贝。当部件需要用于多处，而直接引用可能引起Dom节点挂载位置冲突的时候，可以考虑使用这个方法。  
  > `component.clone()`

* **toString**  
  Component自身没有定义本方法，但是domcom内建的可以实例化的派生类大多定义了这个方法，主要作用是为了帮助调试。  
  > `component.toString indent:Int=0, addNewLine:Boolean`

***********************************************************

#### 部件辅助工具函数

#### toComponent函数
将任何项转化为部件。如果是部件，返回自身。如果是函数，返回文本部件，部件的文本域是该函数。如果是数组，返回列表部件。如果是promise，返回该promise的代理响应函数。如果是空值(null或undefined)，返回Nothing部件。其它情况返回文本部件。
  > `toComponent item:Any`

#### toComponentArray函数
  将任何项转化为部件数组。  
  > `toComponentArray item:Any`

#### isComponent函数
  判断任何项是否为部件。
  > `isComponent item:Any`

***********************************************************

#### 基础部件基类： BaseComponent

  基础部件具有直接管理Dom的方法，包括refreshDom, renderDom、removeDom、removeNode、attachParent等。这些方法作为框架内部实现的一部分，并非对外的接口，不需要在用户程序中使用。大多数基础部件都直接生成Dom节点，List部件则间接通过子部件生成Dom节点的数组，空的List部件(`children.length==0`)和Nothing节点不会生成实际的Dom节点，而是以空数组[]表示空节点。节点特性为this.node。Tag，Text，Comment部件的node特性是实际的Dom节点；Html部件的node特性是数组，包含一组实际的Dom节点；List的node特性是数组，包含实际的Dom节点或者是别的List节点的node。

##### 模块: Core/Base/BaseComponent

##### 直接父类：Component

##### 子类：List, Tag, Text, Html, Comment, Cdata，Nothing

##### 构造函数和实例化函数

  不要直接使用基础部件对象。

***********************************************************

##### ListMxin

##### 模块: Core/Base/ListMixin

  ListMixin不是一个部件，而是Mixin对象，用以扩充List部件和Tag部件的prototype。

  List部件和Tag部件都混入了ListMixin提供的动态管理子部件的方法。这组方法可以增减部件的children成员中包含的子部件。注意，这些方法（除了removeChild相关方法外）并不会立即影响Dom，而是先失效List或Tag部件，等到调用部件更新方法时才会实际刷新Dom。除了在定制、扩展部件的时候，程序绝大多数时候可能不需要使用这些方法。建议尽量不要使用这组方法修改部件结构。

* **insertChild, insertChildBefore, insertChildAfter, pushChild, unshiftChild**  
  向children的index位置插入一个子部件child：
  >  `component.indexChild index:Index, child:toComponent`
  
  以下方法都会调用insertChild。
  
  插入child至refChild之前：
  >  `component.insertChildBefore(child, refChild)
  
  插入child至refChild之后：  
  >  `component.insertChildAfter(child, refChild)
  
  从children后面压入一个子部件child：
  >  `component.pushChild child:toComponent`

  从children前面压入一个子部件child：
  >  `component.unshiftChild child:toComponent`

* **removeChild，shiftChild，popChild**  
  删除children中的子部件。
  >  `component.removeChild child:Component|Index`
  如果child是部件，则先从children中获取该部件的index。将children的index位置的部件删除。
  
  以下方法都会调用removeChild。
  
  删除第一个子部件。
  >  `component.shiftChild()`
  
  删除children中的最后子部件。
  >  `component.popChild()`
  
  上述三个方法都将返回被删除的部件。

* **replaceChild**  
  用newChild替换children中的oldChild。
  >  `component.replaceChild(oldChild, newChild)`

* **setChildren**  
  设置从children的index位置开始的一组位置的各个子部件分别为newChildren中对应的部件。
  >  `component.setChildren startIndex:Index, newChildren:[toComponent]`

* **setLength**  
  设置从children的长度为newLength，从newLength开始所在位置的子部件将被删除。如果newLength大于等于children的原长度，此方法没有作用。
  >  `component.setLength newLength:Int`

***********************************************************

#### 列表部件：List

##### 模块: Core/Base/List

##### 直接父类：BaseComponent，prototype混入ListMixn

##### 构造函数
  >  new List(children: [toComponent])

##### 实例化函数
  >  list children...: [toComponent]

##### 示例
	list \
	    label "user name: ",
	    text placeholder: "input here: ", value: username$

##### 相关实例化函数: every, each, funcEach
  every, each和funcEach都返回列表部件的实例。
  >  `every attrs, items:Array, options -> toComponent`
  >  `every attrs, items:Object, options -> toComponent`
  >  `each attrs, items:Array, options -> toComponent`
  >  `each attrs, items:Object, options -> toComponent`
  >  `funcEach attrs, Function|Reactive, options -> toComponent`

  options:  
  表项部件模板函数：  
  >  itemFn称为部件模板函数，返回部件，如果返回值不是部件，将被toComponent函数转化为部件。  
  >  itemFn:(item:Any, index:int, listComponent:List)，对应于数组列表。  
  >  itemFn:(value, key, index:int, listComponent:List) ，对应于对象。
    
  可选的分隔符部件模板函数：  
  >  separatorFn: (index, item, listComponent:List) ，对应于数组列表。  
  > separatorFn: (index, value, key, listComponent:List) ，对应于对象。
  
  其它选项：
  > updateSuccChild: Boolean, 当列表部件与位置相关时，用该选项指示当插入、删除项目时更新所有后续部件。
  >  updateSuccIndex: Boolean, 当列表部件与位置相关时，用该选项指示当插入、删除项目时更新所有后续部件的索引。

#### 标签部件：Tag

代理和管理标签元素的部件类型，生成Dom Element节点。

##### 模块: Core/Base/Tag

##### 直接父类：BaseComponent，prototype混入ListMixn

##### 构造函数
  >  new Tag(tagName, attrs, children)

##### 实例化函数
  >  `tag tagName:TagName，[attrs:Attrs][, children:[toComponent]...]`
  >  `nstag tagName:TagName，namespace, [attrs:Attrs][, children:[toComponent]...]`
  tagName是任何可以作为html标签名的字符串。如果tagName是null，则使用attrs.tagName，如果attrs.tagName不存在，默认为div。

  >  `dcTagName([attrs:Attrs] [, children:[toComponent]...])`   
  dcTagName是可以实例化Tag部件的函数名，必须从dc名字空间引入之后方可使用，例如div, p, span, input, textarea, select等。

  >  `inputType([attrs:Attrs][, value:domField])`  
  inputType是<intput>标签允许的类型值，包括text, number, checkbox, radio, email, date, tel等。  
  关于dcTagName和inputType这两项内容的完整列表请参阅src/core/tag.coffee。
  
  attrs:Attrs是描述标签部件节点特性的Object。其中可包括部件的节点特性，属性，style，dom events等各方面的全方位描述。 虽然Tag部件也提供了一组类似于jQuery的API，但是更加鼓励通过attrs完整清晰地声明Tag部件。attrs:Attrs类似如下形式：
    
      { prop: value, # 节点特性  
        attr_name: value, # 节点属性  
        style: {prop: value}, # css Style  
        onEventName: Function, # 事件响应函数  
        $directive: [args...], # 指令  
        ... # 其它内容，比如基于Tag部件扩展的派生类可以向这里增添某些数据、选项
      }
  
  children成员包含了Tag部件的子部件。虽然也可以借助ListMixin提供的方法管理子部件，但是更加鼓励通过children直接完整清晰地列举子部件。

##### 示例

    span "hello"
    li -> x
	text({$model: model}),
	select $options:[['domcom', 'angular', 'react']]
	input {type:"text", value: who$, onchange: -> alert "hello, "+who$()}

##### Tag部件方法

  Tag部件混入了ListMixin的所有方法，可以借助这些方法来管理其子部件，即children成员数组中的部件。

  Tag部件对应于Dom的Element类型节点，可以管理对应Dom节点的特性，包括css Style，Dom事件等。Tag部件所定义的Dom节点特性是响应式的，即这些值如果是函数，则成为响应函数。只有响应函数的计算失效时，Tag部件才需要更新这些特性。而更新特性时，会将计算所得新值与缓存值进行比较，只有两者不相同才需要实际修改Dom节点特性，执行Dom操作以刷新Dom。Dom事件是发生在Dom节点上的事件，不同于Domcom部件事件，这些事件包括onclick，onchange等。对于Dom事件处理函数，domcom主要通过构造Tag部件时利用attrs参数进行声明，也可以通过Tag.bind，Tag.unbind来管理。$bind, $model指令，Component.renderWhen, dc.renderWhen等函数也可以添加事件处理函数。

  Tag部件的不少API从形式上借鉴了jQuery的设计，这便于记忆和使用，减少学习时间。但是必须注意到它们本质上具有不同的语义。区别是多方面的。第一：它们都针对部件而非dom。第二、它们描述部件的长期特性，而非一次性的执行过程。第三、这种描述并不立即生效，不直接操作Dom，需要等到本部件或上层部件调用render方法后才影响到Dom；第四：prop，attr，css，addClass中的特性值都可以是函数。如果是函数，domcom不是象jQuery那样在调用这些方法时立即对函数求值，而是将函数作为响应函数赋值给响应特性，在以后每次的render中都将用该响应函数来获取对应特性的值。第五、调用render时如果新特性和缓存特性有相等的值，不会导致Dom操作。因为以上这些原因，Domcom可以集中处理dom操作，提高应用的性能。

  Tag.bind, Tag.unbind和上述描述有所不同。这两个方法将直接操作Dom节点事件处理函数中用到的Dom部件事件处理函数数组，从而也将直接影响Dom节点的事件行为，如果Dom部件事件处理函数数组中的事件函数增加第一个处理函数数或者全都被删除，则会向Dom节点赋值或解除Dom节点的事件处理函数。这种机制是不会影响性能的。因为Dom节点事件处理函数的赋值或解除赋值是不会引起Dom刷新或重新布局的。更多细节请请参看这两个方法以及core/property/events.coffee中的exports.domEventHandler的实现代码。

* prop
  设置与dom节点特性相关的部件特性。
  >  `Tag.prop prop:PropName|PropSet, value：domField`  
   prop: 如果参数个数是1，且prop为特性名，此时函数返回部件对应的node的该特性名的值，若prop为包含特性与值的集合的object，函数将扩展部件的特性集，如果参数个数为2， 则本方法将设置部件的prop特性为（tag.props[prop]=value）。  
   value: undefined, 或者被设置的特性的值，可以是函数。如果是函数，部件对应的dom node的prop特性（tag.node[prop])将在每次更新的时候与该函数的值动态保持一致。
   
* **attr**
  设置与dom节点属性相关的部件特性
  >  `Tag.attr prop:PropName|PropSet, value：domField`  
  与Tag.prop类似，不同之处是将调用原生dom API `setAttribute`设置节点属性。

* **css**
  >  `Tag.css prop:PropName|PropSet, value：domField`      
  与Tag.prop类似，但是将处理部件节点的style特性。

* **addClass, removeClass**
  设置与dom节点的className相关的部件className特性。
  
  增加className描述。  
  >  `Tag.addClass items：[ClassFn]...`
  
  删除类名描述。  
  >  `Tag.removeClass classes:[ClassName]...`

* **show, hide**  
  >  `Tag.show [display]`  
  >  `Tag.hide()`

* bind, unbind  
  >  `Tag.bind eventName, handlers:DomEventHandler`
  >  `Tag.unbind eventName, handler`  
  绑定或移除Tag部件的eventName所指Dom事件使用的Dom事件处理函数。Domcom将事件处理函数收集到一个数组，并产生一个真正的事件处理函数，将此函数设置到Dom节点的EventName特性。  
  handler将这样被调用：handler.call(component, event, node), 其中，本Tag部件成为handler的this，event是实际发生的Dom事件，node是本Tag部件的dom节点。当所有事件处理函数执行完毕后，将执行event.preventDefault()和event.stopPropagation()，除非event.executeDefault或者event.continuePropagation各自被显式地设置为真。
  
* **delegate, delegateToHolder, delegateToComponent**  
  设置处理事件的代理方法。这一组方法在**core/property/delegate-events**模块中实现。
  
  events由指定的delegationHandler代理，如果delegationHandler不是函数，，则由该部件上的`prefix_xxx`方法代理（prefix即delegationHandler，默认为`do_xxx`）。
  > Tag.delegate(events, delegationHandler)
  
  events由指定的delegationHandler代理，如果delegationHandler不是函数，，则由该部件上的`prefix_xxx`方法代理（默认为`do_xxx`）。
  > Tag.delegateToHolder(events, prefix)

  events由指定部件上的prefix_xxx方法代理（默认为`do_xxx`）。
  > Tag.delegateToComponent(events, component, prefix)

***********************************************************

### Html部件: Html

##### 模块: Core/Base/Html

##### 直接基类：Tag

##### 构造函数

  >  `new Html htmlText:domField[, transform:(String) -> String]`

##### 实例化函数

  >  `html [attrs:Attrs, ]htmlText:domField[, transform:(String) -> String]`

##### 示例

	html "<div> This is domcom </div> <div> That is angular </div>"
	html someHtmlTextString, escapeHtml
	
##### 说明
  Html部件不能使用任何从ListMixin继承的方法。但是可以象Text部件一样使用setText方法内部文本。
	
##### 警示

   使用本部件须注意安全风险。请使用适当的转义方法对html文本进行处理，以避免被注入不安全的标签或脚本。转义方法可以作为transform参数。

***********************************************************

### 文本部件：Text

##### 模块: Core/Base/Text

##### 直接基类：BaseComponent

##### 子类：Comment, Cdata

##### 构造函数

  >  `new Text text:domField`

##### 实例化函数

  >  `txt [attrs:Attrs, ]string:domField`
  
##### 方法
  * **setText**  
  设置文本内容。    
  >  `Text.setText(text)`
  

##### 说明

  任何需要部件的位置，如果传入的不是部件，也不是null或者undefined，都会被转为Text部件，如示例中的(1)。

##### 示例:

    div 1
    p "hello", who$
    li someVariable
    span -> someVariable  # （1）


***********************************************************

### 注释部件: Comment
##### 模块: Core/Base/Comment
##### 直接基类：Text
##### 构造函数
  > new Comment text:domField
##### 实例化函数
  > comment [attrs:Attrs, ]text:domField
##### 示例
	comment "this is a comment"
***********************************************************

### 注释部件: Cdata
##### 模块: Core/Base/Cdata
##### 直接基类：Text
##### 构造函数
  > new Cdata text:domField
##### 实例化函数
  > cdata [attrs:Attrs, ]text:domField
##### 说明
Html文档不支持CDATA，但是Xhtml和xml文档可以支持。
***********************************************************

### 空部件: Nothing
##### 模块: Core/Base/Nothing
##### 直接基类：BaseComponent
##### 构造函数
  > new Nothing()  
##### 实例化函数
  > nothing()  
  空部件实例化不提供attrs:Attrs参数。
##### 说明
  当toComponent(item)中item是null或undefined时，将创建空部件。    
  Nothing部件真正不对应任何Dom节点，其node成员是占位性质的空数组[]。当变换部件的内容部件变换到Nothing部件时，原先的部件将从Dom层次中移除。
***********************************************************

#### 变换部件基类： TransformComponent
  变换部件具有getContentComponent方法。重绘Dom前变换部件先调用getContentComponent方法，先获取内容部件后再决定重绘过程。变换部件通过内容部件链连接到基础部件，也会对应到Dom节点或空节点。节点特性为this.node。
##### 模块: Core/Base/TransformComponent
##### 直接父类：Component
##### 子类：If, Case, Cond, Pick，Func, Each, Route, Defer
##### 构造函数和实例化函数
  不要直接使用变换部件对象。
  
***********************************************************

### If部件：If
  domcom中的if语句。test可以是响应函数。
##### 直接基类：TransformComponent
##### 模块: Core/Base/If
##### 构造函数
  >  `new If test:Value|Reactive, then_:toComponent[, else_:toComponent], merge, recursive`
##### 实例化函数
  >  `if_ [attrs:Attrs, ]test:Value|Reactive, then_:toComponent[, else_:toComponent], merge, recursive`
  >  `forceIf [attrs:Attrs, ]test:Value|Reactive, then_:toComponent[, else_:toComponent]`
  >  `mergeIf [attrs:Attrs, ]test:Value|Reactive, then_:toComponent[, else_:toComponent], recursive`
  >  `recursiveIf [attrs:Attrs, ]test:Value|Reactive, then_:toComponent[, else_:toComponent]`  
  else_是可以选的，如果else_参数没提供，则If部件的else_特性是Nothing部件。
##### 示例
	x = see 0, parseFloat
	comp = list \
        text({onchange: -> comp.render()}, x)
        if_(x, div('It is not 0.'), div('It is 0 or NaN.')))
***********************************************************

### Case部件：Case
  domcom中的switch case语句。test可以是响应函数。
##### 模块: Core/Base/Case
##### 直接基类：TransformComponent
##### 构造函数
  >  `new Case test:Value|Reactive, caseMap:Hash[, else_:toComponent]`
##### 实例化函数
  >  `case_ [attrs:Attrs, ]test:Value|Reactive, caseMap:Hash[, else_:toComponent]`
  >  `forceCase [attrs:Attrs, ]test:Value|Reactive, caseMap:Hash[, else_:toComponent]`
##### 示例
    case_(x, {
        A: "Angular",
        B: "BackBone",
        D: "Domcom",
        E: "Ember",
        R: "React"
    },  "some other")
***********************************************************

### Pick部件：Pick
  从host对象取得field字段作为部件内容。
##### 模块: Core/Base/Pick
##### 直接基类：TransformComponent
##### 构造函数
  >  `new Pick test:Object, field:String[, intialContent:toComponent]`
##### 实例化函数
  pick不能接受attrs作为封包div的内容。因为host必须是对象。  
  >  `pick test:Object, field:String[, intialContent:toComponent]`
##### 示例
    pick(host={}, x, 1)
***********************************************************

### Cond部件
多测试部件。类似于一组 if/else if/.../else。
##### 模块: Core/Base/Cond
##### 构造函数
  >  `new Cond testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]`
##### 实例化函数
  >  `Cond attrs:Attrs, testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]`
***********************************************************

##### Func函数部件
##### 模块: Core/Base/Func
##### 构造函数
  >  `new Func func:Function|Reactive`
##### 实例化函数
  >  `func [attrs:Attrs, ]func:Function|Reactive`
##### 示例
	x = 0
	comp = null
	indexInput = number({onchange: -> x = parseInt(@value); comp.render()})
	comp = list(indexInput, func(-> if x>=0 and x<=3 then div x))
***********************************************************

#### Route部件
##### 模块: Core/Base/route
##### 构造函数
  >  `new Route routeList, otherwise, baseIndex`  
  基本没有必要直接使用Route构造函数，使用route函数总是更方便。route附带有to方法，而Route则没有。
##### 实例化函数
  >  `route routeList:[RoutePattern, RouteHandler...], [otherwise：toComponent][, baseIndex]` 
  其中，RoutePattern是路由模式字符串或者路由模式字符串及测试函数，路由模式字符串中可以包括包括查询字段名(冒号:引导的标识符)及正则表达式，通配符(`*`或`**`)及普通字符串。  
  RouteHandler是如下类型的函数：  
  >  `(match:RouteMatchResult, childRoute: RouteInstantiateFunction) -> toComponent`  
  RouteMatchResult的类型如下：
    
    { 
      items: 匹配的查询字段结果。
      basePath: 传入路由部件的基路径
      segment: [String]：与模式相匹配的字符段
      leftPath: String： 与模式匹配过后剩余的字符段
      childBase: Int：子路由部件的字符段基索引
    }
  
  route和childRoute带有to方法，可用于设置`location.href`或者`window.history`。
  >  `route.to path:RelativePath|AbsolutePath`
  >  `childRoute.to path:RelativePath|AbsolutePath`
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
  > new Defer
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]
##### 实例化函数
  > defer attrs:Attrs,
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]
***********************************************************

### 响应函数
  响应函数是Domcom框架区别于其它框架的关键要素。Domcom中一切连接数据的成分，包括Dom特性，If,Case, Cond部件的测试条件，Func部件的func特性，funcEach的itemsFunc等等，都可以是响应函数。响应函数具有invalidateCallbacks，它包含该响应函数的失效回调函数的列表；还具有invalidate和onInvalidate两个方法，其中onInvalidate用于注册失效回调函数，invalidate用于执行onInvalidate注册的所有失效回调函数。  
  响应函数通过响应函数生成器来产生。  
  domcom与响应函数相关的方法都定义在domcom/srs/flow/文件夹，其中所有方法名都直接定义在dc.flow名字空间，可以用flow.someName或者{someName,...} = dc.flow的方式引用。为了方便flow/index模块下的常用方法名也导入到了dc名字空间，因此也可以通过dc.someName或{someName,...} = dc的方式引用。

#### flow/index模块
##### react
*  `react(fn)`

##### reactive.invalidate
*  `reactive.invalidate()`

##### reactive.onInvalidate
*  `reactive.onInvalidate(fn)`

##### renew
*  `renew(fn)`

##### flow
*  `flow(r1, r2, ..., fn)`
  
##### pipe
*  `flow.pipe(r1, r2, ..., fn)`
 
##### see
*  `see value: Any[, Transform:(Value) -> Any]`
* 示例:
     
         username$ = see "Tom"
         num1$ = see 1,
         num2$ = see 2

##### seeN
*  `seeN(x, y, z, ...)`

##### bind
* 示例: 
	  
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

  根据模型数据生成一组单向绑定(flow.bind)和双向绑定(flow.duplex),其中单向绑定的特性名后缀为"_", 双向绑定的的特性名后缀为"$"。

  > bindings model:Object[, debugName:String]

  debugName参数可选，为生成的响应函数的toString所用。

  * 示例：

     m = {a:1, b: 2}
     bindings$ = bindings m

     {a_, b$} = m

##### 一元运算
  neg， not， bitnot， reciprocal，abs， floor，ceil， round

##### 二元运算
  and, or, add， sub，mul，div，min

##### 条件判断：
  if_

******************************************************************

### domcom辅助工具

#### DomNode类

#### dc直属工具函数

##### 模块： domcom/src/dc

##### 方法

* dc

  > `dc element: DomSelector|Node|[Node]|NodeList, options={}`

  从Dom节点或选择器所查询到的Dom节点产生DomNode类的实例

  dc(document), dc("#demo"), dc(".some-class")
   

* dc.directives

  注册一条或多条指令。关于指令以及此方法的详细说明请参考后面“指令”一节的专门描述。

* dc.onReady

  > `dc.onReady fn:Callback`

  注册回调函数，当dc.onReady被调用，这些回调将被执行。


* dc.ready
  
  执行dc.onReady注册的所有回调函数。

  > `dc.ready()`


* dc.onRender

  注册应该在dc.render中执行的回调函数。


  > `dc.onRender callback:Callback`

* dc.offRender

  移除已经注册的应该在dc.render中执行的回调函数。

  > `dc.offRender callback:Callback`


* dc.render

  执行经由dc.onRender注册的所有回调函数。

  > `dc.render()`
  

* dc.renderLoop

  通过requestAnimFrame（或者其腻子函数）循环执行`dc.render()`。
  
  > `dc.renderLoop()`
  
  如下代码是dc.renderLoop的实现，位于domcom/src/dc.coffee：

	dc.renderLoop = renderLoop = ->
	  requestAnimFrame renderLoop
	  render()
	  return

* dc.renderWhen


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

  > classFn： items:[classFnType]...

  classFnType是个灵活的类型，可以方便地用字符串、数组、Object定义className。当用{name:value}定义class的取舍时，value可以是响应函数。
    
#### styleFrom

  > styleFrom value

    value: 形如"stylePropName:value; ..."的style字符串, 
      或: 形如"stylePropName:value"的项的数组, 可包含空白字符, 
      或: 形如[stylePropName, value]的项的数组

##### extendAttrs

  > extendAttrs toAttrs:Attrs|Null, fromAttrs:Attrs|Null

  > overAttrs fromAttrs:Attrs|Null, toAttrs:Attrs|Null

    toAttrs: 待扩展的属性集, 如果是null或undefined, 将创建一个新的空对象

    fromAttrs: 用来覆盖或增强属性集特性的对象

##### extendEventValue

  > extendEventValue props, prop, value, before

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

  > `isArray item:Any`

* 参考实现：

  当前的实现代码如下，仅作参考，有可能在后续版本进行修改。代码位于domcom/src/util.coffee：

	exports.isArray = (item) -> Object.prototype.toString.call(item) == '[object Array]'


##### cloneObject

  复制对象参数。

* 类型定义

  > `cloneObject obj:Object`

##### pairListDict

  将列表数组中的项成对地复制成字典类型(或者叫hash，map， object）。

* 类型定义

  > `pairListDict keyValuePairs[key, value, ...]...`

##### newLine

  返回一个带起始新行以及指定缩进的字符串。

* 类型定义

  > `newLine str:String, indent:Int, addNewLine:Boolean`

##### isEven

  判断某数是否是偶数。

* 类型定义

  > `isEven n:Int`

##### intersect

  求两个集合的交集。

* 类型定义

  > `intersect maps:[Set]`

##### substractSet

  求两个集合的差集。

* 类型定义

  > `substractSet whole：Set, part:Set`

**********************************************

#### dom-util工具函数

##### 模块： domcom/dom-util

##### domField

  如果value是undefind或null，返回""；如果是普通函数，返回强制响应函数; 如果是响应函数，直接返回该项；如果是Promise(有then方法和catch方法), 返回该promise的响应函数代理。其它情况返回该项自身(因为domField一般用作Dom特性，因此后续一般会因Javascript语言的类型转换机制而调用该项的toString转换成字符串）。

  domField通常由domcom自动调用。用户程序一般无需直接使用该函数。

* 类型定义：
  
  > `domField item:domField`

##### domValue

  如果value是undefind或null，返回""；如果是函数fn, 则返回fn()（如果函数值是是undefind或null，返回"")。其它情况返回该项自身(因为domValue一般用作Dom特性，因此后续一般会因Javascript语言的类型转换机制而调用该项的toString转换成字符串）。

  domValue通常由domcom自动调用。用户程序一般无需直接使用该函数。

* 类型定义：

  > `domValue item:domField`

##### requestAnimationFrame (即dc.raf)

  window.requestAnimationFrame或其腻子函数，被dc.renderLoop使用。

* 类型定义：
  
  > `requestAnimationFrame callback:Callback` 

*********************************************************
 
#### 模块：domcom/extend 

##### extend函数

将第二个开始的对象类型参数(或者叫做hasn, map)的特性补充到底一个对象类型参数。采用https://github.com/justmoon/node-extend。

* 模块： domcom/src/extend

* 函数原型

 > ` extend toObject:Object, fromObjects:[Object]:...`
  
* 示例
   
  如下代码位于domcom/src/index.coffee：
  
	extend dc,
	
	  require './config'
	
	  # utilities
	  require './flow/index'
	  require './flow/watch-list'
	  require './dom-util'
	  require './util'

### Domcom指令

 domcom通过使用指令可以在某些情况下让代码更为简明，更为符合人的书写和阅读习惯。domcom的指令设计借鉴了angular的指令，但是，在domcom中指令只是作为语法糖存在，并不具有独立的不可替代的作用。任何时候都可以用普通的函数代替指令来实现完全相同的需求，区别只存在于代码格式方面。

 指令只允许用在Tag部件上。指令的使用方法是：

   tag { ..., $directiveName: directiveArguments, ...}, ...

 在执行Tag部件的初始化期间处理Tag的属性集的时候，如果遇到以"$"字符开头的属性，domcom认为这是一个指令，会查找预先注册的指令集，如果找到该指令的指令处理函数生成器，则以directiveArguments作为参数调用该生成器，然后用该调用返回的指令处理函数来处理该部件。如果没有注册该指令，domcom将认为是一个错误。

#### 注册指令

  domcom中使用任何指令前必须显式地注册。注册方法有两种。可以批量注册

  >  `dc.directives {$directiveName:generator:DirectiveHandlerGenerator ... }`
  
  或者注册单个指令

  >  `dc.directives $directiveName:String, generator:DirectiveHandlerGenerator`
  
  其中，DirectiveHandlerGenerator表示指令处理函数生成器，是个返回指令处理函数的函数。其类型如下
  
  >  `DirectiveHandlerGenerator: (...) -> DirectiveHandler`
  
  DirectiveHandler表示指令处理函数，它接受部件参数，对该部件进行处理，并返回该部件，其类型如下：

  >  `DirectiveHandler: (component) -> component` 

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

UPDATE：已经从domcom中移出，放置到独立的dc-controls包。

##### $options指令

* 模块：src/directives/options

* 说明：只能配合`<select>`标签部件使用

* 用法：select $options: [items]

##### $blink指令

UPDATE：已经从domcom中移出，放置到独立的dc-controls包。

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

UPDATE：已经从domcom中移出，放置到独立的dc-controls包。
