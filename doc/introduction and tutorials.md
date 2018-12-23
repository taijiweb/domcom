# Domcom

Web framework that provides DOM components

Github.com/taijiweb/domcom


## design background
  
  React is undoubtedly one of the most popular front-end development frameworks.
###React's advantage
React can achieve today's status
    
* The power of componentized design thinking.
* The operational efficiency of the virtual Dom update mechanism is improved.

###React's deficiency
Although React is very popular now, it also exposes its weaknesses. There are three main aspects

* **Data Management Issues**  
  Because the React refresh implementation mechanism tends to compare the top-down layers of component data, the data is passed from top to bottom. What's even worse is that the weakness of this implementation mechanism is actually biased and kidnapped people's development design concepts, advocating what the global store. One-way data flow deviates from more reasonable traditional software development concepts, such as abstraction, encapsulation, information hiding, data localization, etc., resulting in Flux, reflux, redux, redux-thunk, saga, redux-observer, dva, and so on, the wheels of the whole family have formed a resounding family barrel. Due to the fundamental mistakes in concept, the invention of these new wheels has not brought obvious convenience to the front-end development. Knowledge has led to the improvement of the learning curve and the development efficiency. Reduced (because a task is broken down into multiple blocks of small wheel jurisdiction, often seven or eight files need to be changed to complete a business, and function codes for several different locations are tracked).
* **JSX syntax**  
  Because React's API for creating elements is cumbersome, and in order to take care of the tradition of web development, JSX has been invented as js code for masquerading xml. I have to say that the combination of the two is really ugly. It is inevitable that there will be syntax errors when the code levels are mixed with each other. Sometimes it will add a lot of trouble to the novice. Even experienced people have moments that affect development efficiency.
* **React element and React component instance difference**  
  React element is not an ordinary component instance, so it is difficult to manage it as a normal object instance, which also brings some convenience to development. For example, the dialogs implemented by the entire React community have not been used in the desktop development environment. Just need dlg= dialog(); dlg.open(); dlg.close() to complete a similar mechanism for the task. I refer to such components as autonomous components.  
  The first question is related to the second and third questions. It can be said that the first problem is more important than the second and third problems.


## Domcom overall characteristics

  The acronym for the merger of DomcomDOM and Component is to provide DOM components for web applications. Domcom is a fundamental solution to the above problems. Each Domcom component will eventually be represented by a ReactProxy (a React Component). So have all the advantages of React components. At the same time, the Domcom component's work makes it possible to arbitrarily transfer data, control  componentss, mounts, and removes makeup (it is convenient to call comp.mount(), comp.update(), comp.unmount()) autonomously.
Domcom has the following features:

* Built on React

  With React, Domcom combines the advantages of React componentization and virtual Dom.

* Concise and lightweight API

  On top of React, adhering to the tradition of jQuery, domcom has designed a simple and lightweight API, which is small in number, easy to learn and easy to remember, and has a very low learning cost. For example, Domcom does not need to define a class, just call dc ({view, ...}) to define the component. The widget automatically watches the relevant data. Methods such as component.mount(), component.update(), component.unmount(), etc. are easy to understand, as the name suggests, unlike React, which requires defining classes and tends to lengthy method names.

* Describe the structure of the React element with a nested array.

  Domcom uses the js nested array to describe the structure of the React element, such as [ClassA, {propss...},['div.class...#id##style...',{props...}, ' Some text children, ...otherChildren]. This way is easy to read, easy to input, and no need for babel, reducing tool dependencies, just by introducing React, ReactDom, Domcom's codebase, and the app's own code in the script tag, the page can start working and development is easier. .

* Maximize decoupling models and controllers

  Similar to React, Domcom, as a provider of Dom components, focuses on solving view problems in MVC or MVV* mode. But beyond React, Domcom has a completely neutral and open view of the model and controller, because Domcom breaks through React's update mechanism and avoids the problems it poses.
  In Domcom, any common values, variables, and functions can be the bridge and conduit for data to view. With this approach, domcom maximizes the decoupling of views with models and controllers, which facilitates implementation and simplifies design. With Domcom, many times we don't even need to make a deliberate design for a Model or Controller. Depending on the complexity of the application and the related requirements, Domcom can of course be used in conjunction with POJOs, events, observables, class-based extensions, Flux, immutable, etc., and may even borrow backbone.js, ember.js, react.js, etc. Related components in an existing framework or library.



## Getting and using Domcom

### Getting Domcom
  Npm install --save domcom

  Git clone: ​​[github domcom](https://www.github.com/taijiweb/domcom)

  Download the github release: [Github releases] (https://github.com/taijiweb/domcom/releases)

  Use cdn: Thanks to `unpkg.com` and `cdn.jsdelivr.net` for the cdn link:
  
         https://unpkg.com/domcom@0.8.4/dist/domcom.js 
         https://unpkg.com/domcom@0.8.4/dist/domcom.min.js           
         https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.js
         https://cdn.jsdelivr.net/npm/domcom@0.8.4/dist/domcom.min.js
         https://www.jsdelivr.com/package/npm/domcom

### Setting up Domcom on the page

According to the development and application needs, select the appropriate files in domcom/dist/ under domcom.js, domcom.min.js, domcom-basic.js, domcom-basic.min.js from the folder of installation or download, as usual Method to add a script tag to the html page:

`<script src="path/to/domcom-???.???.js"/>`

Add your own js script after domcom's script tag:

`<script src="path/to/my-app.js"/>`

## Domcom Getting Started

  Domcom is implemented in Coffee-script and translated into javascript. Domcom encourages the use of Coffee-script, but does not prevent Javascript from writing Domcom-based applications. Relatively speaking, the code will be slightly longer and less readable. This is completely feasible for most programmers who are used to writing javascript native code, and there is no bad thing. Domcom does a lot of easy-to-read and write design for Coffee-script, so the code for domcom applications is very succinct and readable.

  The following example uses the Coffee-script language. Coffee-script and Javascript are basically one-to-one correspondence. Even if you are not familiar with Coffee-script friends, I suggest reading the following content first. If you have doubts, you should understand it intuitively.
  To make it easier to understand the following code, here are a few points to know: in CoffeeScript, indentation is used to represent grammar blocks; never need to declare variables, just assign them directly; -> or => means function definitions.
  
### Hello, Domcom

    view = ['div', "Hello, Domcom"]
    comp = dc({view})
    comp.mount()

  The function of the `Component.mount` method is to mount the component. After executing this code page, Hello Domcom will be displayed.

### Using the data field in config and using the view function
 

    data = {framework:"Angular"}
    view = (data) ->
      [‘div’,{}, "Hello, ", data.framework]
    comp = dc({data, view})
    comp.mount('#demo')
    data.framework = 'Domcom' //(*)

  This example uses the data field of config to pass data to the view function. `comp.mount('#demo')` indicates that the component will be mounted under the element id=demo. In the previous example, because there is no mount call, no given mount element will be mounted directly under document.body. After the component is mounted, it will start the field that the watch component itself is provided by config, and watch the existing fields on the component data. Therefore, after the line of the above code (*) is executed, the page will be updated.


### React event processing

  Domcom has a very good dom event handling mechanism. The event handler can be passed as an attribute to the Tag component directly when the component is constructed. The basic notation is `{..., onsomeevent:eventHandler,...}`.


    view = ['div', {onClick: -> alert("Hello, Domcom!")}, "Say hello!"]
    comp = dc({view})
    comp.mount('#demo')

  This example adds the onClick event to the div widget. Click `Say hello!` on the page and it will pop up `Hello, Domcom!`

### React Events and Components Updates

  In the React event, the application can change the data, or you can call the component's redraw or update method to update the component and refresh the Dom.

    onChange = (event)->
        Data.who = event.target.value
        Comp.update()
    view = (data) ->
    ['div',
        ['text' { value: data.who, onChange}, //(1)
        ['div', "Hello, ", data.who]]
    comp.mount()
    comp.on('mounted', -> comp.stopWatch()) //(2)

  We have seen that Domcom's view uses the notation [tag, {props...}, children...] to represent the React element. To facilitate Domcom also provides some mnemonics that are easier to write. For example, the input type of the input tag such as text, number, password, etc. can be written in the form of [type, {props}]. Therefore the above line (1) is equivalent to `['input', {type:'text', value: data.who, onChange}`

  As mentioned earlier, the component will start autowatch after it is mounted, which can be turned off. The line in the above code (2) is just doing this. The ‘mount' event is emitted in the `componentDidMount` lifecycle method of the `ReactProxy` component corresponding to the Domcom component `comp`.

  Execute this example page, a text input component will be displayed. Entering different text, such as `Domcom`, will trigger the `onchange` event of the text input component, thus changing data.who. By calling `comp.update()`, the contents of the div will be synchronized. Change to `Hello, Domcom`.

### Domcom directive
  
  For convenience, Domcom designed the instructions. The way to use the directive is: `[someTag, { ... $directiveName: options, ...}`. The Tag component passes the item and options to the instruction handler, and the directive of the instruction handler is bound to the component itself. The instruction handler takes some processing on the item and returns a new item as a result.

  Domcom provides a set of built-in instructions, including $model, $options, $show, and more. We can use this set of instructions in the application, or we can define new instructions by referring to the writing of this set of instructions.

    View = ->
       [['text' {$model: 'who'}],
         ['p', this.who]]
    Comp = dc({view})
Comp.mount()
    setTimeout((->
Comp.who = 'Domcom'
Comp.update()), 2000)

  The $model directive can be used for all input elements, select, and textarea. After two seconds of this example, we will be able to see the automatic change of the page content, and the content we enter in the text box will cause the p tag to change.

### Two-way binding

  Two-way binding is a common requirement in applications. The previous section "React Events and Component Updates" is a typical scenario. From the "Domcom Directive" section we can see the simplification of the code by the two-way binding directive $model.
  The $model directive can be thought of as a combination of two declarations, `{$model: field}` is equivalent to `{value: comp[field], onChange: (event) -> comp[field] = event.target.value}` Where `comp` represents the component instance and `model` represents the field name on the component.
  Domcom always tends to make the code more concise. Because the input tag can't have the children element, so in domcom `['text' {$model: 'who'}]` can be further abbreviated as `['text' 'who']`, which is more convenient for reading and writing. .
  
### Using React components
Of course, you can also use the components that React has implemented in Domcom, such as the following code:

       import Button from '@material-ui/core/Button'
       view = ['div'
                [Button, {variant:"contained", color:"primary"},'primary'],
                [Button, 'Default'],
                [Button, {variant:"dashed", color:"secondary", disabled:true}, 'secondary'],
                [Button, {variant:"danger", color:"danger"},'danger']
              ]
       comp = dc {view}
       comp.mount('#demo')
           
Come a little more complicated

    Transition = (props) ->
         React.createElement(Slide, {direction:"up", props...})
    data =
        emails: ['x1@y.z', 'x2@y.z', 'x3@y.z'],
        open: true,
        handleListItemClick: (message)->
          alert 'handleListItemClick: ' + message
          data.open = false
          dc.update()
        handleClickOpen: ->
          data.open = true
          dc.update()
        close: ->
          data.open = false
          dc.update()

    view = (data) ->
      ['div',
        [Button, {onClick:data.handleClickOpen}, "Open full-screen dialog"],
          [Dialog, {fullScreen:true, open:data.open, onClose:data.close, TransitionComponent:Transition},
            [AppBar, '.appBar',
              [Toolbar,
                [IconButton, {color:"inherit", onClick:data.close, 'aria-label':"Close"}, [CloseIcon]],
                [Typography, {variant:"h6", color:"inherit", className:'.flex'}, 'Sound']
                [Button, {color:"inherit", onClick:data.close}, "save"]
              ]],
            [List,
              [ListItem, {button:true},
                [ListItemText, {primary:"Phone ringtone", secondary:"Titania"}]],
              [Divider]
              [ListItem, {button:true},
                [ListItemText, {primary:"Default notification ringtone", secondary:"Tethys"}]]]]]
    comp = dc({data, view})
    comp.mount('#demo')

### Domcom components combination and nesting
The following is a piece of test code excerpted from Domcom that demonstrates how to combine nested parts in Domcom.

      data = {show1:true, message1:"I am embedded 1", message2:"I am embedded 2"}
      view = (data) ->
        if data.show1
          ['div', data.message1]
        else
          ['div', data.message2]
      embedded = dc({data, view})
      embedded2 = embedded.copy().watch()
      comp = dc({view:['div', embedded, embedded2]})
      comp.mount('#demo')
      expect(embedded.node.innerHTML).to.equal 'I am embedded 1'
      expect(comp.node.innerHTML).to.equal '<div>I am embedded 1</div><div>I am embedded 1</div>'
      data.show1 = false
      expect(comp.node.innerHTML).to.equal '<div>I am embedded 2</div><div>I am embedded 2</div>'

### More examples

  The `domcom/demo/` folder provides more [demo examples] (https://github.com/taijiweb/domcom/tree/master/demo). Run the `gulp` command line in the `domcom/` folder, then open `domcom/demo/index.html` (you must have a local server, open it in webstorm, or use `python -m SimpleHTTPServer 8888`) to run These examples.

### todoMVC

  [`domcom/demo/todoMVC` folder] (https://github.com/taijiweb/domcom/tree/master/demo/todomvc) provides an implementation of todoMVC (http://todomvc.com). Go to the command line in the `domcom/` folder and run the `gulp` command, then open `domcom/demo/todomvc/index.html` (you must have a local server, open it in webstorm, or use `python -m SimpleHTTPServer 8888` ), you can run this app.

## Comparison with other frameworks

### Update Detection

  Angularjs uses a dirty value to detect the mechanism that triggers the watcher. When $apply changes on a scope, it will run the scope and the watcher on each scope below. Sometimes the watcher will be in a $digest loop because of the continuous change. Executed multiple times in the middle, even triggering an infdig exception because the number of times exceeded. Infdig is like a clown in the circus. It often comes out to remind us that there is such a last resort remedy for angularjs. It also shows that some of the shortcomings in the overall design are very strange and uncomfortable. In addition, the method of angularjs still requires the user to perform dom operations in the director and watcher, and can not fundamentally eliminate unnecessary DOM access and dom update.

  Reactjs uses cache and difference comparison. If you need to customize the refresh of a component, the common way is to override the shouldComponentUpdate method. If props does not change when it is redrawn, the underlying part is not updated by default. This is in conflict with javascript's object-based and language features that commonly use side effects. This led to the solution of flux, and a lot of extension libraries, such as reflux, redux, immutable.js, etc. I think these libraries are a remedial measure in a sense that reflects a design flaw in react.js.

  Domcom does not pursue complete and automatic watch of data as a system design template, but provides component.update method as the main update means. Watch is just that the system calls this method in the set function of the property field of the watch object. . This will not cause the problem of infinite loops or multiple loops in angularJS, nor the variability of the value of the response function, which is more flexible and more efficient. The above-mentioned programs for flux/reflux/redux and other remediation of react.js are of little value directly in domcom, and the application of domcom can be simplified and the structure is clearer. The overall amount of code can also be greatly reduced, reducing the network traffic of transmitting javascript scripts.

### Decoupling from models and controllers

  Knockout.js, ember.js, backbone.js, etc. use custom objects as models or controllers. The impact and limitations of this approach on coding are more pronounced. The current mainstream framework is less likely to adopt this approach.

  The model data of angular.js can be a normal javascript object, but it must be linked to all levels of scope. The controller must be customized with the angular method. Both scope and controller form a certain hierarchical relationship.

  React.js must pass the model data from the root component from the upper layer to the lower layer through this.props. For dynamic data, use the this.setState method to set it. Otherwise, the update logic of react.js may be seriously affected. React.js does not have a special controller concept, but customary controller methods must be attached to the component class.

  The various elements in domcom are just ordinary constants, variables, or response functions. In addition, they are completely neutral and open to the model or controller. As you can see, domcom has the highest degree of decoupling. Although it is customary for domcom to pass data through the config object to the component itself for use by the view function, this is not a mandatory requirement. Exempting the limitations imposed by the above framework, domcom's api design approach also makes the view function very convenient and natural to use data from any source. Applications can arbitrarily organize data according to the needs of the problem domain itself, without feeling the framework's coercion, which will greatly promote the architecture design of the entire system, we from domcom's own [todomvc demo example] (https://github.com/ Taijiweb/domcom/blob/master/demo/coffee/todomvc.coffee) can feel this.

### Combination and expansion capabilities

  Angularjs 1.x has a complex conceptual framework that enhances the learning curve on the one hand and the combination of components on the other. To achieve the combination, inheritance and extension of the controller, directives, it is necessary to adopt many unusual methods to overcome many technical obstacles, which is often daunting and hinders the popularization of these practices.

  The combination of react.js has improved, but because on the one hand the data must be organized at the props and state levels, on the other hand each component must implement the render method, and React usually has to declare the component as a class. A lot of template code is needed, and because React components can only be used in the form of React elements in jsx mode, there is no simple and effective way to manage component instances from outside the component, plus the limitations imposed by the aforementioned update detection scheme. The ability to combine and expand has not yet reached the ideal level.

  Whether domcom uses function methods or object methods, comcom can naturally combine, transform, inherit, and extend components. The previous examples have partially reflected the characteristics of domcom in this regard.

### responsive

  Flyd.js, bacon.js, rx.js These responsive frameworks can provide some help for design and can accomplish more tasks with less code, but I personally feel that the overall architecture of the programs that follow these frameworks has not become Clearer and better understood, there is a feeling of falling into a noodle-like response flow. Although most of Domcom's elements are responsive, they don't organize the overall structure in the same way as the above-mentioned framework, but as a declarative method, so the program is more intuitive, clear, and more organized. . Compared to these responsive frameworks, Domcom's response is more lazy. The change in the source does not directly trigger subsequent actual calculations, but instead provides a component.update method to trigger the update. This design allows developers to have more control over the system and a clearer understanding of the system's operation.

## Next?

  Now that we have understood the features and advantages of Domcom, we have mastered the method of writing web applications through domcom by understanding the previous examples. Domcom offers new ways to write web applications, allowing us to simplify design implementation while pursuing the best operational efficiency. Next, we can further understand the following content, more comprehensive to familiarize with the API provided by domcom, and deepen its concepts and methods. Of course, we can start using Domcom right away and learn while using it.

  [Concepts and Principles] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/Concepts and Principles.md): Learn about the basic concepts and principles of Domcom.

  [Quick checklist] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/quick checklist.md): Familiar with Domcom's api, common techniques and idioms.

  [API Reference] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/API Reference.md): References on all of Domcom's public APIs.

  [Frequently Asked Questions] (https://github.com/taijiweb/domcom/blob/master/doc/Chinese/Frequently Asked Questions.md): Some questions you often want to know about Domcom.

  The [doc/Chinese/](https://github.com/taijiweb/domcom/blob/master/doc/Chinese) folder has more documentation content.