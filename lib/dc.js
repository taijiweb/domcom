var Component, DomNode, addEventListener, dc, extend, isComponent;

extend = require('extend');

DomNode = require('./DomNode');

({addEventListener} = require('./dom-util'));

isComponent = require('./core/components/isComponent');

Component = require('./core/components/Component');

/*
 * a utility to do almost everything
 * generate Component instance
 * as the dc framework namespace
 * hold convinent getter, setter and method, etc...
 * @params template: the template for the component
 * @params model: the model for the component data
 * model can be the real value of data
 * can be a functioin to generate the data
 * can also be an instance of class Model
 */
module.exports = dc = function(template, model) {
  var comp;
  comp = new Component(template, model);
  return comp;
};

/*
 * 创建部件并设置其数据模型
 */
dc.data = function(model) {
  var comp;
  comp = dc();
  comp.model = model;
  // 方便链式语法
  return comp;
};

/*
 * 创建部件并设置其模版
 */
dc.shape = function(shape) {
  var comp;
  comp = dc();
  comp.template = template;
  // 方便链式语法
  return comp;
};

/* 选择dc运行和编译时基于的后端，需要预先注册
 * 用扩展机制、插件机制来考虑相关的实现
 */
dc.use = function(backend) {
  // todo 如果backend为字符串，则查找对应的后端插件部件
  return dc._backend = backend;
};

/* 选择dc运行和编译时基于的后端，需要预先注册
 * 用扩展机制、插件机制来考虑相关的实现
 */
dc.backend = function(backendPlugin) {
  dc.backends[backendPlugin.name] = backendPlugin;
};
