import * as instantiate from './instantiate'
export default  exports  = Object.assign({},
  require('./component'),
  require('./property/index')
  require('./instantiate')
  require('./tag')
  require('./each'),
  {
    model: require('./model')
  }
)
