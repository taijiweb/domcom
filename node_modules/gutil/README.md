gutil
=====

General Util methods

- **get** : Get object attribute value :
```js
get( {o1:{o2:{o3:{a:1}}}}, "o1.o2.o3.a") // => 1
```
- **has** : Return true if the object has the attribute value :
```js
// array
has( [{a:1,b:1},{a:2,b:2}], "a", 1 ) // => true
has( [{a:1,b:1},{a:2,b:2}], "a", 11 ) // => false
has( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) // => true
has( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 11 ) // => false
// object
has( {o:{a:1,b:1}}, "a", 1 ) // => true
has( {o:{a:1,b:1}}, "a", 11 ) // => false
has( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) // => true
has( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) // => false
```
- **by** : Select values from an array or an object if they have the attribute value.
```js
// array
by( [{a:1,b:1},{a:2,b:2}], "a", 1 ) // => [{a:1,b:1}]
by( [{a:1,b:1},{a:2,b:2}], "a", 11 ) // => []
by( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) // => [{o1:{a:1,b:1}}]
by( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 11 ) // => [{o1:{a:1,b:1}}]
// object
by( {o:{a:1,b:1}}, "a", 1 ) // => [{a:1,b:1}]
by( {o:{a:1,b:1}}, "a", 11 ) // => []
by( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) // => [{o1:{a:1,b:1}}]
by( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) // => []
```
- **byNot** : Select values from an array or an object if they do not have the attribute value :
```js
// array
byNot( [{a:1,b:1},{a:2,b:2}], "a", 1 ) // => [{a:2,b:2}]
byNot( [{a:1,b:1},{a:2,b:2}], "a", 2 ) // => [{a:1,b:1}]
byNot( [{a:1,b:1},{a:2,b:2}], "a", 11 ) // => [{a:1,b:1},{a:2,b:2}]
byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) // => [{o2:{a:2,b:2}}]
byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 11 ) // => [{o1:{a:1,b:1}},{o2:{a:2,b:2}}]
// object
byNot( {o:{a:1,b:1}}, "a", 1 ) // => []
byNot( {o:{a:1,b:1}}, "a", 2 ) // => [{a:1,b:1}]
byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) // => [{o2:{a:2,b:2}}]
byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) // => [{o1:{a:1,b:1}},{o2:{a:2,b:2}}]
```
- **replace2** : scan only one time the text and replace many txt occurences during this scan
sample :
```js
// given
var txt = "simple text";
var oldValues = ["simple","text"];
var newValues = ["hello","world"];
// when
var result = replace2(txt, oldValues, newValues);
// txt == "hello world";
```
- **add** : insert value in an array
- **addAll** : insert values in an array
- **all**
- **and**
- **Assert**
- **concat**
- **each**
- **filter**
- **log**
- **oneBy**
- **requireReload**
- **sort** : sort array elements
- **unique**
- **walk**
- **string** : utils functions for String
