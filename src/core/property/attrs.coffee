extend = require('extend')
{isComponent} = require('../base/isComponent')
{extendEventValue} = require('./events')
classFn = require('./classFn')
{styleFrom} = require('./style')
{domField} = require('../../dom-util')

exports.extendAttrs = (attrs, obj, options={}) ->
  if !obj then return attrs
  else if !attrs then return obj

  objClass = classFn([obj.class, obj.className])
  if options.replaceClass then attrs.className = objClass
  else
    attrs.className = classFn([attrs.class, attrs.className])
    delete attrs.class
    attrs.className = classFn([attrs.className, objClass])

  style = styleFrom(attrs.style)
  if obj.style
    attrs.style = extend style, obj.style
  else
    attrs.style = style

  for key, value of obj
    if key=='class' or key=='className'
      # class and className have been processed in advance
      continue
    else if key[..1]=='on'
      if options['replace_'+key] or options.replaceEvents then attrs[key] = value
      else extendEventValue(attrs, key, value)
    else if key=='style'
      continue
    else
      attrs[key] = value

  attrs

exports.overAttrs = overAttrs = (attrs, obj) ->
  if !obj
    attrs = extend({}, attrs)
    if attrs.style then attrs.style = extend({}, styleFrom(attrs.style))
    attrs
  else if !attrs then obj
  else
    for key, value of attrs
      if !obj[key]? then obj[key] = value
      if key=='style' then obj[key] = overAttrs(attrs[key], obj[key])
    obj

attrPropNameMap = {'for':'htmlFor'}

exports.attrToPropName = (name) ->
  if newName=attrPropNameMap[name]
    return newName

  pieces = name.split('-')

  if pieces.length==1
    return name

  i = 1
  len = pieces.length
  while i<len
    pieces[i] = pieces[i][0].toUpperCase()+pieces[i][1...]
    i++

  pieces.join('')

exports.setText = (text) ->
    text = domField(text, this)
    if this._text == text
      return this

    this.textValid = false
    this._text = text

    me = this
    if typeof text == 'function'
      text.onInvalidate ->
        me.textValid = false
        me.invalidate()
    this.invalidate()
    this