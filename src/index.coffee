import * as instantiate from './instantiate'
export default  exports  = Object.assign({},
  require('./component').default,
  require('./property/index').default
  instantiate
  require('./tag').default
  require('./each').default,
  {
    model: require('./model').default
  }
)
