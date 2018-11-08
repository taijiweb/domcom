import {expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

rePatternTotal = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]*))+$/
rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/
slashs = /(?:\\\/)|(?:\\\()|(?:\\\))/

{isComponent, route, txt, Nothing} = dc

describe 'route', ->
  afterEach ->
    dc.reset()

  describe 'route regexp', ->
    it 'should match paramName pattern', ->
      params = {}
      route._processPiecePatterns(':dsaf', params)
      expect(params.dsaf).to.equal true, ':dsaf'
      route._processPiecePatterns(':$', params)
      expect(params.$).to.equal true, ':$'
      route._processPiecePatterns(':_', params)
      expect(params._).to.equal true, ':_'
    it 'should match curved re', ->
      params = {}
      pat = route._processPiecePatterns('(fd+=.)', params, 2)
      expect(pat[0][0].key).to.equal 2, '(fd+=.)'
      expect(pat[1]).to.equal 3, '(fd+=.)'
    it 'should match param and string', ->
      params = {}
      pat = route._processPiecePatterns(':a(dsaf)asdfj', params, 2)
      expect(pat[0][0].key).to.equal 'a'
      expect(pat[1]).to.equal 2, '(fd+=.)'
    it 'should match param and string 2', ->
      params = {}
      pat = route._processPiecePatterns(':abc_$(dsaf)asdfj(&*^)+_', params, 2)
      expect(pat[0][0].key).to.equal 'abc_$'
      expect(pat[1]).to.equal 3, '(fd+=.)'
    it 'should match param and string 3', ->
      params = {}
      pat = route._processPiecePatterns('_):_$a(dsaf)asdfj(&*^)+_', params, 2)
      expect(pat[0][1].key).to.equal '_$a'
      expect(pat[1]).to.equal 3, '(fd+=.)'
    it 'should match param and string 3', ->
      params = {}
      pat = route._processPiecePatterns('_):_$a(dsaf):b:c-asdfj(&*^)+_', params, 2)
      expect(pat[0][1].key).to.equal '_$a'
      expect(pat[1]).to.equal 3, '(fd+=.)'
    it 'should throw while wrong paramName pattern', ->
      expect(->route._processPiecePatterns(':', params = {})).to.throw()
    it 'should throw while wrong paramName pattern 1', ->
      expect(->route._processPiecePatterns(':+', params = {})).to.throw()
    it 'should throw while wrong paramName pattern 2', ->
      expect(->route._processPiecePatterns('(dfj()', params = {})).to.throw()
    it 'should throw while wrong paramName pattern 3', ->
      expect(->route._processPiecePatterns('()', params = {})).to.throw()
    it 'should throw while wrong paramName pattern 4', ->
      expect(->route._processPiecePatterns(':(dsaf)', params = {})).to.throw()
    it 'should throw while wrong paramName pattern 5', ->
      expect(->route._processPiecePatterns('(', params = {})).to.throw()

  describe 'test private function', ->
    it 'should _getRoutePattern', ->
      pattern = route._getRoutePattern('a/')
      expect(pattern.endSlash).to.equal true

    it 'should _processPatternRouteItem', ->
      comp = route._processRouteItem [{absolute:true, segmentPatterns:[], baseIndex:0}, -> 1], "", 0
      expect(!!comp).to.equal true
      expect(comp.text).to.equal 1

    it 'should _getRoutePattern and _processPatternRouteItem', ->
      comp = route._processRouteItem [route._getRoutePattern(''), -> txt 1], "", 0
      expect(!!comp).to.equal true
      expect(comp.text).to.equal 1

  describe 'process route', ->
    it "should route 'a'", ->
      comp = route 'a', -> 1
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 1
    it "should route 'a/b' on path 'a'", ->
      comp = route 'a/b', -> 1
      comp.getPath = -> 'a'
      expect((content = comp.getContentComponent()) instanceof Nothing).to.equal true
    it "should not route 'a/' on path 'a'", ->
      comp = route 'a/', -> 1
      comp.getPath = -> 'a'
      expect((content = comp.getContentComponent()) instanceof Nothing).to.equal true
    it "should not route 'a' on path 'a/'", ->
      comp = route 'a', -> 1
      comp.getPath = -> 'a/'
      expect((content = comp.getContentComponent())  instanceof Nothing).to.equal true
    it "should route '*' on path 'a'", ->
      comp = route '*', (match) -> match.segments[0]
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 'a'
    it "should route '(\w+)' on path 'a'", ->
      comp = route '(\\w+)', (match) -> match.items[0]
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.children[0].text).to.equal 'a'
    it "should not route '*' on path 'a/'", ->
      comp = route '*', (match) -> 1
      comp.getPath = -> 'a/'
      expect((content = comp.getContentComponent()) instanceof Nothing).to.equal true
    it "should not route '*/' on path 'a'", ->
      comp = route '*/', -> 1
      comp.getPath = -> 'a'
      expect((content = comp.getContentComponent())  instanceof Nothing).to.equal true
    it "should route 'a/b'", ->
      comp = route 'a/b', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 1
    it "should route multi item", ->
      comp = route 'a/1', (-> 1),
        'a/2', ->2
      comp.getPath = -> 'a/2'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 2
    it "should route multi item with otherwise", ->
      comp = route 'a/1', (-> 1),
        'a/2', -> 2,
        txt('otherwise')
      comp.getPath = -> 'a/otherwise'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 'otherwise'
    it "should route 'a/**' on path a/b", ->
      comp = route 'a/**', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 1
    it "should route 'a/*/**' on path a/b", ->
      comp = route 'a/*/**', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContentComponent())).to.equal true
      expect(content.text).to.equal 1
    it "should route 'a/*/*/**' on path a/b", ->
      comp = route 'a/*/*/**', -> 1
      comp.getPath = -> 'a/b'
      expect((content = comp.getContentComponent())  instanceof Nothing).to.equal true
    it "should route embedding route", ->
      comp = route 'a/**', (match, route2) ->
        route2 'b', -> 2
      comp.getPath = -> 'a/b'
      content = comp.getContentComponent()
      content.getPath = -> 'a/b'
      comp2 =  content.getContentComponent()
      expect(!!comp2).to.equal true
      expect(comp2.text).to.equal 2

  describe 'multiple level route', ->
    comp = route(
      'a/*/**', (match, route2) ->
        route2 1, (-> 1),
          2, -> 2,
          3, -> 3
          otherwise: 'otherwise 2'
      'b/**', -> 'b/**'
      otherwise: 'otherwise 1'
    )
    it "should route a/b/3", ->
      comp.getPath = -> 'a/b/3'
      content = comp.getContentComponent()
      content.getPath = -> 'a/b/3'
      comp2 =  content.getContentComponent()
      expect(!!comp2).to.equal true
      expect(comp2.text).to.equal 3
    it "should route b/2", ->
      comp.getPath = -> 'b/2'
      content = comp.getContentComponent()
      expect(!!content).to.equal true
      expect(content.text).to.equal 'b/**'
    it "should route not-found", ->
      comp.getPath = -> 'not-found'
      content = comp.getContentComponent()
      expect(!!content).to.equal true
      expect(content.text).to.equal 'otherwise 1'
    it "should route a/b/no-entry", ->
      comp.getPath = -> 'a/b/no-entry'
      content = comp.getContentComponent()
      content.getPath = -> 'a/b/no-entry'
      comp2 =  content.getContentComponent()
      expect(!!comp2).to.equal true
      expect(comp2.text).to.equal 'otherwise 2'

  describe 'process route.to', ->
    it "should route.to", ->
      expect(route._navigateTo('a/b/c', '../x', 2)).to.equal('a/x')
      expect(route._navigateTo('a/b/c', 'f', 2)).to.equal('a/b/f')
      expect(route._navigateTo('a/b/c', '/f', 2)).to.equal('f')
      expect(route._navigateTo('a/b/c', '/f/', 2)).to.equal('f/')
      expect(route._navigateTo('a/b/c', './f/', 2)).to.equal('a/b/f/')
    it "should route.to 2", ->
      expect(route._navigateTo('a/b/c', '../../f/', 2)).to.equal('f/')
      expect(route._navigateTo('a/b/c', '../../../f/', 2)).to.equal('f/')
