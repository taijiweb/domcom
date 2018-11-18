module.exports = exports =
  isComponent: require('./isComponent')
  toComponent: require('./toComponent')
  toComponentArray: require('./toComponentArray')
  Component: require('./Component')

Object.assign exports, require './block/index'

export default exports