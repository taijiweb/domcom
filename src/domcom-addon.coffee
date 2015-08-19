{extend} = dc

extend(dc,
  require('./directives')
  require('./builtins')
  require('./addon-util')
)

module.exports = dc
