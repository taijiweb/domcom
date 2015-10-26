{bind, duplex, flow, unary, binary} = dc

module.exports = flow

dc.bindings = flow.bindings =  (model, name) ->
  result = {}
  for key of model
    result['$'+key] = duplex(model, key, name)
    result['_'+key] = bind(model, key, name)
  result

flow.neg = (x) -> unary(x, (x) -> -x)
flow.no = (x) -> unary(x, (x) -> !x)
flow.bitnot = (x) -> unary(x, (x) -> ~x)
flow.reciprocal = (x) -> unary(x, (x) -> 1/x)
flow.abs = (x) -> unary(x, Math.abs)
flow.floor = (x) -> unary(x, Math.floor)
flow.ceil = (x) -> unary(x, Math.ceil)
flow.round = (x) -> unary(x, Math.round)

flow.add = (x, y) -> binary(x, y, (x, y) -> x+y)
flow.sub = (x, y) -> binary(x, y, (x, y) -> x-y)
flow.mul = (x, y) -> binary(x, y, (x, y) -> x*y)
flow.div = (x, y) -> binary(x, y, (x, y) -> x/y)
flow.min = (x, y) -> binary(x, y, (x, y) -> Math.min(x, y))

# this is intended to be called directly
# e.g.div {onclick: -> toggle x; comp.update()}
flow.toggle = (x) -> x(!x())

flow.if_ = (test, then_, else_) ->
  if typeof test != 'function'
    if test then then_ else else_
  else if !test.invalidate
    if typeof then_ == 'function' and typeof else_ == 'function'
      -> if test() then then_() else else_()
    else if then_ == 'function'
      -> if test() then then_() else else_
    else if else_ == 'function'
      -> if test() then then_ else else_()
    else if test() then then_ else else_
  else
    if typeof then_ == 'function' and typeof else_ == 'function'
      if then_.invalidate and else_.invalidate then flow test, then_, else_, ->
        if test() then then_() else else_()
      else -> if test() then then_() else else_()
    else if typeof then_ == 'function'
      if then_.invalidate
        flow test, then_, (-> if test() then then_() else else_)
      else -> if test() then then_() else else_
    else if typeof else_ == 'function'
      if else_.invalidate
        flow else_, (-> if test() then then_ else else_())
      else -> if test() then then_ else else_()
    else flow test, -> if test() then then_ else else_