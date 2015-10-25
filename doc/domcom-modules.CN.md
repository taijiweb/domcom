### 模块

#### src/core/
##### BaseComponent
 List, Tag, Text, Comment, Html, DomNode, DomNodeList

* new List(children, options)

* new Tag(tagName, attrs, children, options)

* new Text(text, options)

* new Comment(text, options)

* new Html(text, options)

##### TransformComponent
If, Case, Func, Each

* new If(test, then_, else_, options)

* new Case(test, map, options)

* new Func(fn, options)

* new Each(items, ((item, index, list, component) -> ...), options)

    todo: 支持将object作为items参数，使用如下的标签：

    new Each(obj, ((value, key, list, component) -> ...), options)

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
##### tag(tagName, attrs, children...)
例：tag('a', {href:'http://www.google.com'}), tag('img', {src:'path/to/pic.png'})

##### tags
a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl
dt em fieldset form h1 h2 h3 h4 h5 h6 head html hr i img input ins kbd label legend li link map meta noscript object
ol optgroup option p param pre q samp script select small span strong style sub sup
table tbody td textarea tfoot th thead title tr tt ul var header footer section

例：div({style:{display:"block"}}, h1('a heading'), ul(li(1), li(->x)))

上例等同于tag('div', {style:{display:"block"}}, tag('h1', {}, 'a heading'), ul(li(1), li(->x)))

##### input tags
* input(type, attrs, value)

    例：input('text', attrs, value)

    上例等同于 tag('input', {type: type, value: value, ...attrs})

* shortcuts

    text, textarea, checkbox, radio, date, email, number

    例：text(attrs, value) ，等同于input('text', attrs, value)

   注意，text(x) 等同于new Tag('input', {type:"text", value:x})；它不同于上文中的txt，txt(x)等同于new Text(x)
