import dc from './dc'
import property from './property'
import builtinDirective from './directive/index'

if typeof window != 'undefined'
  window.dc = dc

# dc.DomNode from './DomNode'

dc.EventMixin =require('./dc-event')

Object.assign(dc, dc.flow, require('lazy-flow'))
require('lazy-flow/addon')
dc.bindings = dc.flow.bindings
require('dc-watch-list')
import backend from './backend'

Object.assign(dc,
  backend,
  require('dc-util'),
  require('./dom-util'),
  require('./dc-render'),

  # components
  require('./component'),
  require('./backend'),
  require('./instantiate'),

  require('./dc-error')
)

dc.property = property
dc.builtinDirective = builtinDirective
Object.assign(dc,
  dc.property
  dc.builtinDirective
)

export default module.exports = dc



