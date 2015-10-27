## API
* window.dc
* {...} = dc = require('domcom')

### modules

#### src/core/:
##### BaseComponent
 List, Tag, Text, Comment, Html, DomNode, DomNodeList

##### TransformComponent
 If, Case, Repeat

#### src/core/instantiate.coffee
 tag, txt, comment, if_, case_, func, list_, repeat

#### src/core/tag.coffee
##### `tag(tagName, attrs, children...)`
e.g. `tag('a', {href:'http://www.google.com'})`, `tag('img', {src:'path/to/pic.png'})`

##### tags
a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl
dt em fieldset form h1 h2 h3 h4 h5 h6 head html hr i img input ins kbd label legend li link map meta noscript object
ol optgroup option p param pre q samp script select small span strong style sub sup
table tbody td textarea tfoot th thead title tr tt ul var header footer section

e.g.: `div({style:{display:"block"}}, h1('a heading'), ul(li(1), li(->x)))`

the sample above is the same as `tag('div', {style:{display:"block"}}, tag('h1', {}, 'a heading'), ul(li(1), li(->x)))`

##### input tags
* input(type, attrs, value)

    e.g. `input('text', attrs, value)` is the same as `tag('input', {type: type, value: value, ...attrs})`

* shortcuts

    text, textarea, checkbox, radio, date, email, number

    e.g. `text(attrs, value)` is the same as `input('text', attrs, value)`

#### src/core/property.coffee
* `extendAttrs(attrs, obj)`

    extend the attributes for the component

    `attrs`: the attributes object to be extended, if it is null or undefined, a new object will be created

    `obj`: will override or augment the attrs' property

* `extendEventValue(props, prop, value, before)`

    `props`: the events object of the component

    `prop`: the eventName, e.g. `"click"`, `"onclick"`, etc

    `value`: the event handler function or an array of handler function

    `before`: if true, the value will be unshifted or concatenated before the original event handlers array, otherwise will be pushed or cancatenated after it. The default is false.

* `classFn(items...)`

    item in `items` can be the className string, a classFn function, or an array of the item, recursively

* `styleFrom(value)`

    `value`: a style string like "stylePropName:value; ...", or an array of string like "stylePropName:value", and the spaces are allowed, or an array of [stylePropName, value]

### src/core/directives/
#### directive
    a directive is just a function, which receives a component, and return a component

    The directives can only be used upon Tag component

    usage: `someTag(/*attrs=*/{..., directives:directive, ...}, children...)`

#### directive generator

    a directive generator is just a function which generate a function, and the generated function can be used as directives

    usage: `someTag(/*attrs=*/{..., directives:directiveGenerator(...),  ...}, children...)`


##### builtin directive geneator modules
model.coffee, bind.coffee, show-hide.coffee, blink.coffee, splitter.coffee, options.coffee

###### generators
model, bind, show, hide, blink, splitter, options

* model(m)
* bind(m)
* show(test, display)
* hide(test, display)
* blink(delay)
* splitter(direction)
* options(items)
  can only be used with "select" tag

  usage: `select({..., directives: options(items...)}, ...)`


#### samples
    {input, model, duplex} = require('domcom')
    obj = {a:1}
    a = duplex(obj, 'a')
    comp = text({type:'text', directives:model(a)})

#### src/core/builtins/
 combo, dialog, arrow, accordion

### classes
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

    someComponent.update()

* Component.beforeMount

    someComponent.beforeMount(fns...)

* Component.afterMount

    someComponent.beforeMount(fns...)

* Component.unbindBeforeMount

    someComponent.unbindBeforeMount(fns...)

* Component.unbindAfterUnmount

    someComponent.unbindAfterUnmount(fns...)

* setOptions

    someComponent.setOptions(options)

##### Tag
* Tag.bind

    someTag.bind(eventName, handlers...)

* Tag.unbind

    someTag.unbind(eventName, handlers...)

* Tag.prop

    someTag.prop(prop, value)

    `prop`: if arguments.length is 1, then prop should be the property name

* Tag.addClass

    someTag.addClass(items...)

* Tag.removeClass

    someTag.removeClass(classes...)


* Tag.css

    someTag.css(prop, value)

* Tag.show

    someTag.show(display)

* Tag.hide

    someTag.hide()
