{extend} = dc

require('./directives')

extend(dc,
  require('./builtins')
  require('./addon-util')
)

module.exports = dc
