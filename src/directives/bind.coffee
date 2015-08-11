# bind
module.exports = (value) -> (comp) ->
  comp.attrs.value = value
  comp