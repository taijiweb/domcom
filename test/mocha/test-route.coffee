{expect, iit, idescribe, nit, ndescribe} = require('./helper')

rePatternTotal = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]*))+$/
rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/
slashs = /(?:\\\/)|(?:\\\()|(?:\\\))/

{isComponent, route, txt} = dc

describe 'route', ->
  describe 'route regexp', ->
    it 'should match slashs', ->
      expect('\\(').to.match slashs, '\\('
      expect('\\)').to.match slashs, '\\)'
      expect('\\/').to.match slashs, '\\/'
      expect('.dfa\\/+dsf/').to.match slashs, '.dfa\\/+dsf/'
      expect('.dfa\\(+dsf/').to.match slashs, '.dfa\\(+dsf/'
      expect('.dfa\\)+dsf/').to.match slashs, '.dfa\\)+dsf/'
    it 'should match paramName pattern', ->
      paramName = /:([$_\w]+)/
      expect(':dsaf').to.match paramName, ':dsaf'
      expect(':$').to.match paramName, ':$'
      expect(':_').to.match paramName, ':_'
      expect(':').not.to.match paramName, ':_'
    it 'should match cureved re', ->
      curve = /\([^\(\)]+\)/
      expect('(fd+=.)').to.match curve, '(fd+=.)'
      expect('(').not.to.match curve, '('
      expect('(dfj(').not.to.match curve, '(dfj('
      expect('(dfj()').not.to.match curve, '(dfj()'
      expect('()').not.to.match curve, '()'
    it 'should match rePatternTotal', ->
      expect(':').not.to.match rePatternTotal, ':'
      expect(':+').not.to.match rePatternTotal, ':+'
      expect(':(dsaf)').not.to.match rePatternTotal, ':(dsaf)'
      expect(':a(dsaf)').to.match rePatternTotal, ':a(dsaf)'
      expect(':a(dsaf)asdfj').to.match rePatternTotal, ':a(dsaf)asdfj'
      expect(':a(dsaf)asdfj(&*^)').to.match rePatternTotal, ':a(dsaf)asdfj(&*^)'
      expect(':a(dsaf)asdfj(&*^)+_').to.match rePatternTotal, ':a(dsaf)asdfj(&*^)+_'
      expect('asdfj:a(dsaf)asdfj(&*^)+_').to.match rePatternTotal, 'asdfj:a(dsaf)asdfj(&*^)+_'
      expect('_):a(dsaf)asdfj(&*^)+_').to.match rePatternTotal, '_):a(dsaf)asdfj(&*^)+_'
    it 'should get pattern from rePatternTotal match', ->
      m = '(dsaf)'.match rePatternTotal
      expect(m[0]).to.equal '(dsaf)'
      expect(m[1]).to.equal '(dsaf)'
      m = '(dsaf)abc'.match rePatternTotal
      expect(m[0]).to.equal '(dsaf)abc'
      expect(m[1]).to.equal 'abc'
      expect(m[6]).to.equal 'abc'
    it 'should match rePattern', ->
      expect(':').not.to.match rePattern, ':'
      expect(':+').not.to.match rePatternTotal, ':+'
      expect('(dsaf').not.to.match rePatternTotal, '(dsaf'
      expect(':(dsaf)').not.to.match rePatternTotal, ':(dsaf)'
      expect(':a(dsaf)').to.match rePatternTotal, ':a(dsaf)'
      expect(':a(dsaf)asdfj').to.match rePatternTotal, ':a(dsaf)asdfj'
      expect(':a(dsaf)asdfj(&*^)').to.match rePatternTotal, ':a(dsaf)asdfj(&*^)'
      expect(':a(dsaf)asdfj(&*^)+_').to.match rePatternTotal, ':a(dsaf)asdfj(&*^)+_'
      m = '_):a(dsaf)asdfj(&*^)+_'.match rePatternTotal
      console.log JSON.stringify m
      expect(!!m).to.equal true, '_):a(dsaf)asdfj(&*^)+_'
      expect(m.length).to.equal 7, 'match length'
    it 'should match default patterns', ->
      defaultParams = /[^\s,;]+/
      expect(' ').not.to.match defaultParams, ':'
      m = 'asdf,'.match(defaultParams)
      console.log JSON.stringify m
      expect(m[0]).to.equal 'asdf', 'asdf,'

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
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 1
    it "should route 'a/b' on path 'a'", ->
      comp = route 'a/b', -> 1
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContent())).to.equal false
    it "should not route 'a/' on path 'a'", ->
      comp = route 'a/', -> 1
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContent())).to.equal false
    it "should not route 'a' on path 'a/'", ->
      comp = route 'a', -> 1
      comp.getPath = -> 'a/'
      expect(!!(content = comp.getContent())).to.equal false
    iit "should route '*' on path 'a'", ->
      comp = route '*', (match) -> match.items[0]
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 'a'
    it "should not route '*' on path 'a/'", ->
      comp = route '*', (match) -> 1
      comp.getPath = -> 'a/'
      expect(!!(content = comp.getContent())).to.equal false
    it "should not route '*/' on path 'a'", ->
      comp = route '*/', -> 1
      comp.getPath = -> 'a'
      expect(!!(content = comp.getContent())).to.equal false
    it "should route 'a/b'", ->
      comp = route 'a/b', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 1
    it "should route multi item", ->
      comp = route 'a/1', (-> 1),
        'a/2', ->2
      comp.getPath = -> 'a/2'
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 2
    it "should route multi item with otherwise", ->
      comp = route 'a/1', (-> 1),
        'a/2', -> 2,
        txt('otherwise')
      comp.getPath = -> 'a/otherwise'
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 'otherwise'
    it "should route 'a/**' on path a/b", ->
      comp = route 'a/**', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 1
    it "should route 'a/*/**' on path a/b", ->
      comp = route 'a/*/**', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContent())).to.equal true
      expect(content.text).to.equal 1
    it "should route 'a/*/*/**' on path a/b", ->
      comp = route 'a/*/*/**', -> 1
      comp.getPath = -> 'a/b'
      expect(!!(content = comp.getContent())).to.equal false
