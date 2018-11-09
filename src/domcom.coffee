import dc from './dc'

if typeof window != 'undefined'
  window.dc = dc

# dc.DomNode from './DomNode'

dc.extend = extend from 'extend'

dc.EventMixin from './dc-event'

extend(dc, dc.flow, require('lazy-flow'))
require('lazy-flow/addon')
dc.bindings = dc.flow.bindings
require('dc-watch-list')

extend(dc,
  require('dc-util'),
  require('./dom-util'),
  require('./dc-render'),

  # components
  require('./component'),
  require('./backend'),

  require('./dc-error')
)

dc.property from './property'
dc.builtinDirectives from './directive/index'
extend(dc,
  dc.property
  dc.builtinDirectives
)

export default dc



