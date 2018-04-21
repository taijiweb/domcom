# type description

These type description occurs in the api-reference.md, they are just some informal specification, to help understanding the documentation and write code. It should not be used as a precise formalism.

The following are some of the types which will occur in the prototype description:

* item:toComponent:    item can be any value, but item will be converted to a proper component by toComponent(item)

* value:domField:    value can be any value, but value will be converted to a property value of the dom node by domField(value)

* fn:Reactive:    fn is a reactive function

* x:Any:    x can be any type

* items:[Type]:    items is an array with Type as its element type

* Array:    array type

* items:[Type1, Type2, ...]:    items is an array, Type1 element and Type2 element occur sequencially in pairs in the array

* hash:Hash:     hash is an oject, and is not array or null

* item: HashValue:    item is the value of Hash, the Hash object generally should be a parameter of a relative function, or a field of the hosted object

* item: HashKey:    item is the key to Hash object,  the Hash object generally should be a parameter of a relative function, or a field of the hosted object

* item: Set:    item is a set, the values in it should be always true or 1

* fn:(param1[: Type1] [, param2[: Type2] [, ...] ]) -> [Type]:    function type

* item:Type1|Type2:    item can be the value of Type1 or Type2

* item:ValueReactive:     item can be any value or a reactive function. if item is a ordinary function, it will be converted to a renew reactive function

* attrs:Attrs:    attrs can be used ad the attrs of Tag component, `isAttrs(attrs)`(defined in core/util.coffee) should be true

* item: Index:    item is the subscription of array. The array generally should be a parameter of a relative function, or a field of the hosted object

* item: Boolean:  item is Boolean type

* item: Int:  item is integer type

* item: String:    item is a string

* item: Promise:    item is a Promise, it should has .then and .catch method

* item:TagName:    item is a string which can be used as tag name in html, e.g. div, custom-tag, etc

* item:PropName:    item is proper name for Node property or the Style of the Node

* item:PropSet:    item is a Hansh from PropName map to property value, the value is domField type

* item:ClassFn:    item is the value or values' list for className(or class) ，all the values will be used as the parameters for classFn, merged to be set to the value of className property
