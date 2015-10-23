## domcom API
* `{...} = window.dc`
* `{...} = dc = require('domcom')`

### 模块

#### src/core/
##### BaseComponent
 List, Tag, Text, Comment, Html, DomNode, DomNodeList

* `new List(children, options)`

* `new Tag(tagName, attrs, children, options)`

* `new Text(text, options)`

* `new Comment(text, options)`

* `new Html(text, options)`

##### TransformComponent
If, Case, Func, Each

* `new If(test, then_, else_, options)`

* `new Case(test, map, options)`

* `new Func(fn, options)`

* `new Each(items, ((item, index, list, component) -> ...), options)`

    todo: 支持将object作为items参数，使用如下的标签：

    `new Each(obj, ((value, key, list, component) -> ...), options)`

#### src/core/instantiate.coffee
 tag, txt, comment, if_, case_, func, list, each

 tag(tagName, attrs, children...)

 txt(attrs, text, options)

 txt(text, options)

 comment(text, options)

 if_(attrs, test, then_, else_, options)

 if_(test, then_, else_, options)

 case_(attrs, map, else_, options)

 case_(map, else_, options)

 list(attrs, children...)

 list(children...)

 each(attrs, items, ((item, index, items, component) -> ...), options)

 each(items, ((item, index, items, component) -> ...), options)


#### src/core/tag.coffee
##### `tag(tagName, attrs, children...)`
例：`tag('a', {href:'http://www.google.com'})`, `tag('img', {src:'path/to/pic.png'})`

##### tags
a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl
dt em fieldset form h1 h2 h3 h4 h5 h6 head html hr i img input ins kbd label legend li link map meta noscript object
ol optgroup option p param pre q samp script select small span strong style sub sup
table tbody td textarea tfoot th thead title tr tt ul var header footer section

例：`div({style:{display:"block"}}, h1('a heading'), ul(li(1), li(->x)))`

上例等同于`tag('div', {style:{display:"block"}}, tag('h1', {}, 'a heading'), ul(li(1), li(->x)))`

##### input tags
* input(type, attrs, value)

    例：`input('text', attrs, value)`

    上例等同于 `tag('input', {type: type, value: value, ...attrs})`

* shortcuts

    text, textarea, checkbox, radio, date, email, number

    例：`text(attrs, value)` ，等同于`input('text', attrs, value)`

   注意，`text(x)` 等同于`new Tag('input', {type:"text", value:x})`；它不同于上文中的`txt`，`txt(x)`等同于`new Text(x)`

#### src/core/property.coffee
* `extendAttrs(attrs, obj)`

    扩展部件的属性集对象

    `attrs`: 待扩展的属性集, 如果是null或undefined, 将创建一个新的空对象

    `obj`: 用来覆盖或增强属性集特性的对象

* `extendEventValue(props, prop, value, before)`

    `props`: 部件的events特性

    `prop`: 事件名, 如`"click"`, `"onclick"`等等

    `value`: 事件处理函数或者处理函数的数组

    `before`: 如果是javascript任何可以为真的值则value将被添加或连接到原事件处理器数组之前, 否则将被添加或连接到之前。默认为假。

* `classFn(items...)`

    递归的说，`items`中的项可以是className的川, 或者是classFn产生的函数, 或者是项的集合

* `styleFrom(value)`

    `value`: 形如"stylePropName:value; ..."的style字符串, 或者形如"stylePropName:value"的项的数组, 可包含空白字符, 或则形如[stylePropName, value]的项的数组


辅助函数模块

    #### 指令
        指令是个函数，该函数以部件做参数，返回新部件。

        指令只可以用于Tag部件

        用法：`someTag(/*attrs=*/{..., directives:directive, ...}, children...)`

    #### 指令生成器

       指令生成器是个返回函数的函数，返回的函数可以被用作指令。

        用法：`someTag(/*attrs=*/{..., directives:directiveGenerator(...),  ...}, children...)`

### src/core/directives/

一些内建的指令

##### domcom内建指令生成器模块
model.coffee, bind.coffee, show-hide.coffee, blink.coffee, splitter.coffee, options.coffee

###### 内建指令生成器
model, bind, show, hide, blink, splitter, options

* model(m)
* bind(m)
* show(test, display)
* hide(test, display)
* blink(delay)
* splitter(direction)
* options(items)
  只能配合"select"标签部件使用

  用法：`select({..., directives: options(items...)}, ...)`


#### 示例

    {input, model, duplex} = require('domcom')
    obj = {a:1}
    a = duplex(obj, 'a')
    comp = text({type:'text', directives:model(a)})

#### src/core/builtins/
 combo, comboEdit, dialog, arrow, accordion

### 部件类
##### Component
* Component.mount

     someComponent.mount(mountNode, beforeNode)

* Component.unmount

    someComponent.unmount()

* Component.create

    someComponent.create()

* Component.render

    someComponent.render()

* Compnent.remove

    someComponent.remove()

* Component.update

    `someComponent.update()`

* Component.beforeMount

    `someComponent.beforeMount(fns...)`

* Component.afterMount

    someComponent.beforeMount(fns...)

* Component.unbindBeforeMount

    `someComponent.unbindBeforeMount(fns...)`

* Component.unbindAfterUnmount

    `someComponent.unbindAfterUnmount(fns...)`

* setOptions

    `someComponent.setOptions(options)`

##### Tag
* Tag.bind

    `someTag.bind(eventName, handlers...)`

* Tag.unbind

    `someTag.unbind(eventName, handlers...)`

* Tag.prop

    `someTag.prop(prop, value)`

    `prop`: 如果参数个数是1，则`prop`为特性名，此时函数返回部件对应的node的该特性名的值，或者为包含特性与值的集合的object，函数将扩展部件的特性集，如果参数个数为2， 则本方法将设置部件的`prop`特性为（`value``someTag.props[prop]=value`）。

    `value`: undefined,或者被设置的特性的值，可以是函数。如果是函数，部件对应的dom node的`prop`特性（`someTag.node[prop]`)将在每次更新的时候与该函数的值动态保持一致。

* Tag.addClass

    `someTag.addClass(items...)`

* Tag.removeClass

    `someTag.removeClass(classes...)`


* Tag.css

    `someTag.css(prop, value)`
    如果参数个数是1，则`prop`为特性名，此时本方法返回部件的style中`prop`的值（`someTag.style[prop]`），或者为包含特性与值的集合的object，本方法将扩展部件的style的特性集；如果参数个数为2， 则本方法将设置部件的style的`prop`特性（`someTag.style[prop]=value`）。
    `prop`: 特性名，或者包含特性与值的集合的object，函数将扩展部件的style的特性集
    `value`: undefined，或者为部件的style的`prop`特性的值。`value`可以是函数。如果是函数，部件对应的dom node的style的`prop`特性（`someTag.node.style[prop]`)将在每次更新的时候与该函数的值动态保持一致。

* Tag.show

    `someTag.show(display)`


* Tag.hide

    `someTag.hide()`

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

