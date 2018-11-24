import Component from './component/Component'

###
# a utility to do almost everything
# generate Component instance
# as the dc framework namespace
# hold convinent getter, setter and method, etc...
# @params template: the template for the component
# @params config: the config object for the component, it can have the fileds below
    model can be the real value of data or a function to generate the model data
    data: the data of the component
    view: the view object or a function to generate the view
###
export default module.exports = dc = (config) ->
  comp = new Component(config)
  return comp