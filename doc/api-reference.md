## document API reference

## introduction to this document

### notations and conventions

#### function prototype notation

	functionName(arg1[: Type1], arg2[: Type2], ...)

	functionName()

#### method prototype notation

	object.methodName(arg1[: Type1], arg2[: Type2], ...)

	object.methodName()

The type decription is just an informal specification, to help us understand the documentation and write code. It should not be used as a precise formalism. Depending on the context, the type description may be omitted. 

Here the [] represents that the content can be omitted.The occurences of [...] in the function or method prototype of the following documents represent array type or optional content, according to the context.

There are [some description about the types given in this document](https://github.com/taijiweb/domcom/blob/master/doc/api-type-description.md)

************************************************************************************************

## use domcom

### get Domcom
  `npm install --save domcom`

  `git clone https://www.github.com/taijiweb/domcom`

  download from github releases: [Github releases](https://github.com/taijiweb/domcom/releases)

  use the cdn, thanks to unpgk.com and cdn.jsdelivr.net):
  
First add the React and ReactDom links.

        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        
or

        <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
and then add Domcom itself:

        Https://unpkg.com/domcom@0.8.4/dist/domcom.js
        Https://unpkg.com/domcom@0.8.4/dist/domcom.min.js
        Https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.js
        Https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.min.js

### refer domcom in html pages

  According to the requirements for developping or application, choose one of the files(domcom.js, domcom.min.js, domcom-basic.js or domcom-basic.min.js) from the domcom/dist/ folder after installing or cloning or downloading, add the script tag to html page like below:

    <script src="path/to/domcom.min.js"/>

  Thanks to jsdelivr, the domcom can be used like below:

    <script src="http://cdn.jsdelivr.net/domcom/x.y.z/domcom.min.js"/>

  And then add the javascript script tag after domcom script tag:

    <script src="path/to/my-app.js"/>

### import domcom api

dc will become global variable hooked under window in th browser, after adding the domcom's `<script>` tag, i.e. window.dc. I recommend to use Coffee-script, or to use babel for the supporting to ES6 syntax. With them the domcom api can be refered like below:

	{see, div, list, if_} = window.dc

#### ES 6

With the help of the tools like webpack or browserify and by using babel.js, the syntax of ES6 like below also can be used:

    const {see, div, list, if_} = dc = require('domcom')

### the native ES5 syntax

If you only prefer to the native ES5 syntax and not use any tools above, the method below can be used:

	var see = dc.see, div = dc.div, if_ = dc.if_;

or like below:

	dc.see(1)  
	dc.div({}, "hello")
	dc.if_(x, "hello",  "hi")

These are obviously not ideal. I still suggest to use Coffee-script or ES6.

***********************************************************

## API reference

### components

The component is the core concept in Domcom. Domcom uses the components to manipulate dom nodes. Every component will generate respective dom nodes. The components can be divided to two categories by their base classes: base compnoents and transform components. The base components manipulate dom nodes directly, and they have the methods to create or refresh dom, attach/detach node. With components, domcom give a complete declarative description to dom, including node, node property, node events, and so on. Besides, Domcom creates the static or dynamic relations between the dom and the data by using value or reactive functions, renders and refreshes the components to dom, so as to improve the performance.

***********************************************************

#### Component base class: Component

This is the base class of all components. It provides the common method for component classes. In them, the mount, unmount and remount method manipulate, the render method are used to create or update the components, the renderWhen method can set the schema to render the component; the on, off and emit manage the component events.

##### Component method
* **mount，unmount**

  > component.mount(mountNode: Null | domNode, beforeNode: Null | domNode)`

  Mount component. If dom node does not exists, the node will be created before mounting. mountNode is the parentNode to be mounted to. If ommited, document.body will be used. beforeNode will become the next siblings node of the comonent's node. Suppose the real parentNode to be mounted to is parentNode，the created component node is node, then the code for mounting is: `parentNode.insertBefore(node, beforeNode)`

  > `component.unmount()`

  Detach compnent's node from the dom.

* **render**

  > `component.render(forceRender:Boolean)`

  Render compnent. If dom node does not exists, the node will be created at first. If the dom node exists, and the component was invalidated, proper updation will be executed. If the component is valid, but the parent node of its dom node(`component.node.parentNode`) is not the parentNode of the component itself(`component.parentNode`), the dom node will be attached to component.parentNode and before `component.nextNode`, again.

* **renderWhen**

  Set the opportunity to render the component, which can be some dom events on some component, or window.setInterval. The type declaration for the two methos are below:

  >  `component.renderWhen(components:[Component]|Component, events:[DomEventName], options)`

  When the dom events on components happen, component will be rendered or updated. If dc.config.useSystemUpdating is true, ，then the render or the updatioin configured by this method will not be done, except options.alwaysUpdating is true.

  >  `component.renderWhen(event:setInterval, interval:Int(ms), options)`

  >  `component.renderWhen(event:setInterval, interval:Int(ms), options)`

* **on, off, emit**

  This three method manipulate the event happening on this compnent. This kind of events are called component event, which are different from the dom event, and are provided by the domcom framework. Compnent event mechanism is indepent completely from the dom event mechanism. The component events are registered in the Component.listeners by Component.on, off, and emitted by the emit method. The domcom framework emits a group of component events internally, including willMount, didUnmount, willAttach etc.

  > `component.on(event, callback)`

  Register component event callback funciton(callback), the component object will become the "this" context of the callback.

  >  `component.off(event, callback)`

  Remove the registered callback from the listeners of the component,  with "event" as the event name.

  >  `component.emit(event, args...)`

  Execute all the callback which are registed on the parameter event, For every callback, run `callback.apply(component, args)`

* **clone**

  Although this method is not defined on the Component class itself, but All of the bulitin classes in domcom almost always define this method. The derived compnent classes should define this method if they need be cloned or copied. The clone method can make a copy of itself. When the compnent need be used in multiple places, but should not be referenced directly( which may causes the conflicting dom node), this method may be useful.

  > `component.clone()`


* **toString**

  Although this method is not defined on the Component class itself,But All of the bulitin classes in domcom almost always define this method. It mainly is used to help debugging.

  >  `component.toString(indent:Int=0, addNewLine:Boolean)`

***********************************************************

#### component utilities

#### toBlock

  Convert anything to component. If it is a component, return itself; if it is a function, return a Text Component, the text field is a reactive function; if it is an array, return a List component; if it is  a promise, return a proxy reactive function to the promise; if it is null or undefined, return a Nothing component; otherwise return a Text component.

  > `toBlock(item:Any)`

#### toBlockArray

  Convert anything to an array of component. 

  > `toBlockArray(item:Any)`

#### isBlock

  Check whether anything is a component.

  > `isBlock(item:Any)`

***********************************************************

#### BaseComponent

  The base components have some method to manipulate the dom directly, including createDom, updateDom etc. Most of the base components will generate dom nodes directly, but List component will indirectly generate dom nodes throught their children components. Empty List components and Nothing component will not generate the real dom node. The field for dom node is component.node. This field for Tag, Text, Comment is the real dom node; this field for Html is an array, including a group of real dom node, the dom node field for List is an array including the real dom node or the node for other List.

##### module: Core/Base/BaseComponent

##### direct super class: Component

##### subclasses: List, Tag, Text, Html, Comment, Nothing

##### constructor and instantiate function

  Do NOT use BaseComponent object directly

***********************************************************

#### list component: List

##### module: Core/Base/List

##### direct super class: BaseComponent

##### subclasses: Tag

##### constructor
  > new List(children: [toBlock])

##### instantiate function

  > list(children...: [toBlock])

##### sample
	list \
	    label("user name: "),
	    text(placeholder: "input here: ", value: username$)

##### other instantiate function: every, each, funcEach

  every, each, funcEach will also return an instantiation of list component.

  > `every(attrs:Object, items:[Any] | Object, options:Object)
 
  > `each(attrs:Object, items:[Any] | Object, options:Object)

  > `funcEach(attrs:Object, listFunc: Function, options:Object)
  
  `each`, `funcEach` will watch the change in the array or object, and will always render the nodes according the uptodate data.

  options.itemFn is called as component template function, which will return a component, if the return value is not component, it wil be converted to component by using toBlock function.
  
  Most of the instantiate funciton, like `list`, `every`, `each`, `funcEacn`, `txt`, `if_`, `case_`, `pick`, `cond`, `defer`, etc, can be automatically wrapped by a tag element by providing an attrs object.

##### List method

  The list components provide a group of methods to manipulate its children dynamically, which can add or remove the child component in its children field. Please notice that these methods will not affect the dom immediately, instead, they set invalidateIndexes and invalidate the list component at first, and the dom will be refreshed until the render method of the component is called. Most of time these method may do NOT need be used, except while customing or extending the components. It is suggested not to imperatively and directly modify the compnent structure by using these methods as possible.

* **pushChild**

  Push a child compnent to the tail of List.children.

  > `component.pushChild(child:toBlock)`


* **unshiftChild**

  Unshift a child component to the front of List.children.

  > `component.unshiftChild(child:toBlock)`

* **insertChild**

  Insert a child component at the index location of List.children的index.

  > `component.insertChild(refChild:Index|Component, child:toBlock)`

* **removeChild**

 Remove the child component

  > `component.removeChild(child:Index|Component)`

* **replaceChild**

  replace the refChild with the new child component.

  > `component.replaceChild(oldChild:Index|Component, newChild:toBlock)`

* **setChildren**

  Set the components in newChildren to the respective location stated at startIndex of List.children

  > `component.setChildren(startIndex:Index, newChildren:[Any])`
  
  The ite in newChildren will be converted by `toBlock`.

* **setLength**

  The length of List.children is set to newLength, the child component stated from newLength will be removed. IfnewLength is greater or egual to the old length of List.children, this method will do nothing.

  > `component.setLength(newLength:Int)`

***********************************************************

#### tag component: Tag

##### module: Core/Base/Tag

##### direct super class: List

##### constructor function
  > new Tag(tagName, attrs, children)

##### instantiate function

  > `dcTagName([attrs:Attrs] [, children:[toBlock]...])`
  
  dcTagName is a function which can instantiate a component, and it must be imported form the dc namespace before being used, e.g. div, p, span, input, textarea, select, etc.

  > `inputType([attrs:Attrs][, value:domField])`

  inputType is a proper type value for <intput>, including text, number, checkbox, radio, email, date, tel, etc.

  On the complete list for dcTagName and inputType, please see src/core/tag.coffee.

  > `tag(tagName:TagName [attrs:Attrs][, children:[toBlock]...])`

  tagName is any string which can be used as a html tag.

##### samples

    span("hello")
    li(-> x)

	text({$model: model}), select $options:[['domcom', 'angular', 'react']])

	input({type:"text", value: who$, onchange: -> alert "hello, "+who$()})


##### Tag component method

  Tag component is used for the Element node in the dom. It can manipulate the dom node properties, Css Style, Dom events and so on. The properties defined on Tag component is reactive, i.e. if their values is a function, which will  become reactive function. The Tag component need be updated only while the reactive function is invalidated. While updating, The new value of the computation will be compared to the cached value, when and only when they are different, the dom node properties will be modified and dom operations will be executed to refresh. Dom events is the events which happen on the dom node. They are not domcom component events. The dom events include onclick, onchange and so on. For processing dom Dom, domcom mainly take use of the declaration through the attrs parameter while constructing Tag component, in the meanwhile, The two methods, Tag.bind, Tag.unbind can be used. Besides, some directives, the methods such as Component.renderWhen, dc,renderWhen, dc,updateWhen can also add dom event handler functions.

  Most of the methods on Tag components do not directlye operate on the dom, so they will not immediately take affect, and the dom will not be refreshed until the call to the render method to the tag component or their holder components. No dom operation will be executed if the new value is equal to the cached value of the property. Domcom imrove the performance the web application by this kind of mechanism. The Tag component methods include prop, css, addClass, removeClass, show, hide etc.

  Tag.bind, Tag.unbind are different from the description above. These two method will operate on the event callback array for the event handler of the dom node, and will affect the behaviour of the dom node event. If the first event callback is added or the last is removed, then the event handler of the dom node event will be assigned to null. Because the modification to event property of dom node will not cause dom redraw or reflow, so this behavior will not affect the performance.

* prop

  > `tag.prop(prop:PropName|PropSet, value: domField)`

   Get the value of one property; set one property or multiple properties.

* css

  > `tag.css(prop:PropName|PropSet, value: domField)`

 Get the value of one style; Set one style or multiple styles..

* addClass, removeClass

  > `tag.addClass(items: [ClassFn]...)`

  > `tag.removeClass(classes:[ClassName]...)`
  
  All the values for prop, css and class can be reactive function, i.e., domcom can automatically update the value of the dom node if a reactive function is provided.

* show, hide

  > `tag.show([display])`

  > `tag.hide()`

* bind, unbind

  > `tag.bind(eventName, handlers:DomEventHandler)`

  > `tag.unbind(eventName, fn)`

  bind or unbind the event callback fn for the event of eventName on the component's dom node. Domcom will collect all the event callbacks to one array and generate the real event handler function, set this handler to the dom node's the eventName property.

  The callback fn will be called like so: callback.call(component, event, node), and the tag component will become "this" context to the callback fn, event is the real dom event, node is the node of this tag component. When all the event callbacks are processed, event.preventDefault() and event.stopPropagation() will be executed, except that event.executeDefault or event.continuePropagation is set to true.

***********************************************************

***********************************************************

### text component: Text

##### module: Core/Base/Text

##### direct super class: BaseComponent

##### subclasses: Html, Comment

##### constructor function

  >  `new Text(text:domField)`

##### instantiate function

  >  `txt([attrs:Attrs, ]string:domField)`

##### explanation

  If any parameter or any field which needs a component is given a non component value, then the value will be converted to Text component, except that the value is undefined or null.

##### sample

    div(1)
    p("hello", who$)  
    li(someVariable)  
    span(-> someVariable)
  
  All of above, 1, "hello", who$, someVariable, -> someVariable, will become Text component.

***********************************************************

### Html component: Html

##### module: Core/Base/Html

##### direct super class: Text

##### constructor function

  >  `new Html(htmlText:domField[, transform:(String) -> String])`

##### instantiate function

  >  `html([attrs:Attrs, ]htmlText:domField[, transform:(String) -> String])`

##### sample

	html("<div> This is domcom </div> <div> That is angular </div>")
	html(someHtmlTextString, escapeHtml)


***********************************************************

### comment component: Comment

##### module: Core/Base/Comment

##### direct super class: Text

##### constructor function

  > new Comment(text:domField)

##### instantiate function

  > comment(text:domField)

  Comment component instantiate function is not provided attrs:Attrs parameter.

##### sample

	comment("this is a comment")


***********************************************************

### CDATA component: Cdata

  CDATA is not supported by html, but supported by xhtml and xml.

##### module: Core/Base/Cdata

##### direct super class: Text

##### constructor function

  > new Cdata(text:domField)

##### instantiate function

  > cdata(text:domField)

  CDATA component instantiate function is not provided attrs:Attrs parameter.

##### sample

	cdata("this is a CDATA text")


***********************************************************

### nothing component: Nothing

##### module: Core/Base/Nothing

##### direct super class: BaseComponent

##### constructor function

  > new Nothing()

##### instantiate function

  > nothing()

  Nothing component instantiate function is not provided attrs:Attrs parameter.

  When item in toBlock(item) is null or undefined, Nothing component will be created.

***********************************************************


#### transform component base class:  TransformComponent

  Transform component has getContentComponent method. The getContentComponent method will be called before rendering to get the content component, and then it is decided how to render. Transform component is chained to the base component by it's conent component, and chained to the dom node. the dom node field is component.node.

##### module: Core/Base/TransformComponent

##### direct super class: Component

##### subclasses: If, Case, Cond, Func, Route, Defer

##### constructor function and instantiate function

  Do NOT use transform component directly.

***********************************************************


### If component: If

##### direct super class: TransformComponent

##### module: Core/Base/If

##### constructor function

  >  `new If(test:ValueReactive, then_:toBlock[, else_:toBlock])`

##### instantiate function

  >  `if_([attrs:Attrs, ]test:ValueReactive, then_:toBlock[, else_:toBlock])`

  else_ is optional. If else_ is omitted, then the else_ field of If component will be Nothing component.

##### sample

	x = see(0, parseFloat)
	comp = list \
        text({onchange: -> comp.render()}, x)
        if_(x, div('It is not 0.'), div('It is 0 or NaN.')))

***********************************************************

### Case component: Case

##### module: Core/Base/Case

##### direct super class: TransformComponent

##### constructor function

  >  `new Case(test:ValueReactive, caseMap:Hash[, else_:toBlock])`

##### instantiate function

  >  `case_([attrs:Attrs, ]test:ValueReactive, caseMap:Hash[, else_:toBlock])`

##### sample

    case_(x, {
        A: "Angular",
        B: "BackBone",
        D: "Domcom",
        E: "Ember",
        R: "React"
    },  "some other")

***********************************************************

### Pick component: Pick

##### module: Core/Base/Pick

##### direct super class: TransformComponent

##### constructor function

  >  `new Pick(host:Object, field:String [, initialContent:toBlock])`

##### instantiate function

  pick does not support "attrs" parameter, because host must be an object.

  >  `pick(host:Object, field:String [, initialContent:toBlock])`

##### sample

    pick(host={}, 'activeField', 1)

***********************************************************

### Cond component

##### module: Core/Base/Cond

##### constructor function

  >  `new Cond(testComponentPairList:[Reactive, toBlock, ...][, else_:toBlock])`

##### instantiate function

  >  `cond(attrs:Attrs, testComponentPairList:[Reactive, toBlock, ...][, else_:toBlock])`


***********************************************************

##### Func component

##### module: Core/Base/Func

##### constructor function

  >  `new Func(func:Function|Reactive)`

##### instantiate function

  >  `func([attrs:Attrs, ]func:Function|Reactive)`

##### sample

	x = 0
	comp = null
	indexInput = number({onchange: -> x = parseInt(@value); comp.render()})
	comp = list(indexInput, func(-> if x>=0 and x<=3 then div x))

***********************************************************

#### Route component

##### module: Core/Base/route

##### constructor function

  >  `new Route(routeList, otherwise, baseIndex)`

  It is not necessary to use Route constructor function directly at most of time. It is always more convenient to use route instantiate function, which has "route.to" method, but Route class has not.

##### instantiate function

  >  `route(routeList:[RoutePattern, RouteHandler...], [otherwise: toBlock][, baseIndex])`

  RoutePattern is the route pattern string or the route pattern string and the test funciton. The route pattern string can include query field name(the identifer lead by colon:) and regexpt, the wildcard characters(* or **) and general string.

  RouteHandler is the function with the type below:

  >  `(match:RouteMatchResult, childRoute: RouteInstantiateFunction) -> toBlock)`

  RouteMatchResult's type is below:
    {
      items: the matched query field
      basePath: the base path of the route
      segment: [String]: the matched string segments of the path
      leftPath: String:  the left string of the path after matching
      childBase: Int: the base index for the child route component instantiate function
    }

  route and childRoute has the "to" method, which can be used to set `location.href` or `window.history`.

  >  `route.to(path:RelativePath|AbsolutePath)`

  >  `childRoute.to(path:RelativePath|AbsolutePath)`

##### sample

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

### Defer component

##### module: Core/Base/Defer


##### constructor function

  > new Defer
        promise:Promise
        fulfill:((value, promise, component) -> toBlock)
        [reject: ((value, promise, component) -> toBlock)
        [init:toBlock]]

##### instantiate function

  > defer attrs:Attrs,
        promise:Promise
        fulfill:((value, promise, component) -> toBlock)
        [reject: ((value, promise, component) -> toBlock)
        [init:toBlock]]

***********************************************************

### reactive function

  The reactive function in domcom is lazy. invalidation should not trigger any real computation except changing valid state.

  (UPDATE: the reactive function is implemented in domcom before, but now they have been published as npm packages: lazy-flow, lazy-flow-at and dc-watch-list, and imported to domcom).

  The reactive function is the key to domcom different from other frameworks. Everything that connecting to data in Domcom, including Dom properties, If, Case, Cond component's test field, Func component's func field, Each component's items field, etc, can be reactive functions. Reactive functions have invalidateCallbacks field, which contains a list of invalidate callbacks, also the invalidate and onInvalidate methods, onInvalidate is used to register invalidate callback，invalidate is used to emit the excuection of all registed callbacks by onInvalidate.

  The reactive functions can be generated by using reactive function generator.

  All the methods relating to reactive functions in domcom are defined in the folder domcom/srs/flow/, all of the method is defined in the namespace dc.flow, can be refered through flow.someName or {someName,...} = dc.flow. For convenience, the frequently used names in flow/index module are also imported to dc namespace, so they can be refered by dc.someName or {someName,...} = dc, too.

#### flow/index module

##### react

* `flow.react(fn)`

##### lazy

* `flow.lazy(fn)`

##### renew

* `flow.renew(fn)`

##### flow

  * `flow(x1, x2, ..., fn)`

##### pipe

  * `flow.pipe(x1, x2, ..., fn)`

##### see

  * `see(value: Any[, Transform:(Value) -> Any])`

  * sample

    username$ = see("Tom")

    num1$ = see(1)
    num2$ = see(2)
    
  It's a convention to add a '$' character after the variable of a reactive function.

##### seeN

  * `[a$, b$, c$, ...] = flow.seeN(a, b, c, ...)`


##### bind

  * sample

	score = { name: "Tom", points:95}

	name$ = flow.bind(scores, "name")

##### duplex

	points$ = flow.duplex(scores, "points")

##### unary

##### binary

****************************************************************************

#### flow/addon module

  The functions below will generate reactive functions with their parameters:

##### auto bindings

  Generate a group of single way binding (flow.bind) and double way binding (flow.duplex) from the model, the suffix of single way binding is "_", the suffix of single way binding is "$"

  > bindings(model:Object[, debugName:String])

  debugName parameter is optional, which is used by toString of the generated reactive function

  See the code below:

    dc.bindings = flow.bindings =  (model, name) ->
      result = {}
      for key of model
        result[key+'$'] = duplex(model, key, name)
        result[key+'_'] = bind(model, key, name)
      result

  * sample: 

     m = {a:1, b: 2}
     bindings$ = bindings(m)

     {a_, b$} = m

##### unary operations
  neg，not， bitnot， reciprocal，abs，floor，ceil，round

##### binary operations
  add， sub，mul，div，min, and, or
  
##### ternary operations(aka conitional test)
  flow.if_(test, then_, else_)

 flow.if_ is different from if_ component instantiate function, which generate a If component. Please always use flow.if_ to avoid confusing.

  For better readability, it's better to refer to these flow utilities as flow.xxx, e.g. flow.not, flow.and, flow.add, etc.

******************************************************************

### domcom utilities

#### DomNode class

#### dc utilties

#####  module: domcom/src/dc

##### methods on dc object

* dc

  > `dc(element: DomSelector|Node|[Node]|NodeList, options={})`

  generate an instantiation of DomNode

  e.g. dc(document), dc("#demo"), dc(".some-class")

* dc.directives

  register one directive or multiple directives. Please the section "Directive" for the description to directive.

* dc.onReady

  > `dc.onReady(fn:Callback)`

  Register the callbacks which will be executed when dc.ready() is called.

* dc.ready

  Execute the callbacks registered by dc.onReady.

  > `dc.ready()`


* dc.onRender

  Register the callbacks which will be executed when dc.render is called.


  > `dc.onRender(callback:Callback)`

* dc.offRender

  Remove the callback registered by dc.onRender.

  > `dc.offRender(callback:Callback)`

* dc.render

  Execute all the callbacks registered by dc.onRender.

  > `dc.render()`
  

* dc.renderWhen


##### dc properties

* dc.$document

  It is the same as window.$document, i.e. dc.$document = dc(window.document)

* dc.$body

  It is the same as window.$body), i.e. dc.$body = dc(window.body)


#### Tag property utilties

#####  module: src/core/property

##### explanation

  Some utilities to process the class, style and other properties of the Tag components, including classFn, styleFrom, extendAttrs, etc.

##### classFn

  > classFn(items: [classFnType]...)

  classFnType is a recursive type, here is its definition: `ClassName|MultipleClassNames|classFn(...)|classFnType`


#### styleFrom

  > styleFrom(value)

    value: A style string like "stylePropName:value; ...",
      or: an array including the items like "stylePropName:value"
      or: an array including the items like [stylePropName, value]


##### extendAttrs

  > extendAttrs(toAttrs:Attrs|Null, fromAttrs:Attrs|Null)

  > overAttrs(fromAttrs:Attrs|Null, toAttrs:Attrs|Null)

    toAttrs: the propeties hasn to be extended. If it is null or undefined, a new object will be created.

    fromAttrs: the newproperties is used to extend old properties

##### extendEventValue

  > extendEventValue(props, prop, value, before)

    props: events properties of the component

    prop: event name, like "click", "onclick", etc. If the prefix "on" is omitted, then "on" will be added by domcom.

    value: event callback or an array of event callback

    before: If it is truthy, value will be added before the original event callback array, otherwise after the original event callback array. The default value is false.

***********************************************************

#### utilties in util module

#####  module: domcom/src/util

  (UPDATE: this module has been published as dc-util and imported to domcom).

  Domcom implements this group functions to provided for the framework itself. It is not intended to be used as general utilities. Please choose them according to your user case.

##### isArray

  Check whether any item is an array.

  > `isArray(item:Any)`

##### cloneObject

  copy an object

  > `cloneObject(obj:Object)`

##### pairListDict

  Make an object (or call it hasn, dictionary) by copying the pairs in the array list.

  > `pairListDict(keyValuePairs[key, value, ...]...)`

##### newLine

  Return a string with a leading new line and some indent spaces.

  > `newLine(str:String, indent:Int, addNewLine:Boolean)`

##### isEven

  Check whether a number is even.

  > `isEven(n:Int)`

##### intersect

  Return the inersect of two sets. The set is just hash with true or 1 as the value of all keys

  > `intersect(maps:[Set])`

##### substractSet

  Return the difference of two sets. The set is just hash with true or 1 as the value of all keys

  > `substractSet(whole: Set, part:Set)`

##### binarySearch

  Search item from the sorted items by using binary search. If the item exists, the index of the item is returned, otherwise the index to insert the item is returned.

  > `binarySearch(item:Sortable, items[Sortable])`

##### binaryInsert

  Insert item into the sorted items by using binary search. If the item exists, the index of the item is returned, otherwise the index to insert the item is returned.

  Domcom uses binarySearch and binaryInsert to improve the performance in modifying the children in List component

  > `binaryInsert(item:Sortable, items[Sortable])`

**********************************************

#### dom-util utilities

#####  module: domcom/dom-util

##### domField

  If the value is undefind or null, "" is returned; if the value is normal function, renew reactive function is returned; if the value is a reactive function, the value itself is returned; if the value is Promise (which has then method and catch method), a reactive function is returned to proxy the promise. In other cases the value itself is returned (because domField is used as Dom properties, so it will be converted to string by calling toString method because the feature of Javascript language itself).

  domField is generally called by domcom automatically, the user does not need to call this method directly.

  > `domField(item:domField)`

##### domValue

  If the value is undefind or null, "" is returned; if the value is normal function, renew reactive function is returned; if the value is a reactive function, the value itself is returned; if the value is Promise (which has then method and catch method), a reactive function is returned to proxy the promise. In other cases the value itself is returned (because domField is used as Dom properties, so it will be converted to string by calling toString method because the feature of Javascript language itself).

  domValue is generally called by domcom automatically, the user does not need to call this method directly.

  > `domValue(item:domField)`

##### requestAnimationFrame

  window.requestAnimationFrame or its polyfill. This method is used by dc.renderLoop.

  > `requestAnimationFrame(callback:Callback)`

*********************************************************

####  dc.extend = require('extend'): https://github.com/justmoon/node-extend

### Domcom directives

 domcom let the code to be simpler and more readable by using directives in some cases. domcom directives is somewhat similar to angular.js directives, but with different semantics. In domcom the directives are just some syntax sugar, and they do not play some important role, and they can always can be replaced by normal function.

 The directives can only be used on Tag components. The method to use directive is like below:

   tag({ ..., $directiveName: directiveArguments, ...}, ...)

 While initializing Tag component and processing its attributes, domcom will treat the attribute leading by the "$" character as a directive, it will look up the registered directives to find one directive handler generator, call the generator with directiveArguments, and execute the returned directive handler on the component.

#### Regiester directive

  To use the directives in domcom, they must be regesited explicitly. There are two methods to register. The first one is to register directives batchly:

  > `dc.directives({$directiveName:generator:DirectiveHandlerGenerator ... })`

  The second one is to register a single directive:

  > `dc.directives($directiveName:String, generator:DirectiveHandlerGenerator)`

  As above, DirectiveHandlerGenerator is the directive handler generator, which is a function to return a directive handler. Its type is like below:

  > `DirectiveHandlerGenerator: (...) -> DirectiveHandler)`

  DirectiveHandler is the directive handler generator, it receives the component as its argument, and it processes the component and returns the component itself. Its type is like below:

  > `DirectiveHandler: (component) -> component`

#### builtin directives

  Domcom predifines some builtin directives.

##### subfolder: src/directives/

##### explanation

  Some  directives are defined in the folder above. They are just some functions, which can be used as directive handler generator, and can be registered as directives with the code below:

    dc.directives(dc.builtinDirectives)

  You can also register a single directive once, e.g.

    {$model} = dc
    dc.directives({$model:$model})

##### $model directive

* module: src/directives/model

* usage: tag({$model: model})

##### $bind directive

* module: src/directives/bind
* usage: tag({$bind: model})

##### $show and $hide directive

* module: src/directives/show-hide
* usage:
  tag({$show:test})
  tag({$show: [test, display]})
  tag({$hide: test})
  tag({$hide: [test, display]})

##### $options directive

* module: src/directives/options

* explanation: can only be used with `<select>` tag component

* usage: select({$options: [items]})

##### $splitter directive
  update(2016-3-16): $splitter is moved to another package: dc-controls

* module: src/directives/splitter
* $splitter: direction

##### $blink usage
  update(2016-3-16): $blink is moved to another package: dc-controls

* module: src/directives/blink
* tag({$blink: delay})

#### sample

    {input, model, duplex} = require('domcom')
    obj = {a:1}
    a = duplex(obj, 'a')
    comp = text({type:'text', $model:a})

***********************************************************

### builtin components
  update(2016-3-16): these are moved to another package: dc-controls

  Domcom predefined some builtin compnents, including combo, dialog, triangle, autoWidthInput, accordion, etc. These components existed mainly due to demonstrate extending domcom. From the samples we can find it is very simple to extend or combine the components under the domcom framework.
