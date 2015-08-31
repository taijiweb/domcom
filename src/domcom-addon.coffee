{extend} = dc

extend(dc,
  require('./directives/index')
  require('./builtins/index')
  require('./addon-util')
)

{flow} = dc
extend(flow,
  require('./flow/addon')
  require('./flow/watch-list')
)

module.exports = dc
