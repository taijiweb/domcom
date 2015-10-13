route = require './route'
module.exports =
  isComponent: require './isComponent'
  toComponent: require './toComponent'
  Component: require './component'
  BaseComponent: require './BaseComponent'
  List: require './List'
  Tag: require './Tag'
  Text: require './Text'
  Comment: require './Comment'
  Html: require './Html'
  Nothing: require './Nothing'
  TransformComponent: require './TransformComponent'
  If: require './If'
  Case: require './Case'
  Func: require './Func'
  Each: require './Each'
  Router: route.Router
  route: route