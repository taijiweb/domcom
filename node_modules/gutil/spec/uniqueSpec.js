var gutil = require("../lib/gutil");
var unique = gutil.unique;

describe("unique : ", function() {
    it("null", function() {
        // given
        var values = null;
        // when
        var results = unique(values);
        // then
        expect(results).toBe(null);
    });
    it("empty", function() {
        // given
        var values = [];
        // when
        var results = unique(values);
        // then
        expect(results.length).toBe(0);
    });
    it("four elements", function() {
        // given
        var values = ['c','a','d','b'];
        // when
        var results = unique(values);
        // then
        expect(results.length).toBe(4);
        expect(results[0]).toBe('c');
        expect(results[1]).toBe('a');
        expect(results[2]).toBe('d');
        expect(results[3]).toBe('b');
    });
    it("duplicate elements", function() {
        // given
        var values = ['c','a','c','a'];
        // when
        var results = unique(values);
        // then
        expect(results.length).toBe(2);
        expect(results[0]).toBe('c');
        expect(results[1]).toBe('a');
    });
});