var Nothing, expect, idescribe, iit, isComponent, ndescribe, nit, rePattern, rePatternTotal, route, slashs, txt, _ref;

_ref = require('./helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

rePatternTotal = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]*))+$/;

rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/;

slashs = /(?:\\\/)|(?:\\\()|(?:\\\))/;

isComponent = dc.isComponent, route = dc.route, txt = dc.txt, Nothing = dc.Nothing;

describe('route', function() {
  describe('route regexp', function() {
    it('should match paramName pattern', function() {
      var params;
      params = {};
      route._processPiecePatterns(':dsaf', params);
      expect(params.dsaf).to.equal(true, ':dsaf');
      route._processPiecePatterns(':$', params);
      expect(params.$).to.equal(true, ':$');
      route._processPiecePatterns(':_', params);
      return expect(params._).to.equal(true, ':_');
    });
    it('should match cureved re', function() {
      var params, pat;
      params = {};
      pat = route._processPiecePatterns('(fd+=.)', params, 2);
      expect(pat[0][0].key).to.equal(2, '(fd+=.)');
      return expect(pat[1]).to.equal(3, '(fd+=.)');
    });
    it('should match param and string', function() {
      var params, pat;
      params = {};
      pat = route._processPiecePatterns(':a(dsaf)asdfj', params, 2);
      expect(pat[0][0].key).to.equal('a');
      return expect(pat[1]).to.equal(2, '(fd+=.)');
    });
    it('should match param and string 2', function() {
      var params, pat;
      params = {};
      pat = route._processPiecePatterns(':abc_$(dsaf)asdfj(&*^)+_', params, 2);
      expect(pat[0][0].key).to.equal('abc_$');
      return expect(pat[1]).to.equal(3, '(fd+=.)');
    });
    it('should match param and string 3', function() {
      var params, pat;
      params = {};
      pat = route._processPiecePatterns('_):_$a(dsaf)asdfj(&*^)+_', params, 2);
      expect(pat[0][1].key).to.equal('_$a');
      return expect(pat[1]).to.equal(3, '(fd+=.)');
    });
    it('should match param and string 3', function() {
      var params, pat;
      params = {};
      pat = route._processPiecePatterns('_):_$a(dsaf):b:c-asdfj(&*^)+_', params, 2);
      expect(pat[0][1].key).to.equal('_$a');
      return expect(pat[1]).to.equal(3, '(fd+=.)');
    });
    it('should throw while wrong paramName pattern', function() {
      return expect(function() {
        var params;
        return route._processPiecePatterns(':', params = {});
      }).to["throw"]();
    });
    it('should throw while wrong paramName pattern 1', function() {
      return expect(function() {
        var params;
        return route._processPiecePatterns(':+', params = {});
      }).to["throw"]();
    });
    it('should throw while wrong paramName pattern 2', function() {
      return expect(function() {
        var params;
        return route._processPiecePatterns('(dfj()', params = {});
      }).to["throw"]();
    });
    it('should throw while wrong paramName pattern 3', function() {
      return expect(function() {
        var params;
        return route._processPiecePatterns('()', params = {});
      }).to["throw"]();
    });
    it('should throw while wrong paramName pattern 4', function() {
      return expect(function() {
        var params;
        return route._processPiecePatterns(':(dsaf)', params = {});
      }).to["throw"]();
    });
    return it('should throw while wrong paramName pattern 5', function() {
      return expect(function() {
        var params;
        return route._processPiecePatterns('(', params = {});
      }).to["throw"]();
    });
  });
  describe('test private function', function() {
    it('should _getRoutePattern', function() {
      var pattern;
      pattern = route._getRoutePattern('a/');
      return expect(pattern.endSlash).to.equal(true);
    });
    it('should _processPatternRouteItem', function() {
      var comp;
      comp = route._processRouteItem([
        {
          absolute: true,
          segmentPatterns: [],
          baseIndex: 0
        }, function() {
          return 1;
        }
      ], "", 0);
      expect(!!comp).to.equal(true);
      return expect(comp.text).to.equal(1);
    });
    return it('should _getRoutePattern and _processPatternRouteItem', function() {
      var comp;
      comp = route._processRouteItem([
        route._getRoutePattern(''), function() {
          return txt(1);
        }
      ], "", 0);
      expect(!!comp).to.equal(true);
      return expect(comp.text).to.equal(1);
    });
  });
  describe('process route', function() {
    it("should route 'a'", function() {
      var comp, content;
      comp = route('a', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal(1);
    });
    it("should route 'a/b' on path 'a'", function() {
      var comp, content;
      comp = route('a/b', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a';
      };
      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
    });
    it("should not route 'a/' on path 'a'", function() {
      var comp, content;
      comp = route('a/', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a';
      };
      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
    });
    it("should not route 'a' on path 'a/'", function() {
      var comp, content;
      comp = route('a', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a/';
      };
      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
    });
    it("should route '*' on path 'a'", function() {
      var comp, content;
      comp = route('*', function(match) {
        return match.segments[0];
      });
      comp.getPath = function() {
        return 'a';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal('a');
    });
    it("should route '(\w+)' on path 'a'", function() {
      var comp, content;
      comp = route('(\\w+)', function(match) {
        return match.items[0];
      });
      comp.getPath = function() {
        return 'a';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.children[0].text).to.equal('a');
    });
    it("should not route '*' on path 'a/'", function() {
      var comp, content;
      comp = route('*', function(match) {
        return 1;
      });
      comp.getPath = function() {
        return 'a/';
      };
      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
    });
    it("should not route '*/' on path 'a'", function() {
      var comp, content;
      comp = route('*/', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a';
      };
      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
    });
    it("should route 'a/b'", function() {
      var comp, content;
      comp = route('a/b', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a/b';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal(1);
    });
    it("should route multi item", function() {
      var comp, content;
      comp = route('a/1', (function() {
        return 1;
      }), 'a/2', function() {
        return 2;
      });
      comp.getPath = function() {
        return 'a/2';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal(2);
    });
    it("should route multi item with otherwise", function() {
      var comp, content;
      comp = route('a/1', (function() {
        return 1;
      }), 'a/2', function() {
        return 2;
      }, txt('otherwise'));
      comp.getPath = function() {
        return 'a/otherwise';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal('otherwise');
    });
    it("should route 'a/**' on path a/b", function() {
      var comp, content;
      comp = route('a/**', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a/b';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal(1);
    });
    it("should route 'a/*/**' on path a/b", function() {
      var comp, content;
      comp = route('a/*/**', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a/b';
      };
      expect(!!(content = comp.getContentComponent())).to.equal(true);
      return expect(content.text).to.equal(1);
    });
    it("should route 'a/*/*/**' on path a/b", function() {
      var comp, content;
      comp = route('a/*/*/**', function() {
        return 1;
      });
      comp.getPath = function() {
        return 'a/b';
      };
      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
    });
    return it("should route embedding route", function() {
      var comp, comp2, content;
      comp = route('a/**', function(match, route2) {
        return route2('b', function() {
          return 2;
        });
      });
      comp.getPath = function() {
        return 'a/b';
      };
      content = comp.getContentComponent();
      content.getPath = function() {
        return 'a/b';
      };
      comp2 = content.getContentComponent();
      expect(!!comp2).to.equal(true);
      return expect(comp2.text).to.equal(2);
    });
  });
  describe('multiple level route', function() {
    var comp;
    comp = route('a/*/**', function(match, route2) {
      return route2(1, (function() {
        return 1;
      }), 2, function() {
        return 2;
      }, 3, function() {
        return 3;
      }, {
        otherwise: 'otherwise 2'
      });
    }, 'b/**', function() {
      return 'b/**';
    }, {
      otherwise: 'otherwise 1'
    });
    it("should route a/b/3", function() {
      var comp2, content;
      comp.getPath = function() {
        return 'a/b/3';
      };
      content = comp.getContentComponent();
      content.getPath = function() {
        return 'a/b/3';
      };
      comp2 = content.getContentComponent();
      expect(!!comp2).to.equal(true);
      return expect(comp2.text).to.equal(3);
    });
    it("should route b/2", function() {
      var content;
      comp.getPath = function() {
        return 'b/2';
      };
      content = comp.getContentComponent();
      expect(!!content).to.equal(true);
      return expect(content.text).to.equal('b/**');
    });
    it("should route not-found", function() {
      var content;
      comp.getPath = function() {
        return 'not-found';
      };
      content = comp.getContentComponent();
      expect(!!content).to.equal(true);
      return expect(content.text).to.equal('otherwise 1');
    });
    return it("should route a/b/no-entry", function() {
      var comp2, content;
      comp.getPath = function() {
        return 'a/b/no-entry';
      };
      content = comp.getContentComponent();
      content.getPath = function() {
        return 'a/b/no-entry';
      };
      comp2 = content.getContentComponent();
      expect(!!comp2).to.equal(true);
      return expect(comp2.text).to.equal('otherwise 2');
    });
  });
  return describe('process route.to', function() {
    it("should route.to", function() {
      expect(route._navigateTo('a/b/c', '../x', 2)).to.equal('a/x');
      expect(route._navigateTo('a/b/c', 'f', 2)).to.equal('a/b/f');
      expect(route._navigateTo('a/b/c', '/f', 2)).to.equal('f');
      expect(route._navigateTo('a/b/c', '/f/', 2)).to.equal('f/');
      return expect(route._navigateTo('a/b/c', './f/', 2)).to.equal('a/b/f/');
    });
    return it("should route.to 2", function() {
      expect(route._navigateTo('a/b/c', '../../f/', 2)).to.equal('f/');
      return expect(route._navigateTo('a/b/c', '../../../f/', 2)).to.equal('f/');
    });
  });
});
