{bound, duplex, flow, unary, binary} = dc

module.exports = flow

dc.bindings = flow.bindings =  (model, name) ->
  result = Object.create(null)
  for key of model
    result['$'+key] = duplex(model, key, name)
    result['_'+key] = bound(model, key, name)
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
