exports._directiveRegistry = _directiveRegistry = Object.create(null)

# register directive
# directiveHandler: (...) -> (component) -> component
exports.registerDirective = (directiveName, directiveHandler) ->
  _directiveRegistry[directiveName] = directiveHandler
