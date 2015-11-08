{domValue} = require "./dom-util"

#BaseComponent = require './core/base/core/base/BaseComponent'
List = require './core/base/List'
Tag = require './core/base/Tag'
Text = require './core/base/Text'
Comment = require './core/base/Comment'
Html = require './core/base/Html'
Nothing = require './core/base/Nothing'

TransformComponent = require './core/base/TransformComponent'
#If = require './core/base/If'
#Case = require './core/base/Case'
#Func = require './core/base/Func'
#Each = require './core/base/Each'
#Defer = require './core/base/Defer'

TransformComponent::html = ->
  if @valid then return @_html
  content = @getContentCompnent()
  content.html()

childrenHtml = (children) ->
  htmlList = []
  for child in children
    htmlList.push child.html()
  htmlList.join ""

List::html = -> childrenHtml(@children)

Nothing:: html = -> ""

Text::html = -> domValue(@text)

Html::html = -> @transform and @transform(domValue(@text)) or domValue(@text)

Commment::html = -> "<-- #{domValue(@text)} -->"

Tag::html = ->
  propHtml = []
  for prop, value in @props
    propHtml.push prop+"="+domValue(value)

  styleHtml = []
  for prop, value in @styles
    styleHtml.push prop+":"+domValue(value)
  styleHtml.length and propHtml.push "{"+styleHtml.join('; ')+"}"

  if propHtml
    propHtml = " "+propHtml.join(" ")
  else propHtml = ""



  "<#{@tagName}"+properties.join(" ")+">"+childrenHtml(@children)+"</{@tagName}>"


