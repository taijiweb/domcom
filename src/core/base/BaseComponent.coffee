Component = require './component'

module.exports = class BaseComponent extends Component
  constructor: (options) -> super(options)

  isBaseComponent: true
