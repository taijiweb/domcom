var gutil = require("../lib/gutil");
var sort = gutil.sort;

describe("sort : ", function() {
    it("null", function() {
        // given
        var values = null;
        // when
        var results = sort(values);
        // then
        expect(results).toBe(null);
    });
    it("empty", function() {
        // given
        var values = [];
        // when
        var results = sort(values);
        // then
        expect(results.length).toBe(0);
    });
    it("four elements", function() {
        // given
        var values = ['c','a','d','b'];
        // when
        var results = sort(values);
        // then
        expect(results.length).toBe(4);
        expect(results[0]).toBe('a');
        expect(results[1]).toBe('b');
        expect(results[2]).toBe('c');
        expect(results[3]).toBe('d');
    });
});