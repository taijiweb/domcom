# Domcom API类型说明

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

* item:Type1|Type2:    代表item:可以是Type1或者Type2的值。

* item:Value|Reactive：    item可以是任何值，也可以是响应函数，如果item是普通函数，会被转换为强制响应函数。

* attrs:Attrs:    代表attrs可以作为Tag部件的attrs属性。core/util.coffee中，isAttrs(attrs)应该为true

* item：Index:    代表item是数组的下标索引。该数组一般是相关函数的某个参数或宿主对象的某个字段。

* item：Boolean:  代表item是布尔类型。

* item：Int: 代表item是整数类型

* item：String:    代表item是字符串。

* item：Promise:    代表item是Promise类型，应该带有then方法和catch方法。

* item:TagName:    代表item是可以作为Html标签名使用的合适的字符串，如div, custom-tag等等。

* item:PropName:    代表item是合适的Node特性名或者Node的Style中的特性名。根据不同的方法，使用这两者其中之一。

* item:PropSet:    代表item是从PropName到特性值的Hash类型。其中特性值是domField类型。

* item:ClassFn:    代表item是className(或class)特性的值或值列表，该值会被classFn作为参数，合并到一起作为className的特性。
