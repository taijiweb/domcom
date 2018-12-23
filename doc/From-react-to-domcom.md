# From React to Domcom: A web framework that provides DOM components

github.com/taijiweb/domcom


## design background  
  
  ReactJS has brought a huge shift to the idea of ​​front-end Web application development, subverting many previous ideas. I have had many opportunities to contact and learn ReactJS. While understanding its advanced concepts, I also found that it has some problems, initially focusing on performance, such as the virtual dom of repetitively generated components, the overall calculation of Diff and patching, and the update detection. The mechanism is not perfect enough. My idea is to identify the validity and variability of all Dom node characteristics and all other component characteristics in one way. The first thought was to distinguish between ordinary values ​​and special objects. Later, it was found that using the response function is the most appropriate means. The adoption of the response function allowed me to further improve the component's update detection mechanism. Later, I found that these design decisions, which are evolved and evolved, are more obvious and important to the improvement and convenience of data management and application design than performance. In the end, Domcom achieved all of my design goals beyond expectations, not only avoiding the fundamental factors that affect ReactJS performance, but also making up for some of the obvious flaws that ReactJS's overall architecture affects application design and implementation complexity.


## Domcom overall characteristics

  Domcom is an acronym for the merger of DOM and Component, which is designed to provide DOM components for web applications. With Domcom, you can improve data management as a whole, minimize unnecessary DOM operations, and improve program efficiency. Domcom provides components that are declarative and responsive, leveraging both the functional paradigm and the object paradigm to improve code reuse and simplify design. The following is a list of the main features of this framework:

* Declarative components based on response functions

  Any dom property and other suitable properties of the component can be response functions.

* Minimize Dom access and updates

  Domcom pre-declares and describes the entire Dom through the component, and the web application does not need to access the Dom feature and state most of the time.  

* Easy to combine extended parts

  Domcom can use function paradigm combinations to generate parts and set pass parameters, or use object paradigms to define new parts through inheritance mechanisms. This can improve the code reuse of web applications, reduce complexity, and make the design simpler and clearer.

* Maximize decoupling models and controllers

  As a provider of Dom components, Domcom focuses on solving view problems in the MVC or MVV* mode. Fully neutral and open perspective on models and controllers. Common values, variables, and functions become bridges and pipes to data. With this approach, domcom maximizes the decoupling of views into models and controllers, which facilitates implementation and simplifies design. With Domcom, many times we don't even need to make a deliberate design for a Model or Controller. Depending on the complexity of the application and the related requirements, Domcom can of course be used in conjunction with POJOs, events, observables, class-based extensions, Flux, immutable, etc., and may even borrow backbone.js, ember.js, react.js, etc. Related components in an existing framework or library.


* No need for immutable data structures, no need for additional data management solutions

  Domcom itself has a relatively modest code size and is currently minimized by approximately 21K. Because of the mechanism used by the framework for update detection and data transfer, it allows for more flexible use of data without the additional need to use immutable data structures.
  
* No template language required, no jsx required

  Domcom is designed to make it easy to use the Coffee-script and JavaScript languages ​​directly. The code in the Javascript language has been very succinct and readable, and you can use Coffee-script to achieve better results, which is basically more flexible than the Jade template language. Domcom describes the React element hierarchy based on a nested array of javascript languages, which is very readable and easy to write, more flexible and usable than jsx.

## Links, Documents, and Downloads

  Can be downloaded and installed with npm

  Npm install --save domcom

  Or use cdn:
      
        https://unpkg.com/domcom/dist/domcom.js  
        https://unpkg.com/domcom/dist/domcom.min.js  
        https://cdn.jsdelivr.net/npm/domcom/dist/domcom.js  
        https://cdn.jsdelivr.net/npm/domcom/dist/domcom.min.js


  [Github project address] (https://www.github.com/taijiweb/domcom)

  [Github releases] (https://github.com/taijiweb/domcom/releases)

  [npm package address] (https://www.npmjs.com/package/domcom)

### Document

  Domcom has provided comprehensive documentation (especially Chinese documentation), all in [doc/folder] (https://github.com/taijiweb/domcom/blob/master/doc). Chinese documentation is concentrated in the [doc/Chinese folder] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese):

  [README](https://github.com/taijiweb/domcom)

  [Introduction and tutorials] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/introduction and tutorials.md): Domcom's basic introduction and getting started tutorials.

  [Concepts and Principles] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/Concepts and Principles.md): Learn about the basic concepts and principles of Domcom.

  [API Reference] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/API Reference.md): A formal and detailed reference to all of Domcom's public APIs.

  [Quick Table] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/Cheat Table.md): Familiar with Domcom's API, common techniques and idioms.

  [Frequently Asked Questions] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/Frequently Asked Questions.md): Some questions you often want to know about Domcom.

  The [doc/](https://github.com/taijiweb/domcom/blob/master/doc) folder has more documentation content.

##社区

  QQ Group: DomcomJS Community 371409830

  Google groups: [Domcom](https://groups.google.com/d/forum/domcom)

## Description

  This framework generated ideas from January 2015 and began development in April. During this period, it has undergone several iterations. The core code has undergone many major refactorings. The current implementation is reasonable, concise, optimized, and has rich tests. In the first half of this year, one of my projects has completely abandoned jQuery and Angular to Domcom, which has a good experience. Welcome to participate in the Domcom project, build a community, make web development easier, and develop more world-changing applications. In 2018, I made a thorough redesign and implementation of the project based on the React framework. The whole framework concept is simpler, the implementation is greatly simplified (from 80k to 20k), and the resources of React can be utilized to greatly improve the usability of the framework. .