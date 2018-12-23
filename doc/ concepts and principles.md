# Domcom framework basic concepts and principles
The principle of the Domcom framework is very simple, and it is clear in one sentence: the Domcom component itself supports the React element in a js-friendly compact format (nested array form) through its view function, and then uses its React proxy component class ReactProxy in it. This nested array is converted to the actual React element in the render method. that is it. For more details, you can take a look at the following further analysis of the basic concepts involved.

# basic concept
* **Components**

TComponent is the core concept of the Domcom skeleton, it is the proxy used by the domcom framework to manage React elements. Each component is constructed from a config object. Only the data and view in the fonfig object have special effects. The most important is the view member (which can be the actual view data or the function that generates the view). Then, through the React component class ReactProxy, a react element is generated. When the React element is mounted, the ReactProxy instance pointer this is provided to the proxy member field of the Domcom component. Domcom uses the instance pointer to manage the Dom update of the React element through the update method. (by calling the component.proxy.setState method) and remove.

* **ReactProxy**

Each Domcom component creates a React element via ReactProxy. ReactProxy generates a React element structure based on the view field of the corresponding Domcom component.

* **High-order virtual Dom**

React invented the concept and technology of virtual Dom, and Domcom carried forward the concept and technology. If the virtual Dom is a pre-declared Dom hierarchy in the form of some kind of js, in order to manage optimization. If we consider the native Dom as a first-order Dom, React's virtual Dom can be thought of as a second-order Dom, because the api that is used directly to create the React element is cumbersome and inconvenient to read and write. So there is a syntax for jsx that returns to the xhtml format and hybridizes with js. Jsx can also be considered as a third-order high-order virtual Dom. The nested array notation provided by Domcom is just another third-order virtual Dom. This format of virtual Dom is easy to read and write, js friendly, no need for toolchain support, and has many advantages.

The above has clearly and completely introduced Domcom's concepts and principles. People who have further concerns about technical details can read the source code directly. Domcom's source code is very simple, with a total of only seven files, about 500 lines of code, the more critical code is mainly in [Component.coffee](https://github.com/taijiweb/domcom/blob/master/src/Component. Coffee), [react-proxy.coffee](https://github.com/taijiweb/domcom/blob/master/src/react-proxy.coffee), [dc-util.coffee](https://github. Com/taijiweb/domcom/blob/master/src/dc-util.coffee) Of these three files, there are only a hundred lines of CoffeeScript, which are very concise and intuitive to implement. Welcome to read.