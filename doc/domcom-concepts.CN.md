# Domcom框架的基本概念

* **部件**

构成Domcom骨架的最核心概念。domcom框架用来管理dom节点的代理。每个部件最终将生成一个或一组Dom节点，某些特殊的部件也可能不生成Dom节点，如Nothing部件，children.length为0的List部件。

* **基础部件**

基础部件具有直接管理Dom的方法，包括createDom, updateDom，attachNode，removeNode等。大多数基础部件都直接生成Dom节点，但是List部件间接通过子部件生成Dom节点，Nothing节点不会生成Dom节点。

* **变换部件**

变换部件具有getContentComponent方法。重绘Dom前变换部件先调用getContentComponent方法，先获取内容部件后再决定重绘过程。

* **响应函数**

Domcom框架区别于其它框架的关键要素。Domcom中一切连接数据的成分，包括Dom特性，If,Case, Cond部件的测试条件，Func部件的func特性，Each部件基于的数组和对象，等等，都可以是响应函数。响应函数具有invalidateCallbacks，它包含该响应函数的失效回调函数的列表；还具有invalidate和onInvalidate两个方法，其中onInvalidate用于注册失效回调函数，invalidate用于执行onInvalidate注册的所有失效回调函数。

* **响应依赖**

响应函数之间存在的依赖关系。当被依赖的响应函数失效时，依赖于它的后继响应函数，部件特性、部件也将失效。

* **强制响应函数**

强制响应函数执行时总是连带执行自己的invalidate方法，进而执行用onInvalidate注册的所有回调，触发失效链。用flow.renew(fn)可以产生强制响应函数。构造部件时，一切可以用响应函数的地方如果被传入普通函数，domcom都会先用flow.new将其转换为强制响应函数。

* **响应函数产生器**

执行响应函数产生器可以得到响应函数。这包括flow模块中的see, pipe, flow, bind, duplex等方法，以及flow/addon中的一些方法: flow.add, flow.sub, ..., flow.if_等等。

* **失效回调函数**
响应函数的invalidateCallbacks列表中所包含的函数。失效回调函数的主要动作是失效后继的依赖响应函数或者部件，除此外一般不做其它计算。

* **绘制部件**

调用部件的mount, render, update方法，会进一步调用renderDom方法。该方法负责管理部件及其内容部件、子部件的Dom节点及其Dom特性的管理，包括Dom特性更新，节点从Dom的附着与移除等。

* **更新部件**

调用部件的update方法，会更新部件。update方法与render方法的不同在于前者会首先调用emit('update')发送部件事件'update'。

* **刷新Dom**

指创建Dom节点，改变Dom节点的特性，Style, 将部件所属Dom节点的附着到Dom或从Dom中移除等Dom相关操作。

和其它类似的虚拟Dom框架类似，domcom创建部件的时候，总是先创建整个Dom节点树结构，然后一次性附着到浏览器的Dom上，而不是先创建上层节点，附着上层节点，再递归创建和附着下层节点。这种方法会有更高的性能，因为可以减少Dom内操作和重新布局。

* **内容部件**

变换部件经过调用getContentComponent方法产生的部件，称为该变换部件的内容部件。


* **子部件**

根据上下文不同，子部件可以有不同的意义。涉及到List部件或Tag部件时，特指chilren数组中的部件项。在更宽泛的语境中，指代部件的内容部件及其children数组中的部件项，以及进一步包含的所有后代。

* **部件持有者**

部件有个holder特性，代表该部件的持有者。直接挂载到Dom的部件的holder特性值是null，这种部件成为根部件。内容部件的持有者是产生该内容部件的变换部件。子部件的持有者是包含它的列表部件或Tag部件（Tag部件也是List部件的派生类）。

* **部件有效性**

部件有个关于有效性的标识特性：Component.valid。当这个标识的值为true，则该部件有效。否则该部件无效。

* **无效的部件**

当变换部件的变换、部件的内容、子部件、部件的Dom特性中间有任何一项无效时，这个部件是个无效的部件。当部件无效时，重绘或更新该部件需要完成对应的任务，这个任务总是最小化的，而不必是全部内容或子部件。比如，当正在重绘的部件是个变换部件，当变换本身是无效的，那么只有在通过调用getContentComponent(), 获取到新的内容部件，发现它和原有的内容部件不同时，才需要将原有的内容部件从Dom中移除，此时，如果新的内容部件是有效的，则只要将新的内容部件的Dom节点附着到Dom就可以了。

* **有效的部件**

当变换部件的变换、部件的内容、子部件、部件的Dom特性等等全都有效时，这个部件是个有效的部件。当部件有效时，更新该部件无需做任何操作。有一种情况例外：该部件的parentNode是null，而该部件的node及node的parentNode不是null，则需要将执行部件的removeDom方法，将其从Dom中移除。

* **失效部件**

为了免除歧义，domcom的文档中，总是将失效用作动词。部件都具有invalidate方法。变换部件，List部件（Tag部件从它继承）具有invalidateContent。变换部件也具有invalidateTransform方法。调用这些方法，会将该部件的valid设置为false。如有必要，会调用该部件的持有者的invalidateContent方法，递归地失效部件持有者。

* **失效链**

失效一个响应函数促发失效其它响应函数，也可以失效某个部件。失效部件会进一步失效该部件的持有者，直至传播到已经无效的某个部件，如果没有遇到无效部件，则一直传播到根部件。在失效处理上这些响应函数和部件概念上形成环环相扣的一串链条，称之为失效链。

* **变换有效和变换无效**

变换部件有个标识transformValid。当该标识为true，代表变换有效，即当前内容部件是该变换部件的合法内容部件，下次重绘该部件时无需调用getContentComponent方法。当该标识为null或false，代表变换无效，即当前内容部件已经不再是该变换部件的合法内容部件，下次重绘该部件时需要再次调用getContentComponent方法。一般在getContentComponent的开始处将transformValid设置为true。当调用TransformCompnent.invalidateTransform方法时，将transformValid设置为false。invalidateTransform方法通常由某个响应函数直接或间接调用。

* **Dom事件**

发生在Dom节点上的事件，比如onclick，onchange等。对于Dom事件处理函数，domcom主要通过在构造Tag部件时利用attrs参数进行声明，也可以通过Tag.bind，Tag.unbind来管理。$model指令，Component.renderWhen, Component.updateWhen, dc,renderWhen, dc,updateWhen等函数也可以添加事件处理函数。

* **部件事件**

直接发生在部件上的事件。部件事件注册在Component.listeners特性上，通过Component.on, Component.off, Component.emit这一组函数进行处理。domcom内部发送的部件事件有beforeMount, update, afterUnmount, beforeAttach, contentChanged等。

* **指令**

* **部件的多处引用**

Domcom支持多处引用同一个部件。这是Domcom的一个重要特性。因为Domcom部件与Dom节点之间存在的代理与对应关系，应该对于多处引用给以特别的关注。首要的是应该防止出现一个部件在同一时刻（Dom的同一快照）附着到Dom不同位置的情况。这类情况应该视为逻辑错误，应该预先加以考虑。遇到这种情况，可以考虑使用component.clone()提供一个拷贝来替换导致冲突的引用位置。反之，基于Domcom变换部件这一概念，同一部件即是在部件层次中的不同位置多次出现，只要经过变换后部件在基础部件层次中不发生冲突，从而在对应的实际Dom中不发生冲突，那就是允许的，而且也鼓励这种情况，因为这样做可以减少创建新的Dom节点，减少Dom操作，从而提高时间和空间效率。