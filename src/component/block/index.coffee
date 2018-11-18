import route from './route'

module.exports = exports =
  Block: require('./Block')
  ListMixin: require('./ListMixin')
  List: require('./List')
  Tag: require('./Tag')
  ReactBlock: require('./ReactBlock')
  VueBlock: require('./VueBlock')
  Text: require('./Text')
  Comment: require('./Comment')
  Cdata: require('./Cdata')
  Html: require('./Html')
  Nothing: require('./Nothing')
  TranBlock: require('./TranBlock')
  TestBlock: require('./TestBlock')
  If: require('./If')
  MVC: require('./MVC')
  Case: require('./Case')
  Func: require('./Func')
  Pick: require('./Pick')
  Defer: require('./Defer')
  Route: route.Route
  route: route

export default exports