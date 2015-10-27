# domcom速查表

##下载

	npm install --save domcom
	
	git clone https://www.github.com/taijiweb/domcom

## 向页面添加domcom

* 开发版本: `<script src="path/to/domcom.js"/>`或者`<script src="path/to/domcom-full.js"/>` 

* 产品版本: `<script src="path/to/domcom.min.js"/>`或者`<script src="path/to/domcom-full.min.js"/>` 

## 使用dc
第一推荐Coffee-script，第二推荐babel以支持解构赋值。

使用原生ES5也是可行的，但是可读性稍差，代码稍长。

	{see, flow, 
	div, 
	if_, list, each_
	} = dc

## 响应函数和响应函数生成器

`r$ = see value, transform`
`num1$ = see 1`,
`num2$ = see 2`
`sum$ = flow.add num1$, num2$`
`username$ = see "Tom"`
`score = { name: "Tom", points:95}` 
`name$ = bind(scores, "name")`
`points$ = duplex(scores, "points")`
  
## 构造部件

### 列表 

	list children...	
	list \
	    label "user name: ",
	    text placeholder: "input here: ", value: username$
	
    every arrayItems, (item, index, arrayItems) ->
    all objectItems, (value, key, index:int, objectItems!) ->

    new List(children)

### 标签: 

* 函数原型

	----------anyTagName(attrs, children...)`
    `inputType attrs:Attrs, value:domValue`
	`tag(tagName:TagName, children...)`
	`tag(tagName, attrs:Attrs, children...)` 
	`new Tag(tagName, attrs, children)`

  上文中anyTagName或tagName是html页面中可以出现的标签名，inputType是`<intput>`标签允许的类型值，这两项内容欲知完整列表参阅src/core/tag.coffee。 

* 示例

    span "hello"
    li -> x

	`text({$model: model})`, `select $options:[['domcom', 'angular', 'react']]`

	`input {type:"text", value: who$, onchange: -> alert "hello, "+who$()}` 


### 正文节点

  `txt attrs:Attrs, string:DomValue`

  任何需要部件的位置，如果传入的不是部件，也不是null或者undefined，都会被转为Text部件。

  例如： `div 1;` `p "hello", who$;` `li someVariable;` `span -> someVariable`  

### Html部件
* 函数原型 

	`html attrs:Attrs, htmlText:domValue[, transform:(String) -> String]` 
	`new Html htmlText:domValue[, transform:(String) -> String]` 

* 示例

	`html "<div> This is domcom </div> <div> That is angular </div>"`
	`html someHtmlTextString, escapeHtml` 

### 注释节点
* 函数原型
 
	`comment text:domValue` 
	`new Comment text:domValue` 

* 示例

	`comment "this is a comment"`

* If分支
* 函数原型 

	`if_ attrs:Attrs, test:ValueReactive, then_:toComponent[, else_:toComponent]` 
	`new If test:ValueReactive, then_:toComponent[, else_:toComponent]` 

* 示例


* Case多分支
* 函数原型 

	`case_ attrs:Attrs, test:ValueReactive, caseMap:Hash[, else_:toComponent]` 
	`new Case test:ValueReactive, caseMap:Hash[, else_:toComponent]` 

* 示例


* Cond多测试
* 函数原型 

	`Cond attrs:Attrs, testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]` 
	`new Cond testComponentPairList:[Reactive, toComponent, ...][, else_:toComponent]` 

* 示例

* Func函数部件
* 函数原型 

	`func attrs:Attrs, func:Reactive` 
	`new Func func:Reactive` 

* 示例

* Each部件
* 函数原型 

	`each attrs:Attrs, items:[Any]|Reactive->[Any][,options:Options]` 
	`new Each attrs:Attrs, items:[Any]|Reactive->[Any][,options:Options]` 

* 示例

* Route部件
* 函数原型 

	`if_ attrs:Attrs, test:ValueReactive[, then_:toComponent[, else:toComponent]]` 
	`new Html htmlText:domValue[, transform:(String) -> String]` 

* 示例

	`html "<div> This is domcom </div> <div> That is angular </div>"`
	`html someHtmlTextString, escapeHtml` 

* Defer部件
* 函数原型 

	`defer attrs:Attrs, 
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]` 

	 
	`new Defer
        promise:Promise
        fulfill:((value, promise, component) -> toComponent)
        [reject: ((value, promise, component) -> toComponent)
        [init:toComponent]]` 


* 示例
