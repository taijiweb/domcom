Each Component uses reactive closure as item or key and value argument
  2015-9-20 5:30
    recently lose sleeping because thinking taijiweb, especially on how to extend domcom to server side...
    below is the spark got just a moment ago:
    # so cool idea:
    (item, i, list) ->
       # pass reative closure as item, item is duplex reactive function, item(value) will set list[i] = value
       if sorting, i is the index after sorting
       (item, i, sortedList, originalItems) ->
    (key, value, i, obj, list) # pass reactive closure as item, value is duplex reative function, value(v) will set obj[key] = v

  Each(items, itemFn, options):
  options;
    static, no reative item, no item assignment, item or key and value is unchangable
    only push/pop
    no sort:

    do not use reactive function as item or key/value

nextDomNode is too expensive:
  2015-9-6
    nextBaseComponent and prevBaseComponent
    firstNode, lastNode, should not be method, should be attribute instead

event delegate:
  2015-9-5
  component.delegate(target, events...)
  compnent.delegate(uplevel, events...)
  e.g.
    comp.delegate 2, 'change', 'click'
    comp.delegate containerTag, 'all events'
    comp.delegate containerTag, 'all key events'

  another api
    dc.delegate from, to, events...
    "from" can be a list or component

  automatic delegate events on "Each" component

hook updater
    2015-9-5
    For TransformCompnent
      component.noop
      component.isUpdateRoot
      never have activeOffspring directly?
      onInvalidate, set content and baseComponent member properly

    activeOffspring
      hookUpdater: do not skip TransformCompnent, so transformComponent.getBaseComponent still do their works
