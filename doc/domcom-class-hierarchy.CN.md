# Domcom类层次结构

## Component class hierarchy
    Component  ...................  // 所有部件类的基类
    |
    |- BaseComponent  ............  // 基本部件类的基类
    |  |- Tag  ...................  // Tag基本部件类，window.Element: document.createElement
    |  |- Text  ..................  // Text基本部件类，window.Text: document.createTextNode(text)
    |  |  |- Html  ...............  // Html基本部件类，通过设置innerHTML产生一组DOM节点: node.innerHTML = text
    |  |  \- Comment  ............  // Comment基本部件类，window.Comment: document.createComment(text)
    |  |
    |  |- List  ..................  // List基本部件类，包含一组children部件
    |  \- Nothing  ...............  // Nothing基本部件类，不产生任何Dom节点
    |
    \- TransformComponent  .......  // 变换部件类的基类
       |- If  ....................  // If变换部件类，new If(test, then_, else_)
       |- Func  ..................  // Func变换部件类，new Func(func)
       |- Case  ..................  // Case变换部件类，new Case(test, hashMap, else_)
       |- Cond  ..................  // Cond变换部件类，new Cond(testAndComponentPairs, else_)
       |- Each  ..................  // Each变换部件类，new Each(items, itemFn, options)
       |- Route  .................  // Route变换部件类，route(routeList..., otherwise, baseIndex)
       \- Defer  .................  // Defer变换部件类，new Nefer(promise, fulfill, reject, init)


## DomNode class

DomNode不是Comonent的子类，它的作用是为一个或一组Dom节点提供一个类似于jQuery的基本接口，包含.prop, .css, .bind, .unbind等方法。.

    DomNode  .....................  // 该类代表一个或一组Dom节点，new DomNode(node) 或 new DomNode(nodes)