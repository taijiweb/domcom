{bound, duplex, flow} = dc

exports.bindings =  (model) ->
  result = Object.create(null)
  for key of model
    result['$'+key] = duplex(model, key)
    result['_'+key] = bound(model, key)
  result

flow.unary = unary = (x, fn) ->
  if typeof x != 'function' then fn(x)
  else if x.invalidate then flow(x, -> fn(x()))
  else -> fn(x())

flow.neg = (x) -> unary(x, (x) -> -x)
flow.no = (x) -> unary(x, (x) -> !x)
flow.rev = (x) -> unary(x, (x) -> ~x)
flow.abs = (x) -> unary(x, Math.abs)
flow.floor = (x) -> unary(x, Math.floor)
flow.ceil = (x) -> unary(x, Math.ceil)
flow.round = (x) -> unary(x, Math.round)

flow.binary = binary = (x, y, fn) ->
  if typeof x == 'function' and typeof y == 'function'
    if x.invalidate and y.invalidate then flow x, y, -> fn x(), y()
    else -> fn x(), y()
  else if typeof x == 'function'
    if x.invalidate then flow x, -> fn x(), y
    else -> fn x(), y
  else if typeof y == 'function'
    if y.invalidate then flow y, -> fn x, y()
    else -> fn x, y()
  else fn(x, y)

flow.add = (x, y) -> binary(x, y, -> x+y)
flow.sub = (x, y) -> binary(x, y, -> x-y)
flow.mul = (x, y) -> binary(x, y, -> x*y)
flow.div = (x, y) -> binary(x, y, -> x/y)
flow.min = (x, y) -> binary(x, y, -> Math.min(x, y))
