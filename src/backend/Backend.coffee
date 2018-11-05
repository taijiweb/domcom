###
  不同的后端使用不同的技术来实现Dom的管理（初步计划支持原生 、jquery、React，Vue，Angular几种后端，首先重点考虑一两种）

###
export default class Backend
  constructor: () ->
    if this instanceof Backend
      dc.error(new Error('Backend is an abstract Base Class;\n should not create the instance of Backend directly,\n use its Derived classes instead'))
    # 子类构造器应该增加tags属性用于创建标签部件
    #如backend.div(...)

  #创建基于部件类的部件，该部件将使用此后端管理Dom相关行为
  #假如dcreact是用于React的Backend子类实例
  #如 dcreact.by(SomeReactComponentClass)
  #创建一个使用SomeReactComponentClass的dc部件
  by: (ComponentClass) ->
    comp = new Component()
    comp.ComponentClass = ComponentClass
    comp.backend = this
    return comp

  #渲染部件DOM
  #大概不会作为公开API，计划被部件调用
  #应该被实际的后端子类重定义
  render:(component) ->

  #挂载部件DOM
  #大概不会作为公开API，计划被部件调用
  mount:(component, element) ->

  #卸载部件DOM
  #大概不会作为公开API，计划被部件调用
  unmount:(component) ->

  #创建部件DOM
  #大概不会作为公开API，计划被部件调用
  create:(component) ->
    