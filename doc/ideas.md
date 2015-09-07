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
