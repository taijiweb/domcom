# domcom cheat sheet

## Download

Npm install --save domcom

Git clone https://www.github.com/taijiweb/domcom

## Code size
Domcom itself minimizes the file domcom.min.js by approximately 21k. A total of about 500 lines of code for src/7.coffee source files.

## Add domcom to the page
First add the React and ReactDom links.

        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        
or

        <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
        
Then add the Domcom script tag:

* Development version: `<script src="path/to/domcom.js"/>`
* Product version: `<script src="path/to/domcom.min.js"/>`
* cdn:

        Https://unpkg.com/domcom@0.8.4/dist/domcom.js
        Https://unpkg.com/domcom@0.8.4/dist/domcom.min.js
        Https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.js
        Https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.min.js


## Using dc
It is recommended to use Coffee-script, and it is also good to use ES6. You can use babel to support ES6 syntax. It is also very feasible to use native ES5. No matter which language you use, Domcom can get more concise code than writing reactJS with JSX.
Because domcom is built on top of React, all Domcom components will eventually be converted to ReactProxy components. So the first step before using Domcom requires the following code.

        Import React, {Component} from 'react'
        Import ReactDom from 'react-dom'
        dc.addReactProxy React, ReactDom, Component
        
If you use the script tag method, please use the global variable under the window object:
        
        dc.addReactProxy window.React, window.ReactDOM, window.React.Component


## Description
Domcom was developed using coffee-script. This document also borrows some coffee-script writing. Especially when it comes to providing function parameters and callbacks, for example,
`->` stands for function definition `function () {... }`
`(arg1, arg2...) -> ...` represents the function definition `function (arg1, arg2...) { ... }`

  
## Components
Generate component: `comp = dc(config={data, view, ....})`
Reference the component's react element and dom node: `comp.reactElement`, `comp.node`
Component methods: `mount`, `unmount`, `update`, `copy`, `extend`, `on`, `off`, `emit`
Component events: `mounting`, `mounted`, `unmounting`, `updating`, `updated`

## tag element
`[tag, {props...}, children...]`
`['div.class1.class2#id##styles...', {props...}, children...]`
Children can contain other label elements, React component elements (in the form of arrays given below or directly using the original React component elements). **Special attention, of course, can also include Domcom component examples! **

###input label
`[type, {props...}]`
`['text.class1.class2#id##styles...', {$model:field...}]`
`['text', modelFiled]`

##React components
`[ReactClass, {props...}, children...]`
`[ReactClass, '.class1.class2#id##styles...', {props...}, children...]`

##directives
Domcom provides the following built-in directives, `$model`, `$show`, `$options`. Developers can also easily expand their own instructions as needed.


## Facility mechanism
Domcom provides some mechanisms to make development easier, listed below:

* If there is no key in props, Domcom will automatically generate a unique key. The disadvantage is that while every rendering  the key value changes.
* props can provide **keepid**, requiring Domcom's ReactProxy to use the same React element for the item each time the render is used. This applies to elements that are completely static and invariant.
* props can provide **focusid**, which can help Domcom correctly handle node focus after each update, suitable for TextInput, TextArea and other tags.
* Props can write **classes** instead of className, className can use object, and can be controlled with value
The presence or absence of key in the classes. Although Domcom does not use [classnames] (https://www.npmjs.com/package/classnames), you can refer to [classnames] (https://www.npmjs.com/package/classnames) for your understanding.
* Domcom will use the camelcase library to handle keys in props. This can be done by adding **props.dontCamel**, camelcase is always done for props.style.
* Some React elements do not want to delay the child element is not provided as an array, you can add **props.useSingleChildren** to meet this need.

The directives in props, keepid, focusid, classes, dontCamel, useSingleChildren will not appear in the later generated react element, do not worry about warnings or errors.
