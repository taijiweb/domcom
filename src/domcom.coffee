import dc from './dc'
import property from './property'
import builtinDirective from './directive/index'

if typeof window != 'undefined'
  window.dc = dc

# dc.DomNode from './DomNode'

dc.EventMixin =require('./dc-event').default

#Object.assign(dc, dc.flow, require('lazy-flow'))
#require('lazy-flow/addon')
#dc.bindings = dc.flow.bindings
#require('dc-watch-list')
import backend from './backend'

Object.assign(dc,
  backend,
  require('dc-util').default,
  require('./dom-util').default,
  require('./dc-render').default,

  # components
  require('./component').default,
  require('./backend').default,
  require('./instantiate').default,

  require('./dc-error').default
)
debugger

dc.property = property
dc.builtinDirective = builtinDirective
Object.assign(dc,
  dc.property
  dc.builtinDirective
)

export default dc



