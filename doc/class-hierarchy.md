# Domcom class hierarchy

## Component class hierarchy
    Component  ...................  // the base class for all component classes
    |
    |- BaseComponent  ............  // the base class for base component classes
    |  |- Tag  ...................  // Tag base component class for window.Element: document.createElement
    |  |- Text  ..................  // Text base component class for window.Text: document.createTextNode(text)
    |  |- Html  ..................  // Html base component class for generating dom nodes by setting innerHTML: node.innerHTML = text
    |  |- Comment  ...............  // Comment base component class for window.Comment: document.createComment(text)
    |  |- List  ..................  // List base component class, contains a group of children components
    |  \- Nothing  ...............  // Nothing base component class, which won't genenate any dom node
    |
    \- TransformComponent  .......  // the base class  for all transform component classes
       |- If  ....................  // If transform component class, new If(test, then_, else_)
       |- Func  ..................  // Func transform component class, new Func(func)
       |- Case  ..................  // Case transform component class, new Case(test, hashMap, else_)
       |- Cond  ..................  // Cond transform component class, new Cond(testComponents, else_)
       |- Each  ..................  // Each transform component class, new Each(items, itemFn, options)
       |- Route  .................  // Route transform component class, route(routeList..., otherwise, baseIndex)
       \- Defer  .................  // Defer transform component class, new Defer(promise, fulfill, reject, init)


## DomNode class

DomNode is NOT a subclass of Component. It is used to provide an jQuery style interface for a single Dom node or a group of Dom node including the methods like, e.g. .prop, .css, .bind, .unbind.

    DomNode  .....................  // the class to represent some dom nodes, new DomNode(node) or new DomNode(nodes)