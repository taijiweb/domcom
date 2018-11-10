import toComponent from './toComponent'

export default  toComponentArray = (item) ->
  if !item then []

  else if item instanceof Array
    for e in item then toComponent(e)

  else [toComponent(item)]