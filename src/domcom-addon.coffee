{extend} = dc

dc.builtinDirectives = require('./directives/index')

extend(dc,
  dc.builtinDirectives
  require('./builtins/index')
  require('./addon-util')
)


{flow} = dc
extend(flow,
  require('./flow/addon')
  require('./flow/watch-list')
)

module.exports = dc
