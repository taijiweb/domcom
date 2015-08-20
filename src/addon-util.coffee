{sibind, bibind} = dc

exports.bindings =  (model) ->
  result = Object.create(null)
  for key of model
    result['$'+key] = bibind(model, key)
    result['_'+key] = sibind(model, key)
  result

