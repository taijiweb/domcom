import route from './route'

export default
  isComponent: require('./isComponent').default
  toComponent: require('./toComponent').default
  toComponentArray: require('./toComponentArray').default
  Component: require('./Component').default
  BaseComponent: require('./BaseComponent').default
  ListMixin: require('./ListMixin').default
  List: require('./List').default
  Tag: require('./Tag').default
  Text: require('./Text').default
  Comment: require('./Comment').default
  Cdata: require('./Cdata').default
  Html: require('./Html').default
  Nothing: require('./Nothing').default
  TranComponent: require('./TranComponent').default
  TestComponent: require('./TestComponent').default
  If: require('./If').default
  MVC: require('./MVC').default
  Case: require('./Case').default
  Func: require('./Func').default
  Pick: require('./Pick').default
  Defer: require('./Defer').default
  Route: route.Route
  route: route