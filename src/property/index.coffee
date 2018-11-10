import classFn from './classFn'

#export default
module.exports = exports = {}

Object.assign(exports,
  require('./attrs'),
  require('./classFn')
  require('./style')
  require('./css-arith')
  require('./events'),
  require('./delegate-event'),
  {classFn: classFn}
)

export default exports