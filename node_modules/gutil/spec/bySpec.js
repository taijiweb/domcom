var gutil = require("../lib/gutil");
var by = gutil.by;

/*
 * - array :
 *   - by( [{a:1,b:1},{a:2,b:2}], "a", 1 ) => [{a:1,b:1}]
 *   - by( [{a:1,b:1},{a:2,b:2}], "a", 11 ) => []
 *   - by( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) => [{o1:{a:1,b:1}}]
 *   - by( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 11 ) => [{o1:{a:1,b:1}}]
 * - object :
 *   - by( {o:{a:1,b:1}}, "a", 1 ) => [{a:1,b:1}]
 *   - by( {o:{a:1,b:1}}, "a", 11 ) => []
 *   - by( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) => [{o1:{a:1,b:1}}]
 *   - by( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) => []
 */
describe("by : ", function() {
    it("by in null value", function() {
        // given
        var values = null;
        // when
        var result = by(values, 'a', 1);
        // then
        expect(result).toBe(null);
    });
    it("by in empty array", function() {
        // given
        var values = [];
        // when
        var result = by(values, 'a', 1);
        // then
        expect(result.length).toBe(0);
    });
    it("by in empty object", function() {
        // given
        var values = {};
        // when
        var result = by(values, 'a', 1);
        // then
        expect(result.length).toBe(0);
    });
    it("by( [{a:1,b:1},{a:2,b:2}], \"a\", 1 )", function() {
        // given
        var values = [{a:1,b:1},{a:2,b:2}];
        // when
        var result = by( values, "a", 1 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["a"]).toBe(1);
        expect(result[0]["b"]).toBe(1);
    });
    it("by( [{a:1,b:1},{a:2,b:2}], \"a\", 11 )", function() {
        // given
        var values = [{a:1,b:1},{a:2,b:2}];
        // when
        var result = by( values, "a", 11 );
        // then
        expect(result.length).toBe(0);
    });
    it("by( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], \"o1.a\", 1 )", function() {
        // given
        var values = [{o1:{a:1,b:1}},{o2:{a:2,b:2}}];
        // when
        var result = by( values, "o1.a", 1 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["o1"]["a"]).toBe(1);
        expect(result[0]["o1"]["b"]).toBe(1);
    });
    it("by( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], \"o1.a\", 11 )", function() {
        // given
        var values = [{o1:{a:1,b:1}},{o2:{a:2,b:2}}];
        // when
        var result = by( values, "o1.a", 11 );
        // then
        expect(result.length).toBe(0);
    });
    it("by( {o:{a:1,b:1}}, \"a\", 1 )", function() {
        // given
        var values = {o:{a:1,b:1}};
        // when
        var result = by( values, "a", 1 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["a"]).toBe(1);
        expect(result[0]["b"]).toBe(1);
    });
    it("by( {o:{a:1,b:1}}, \"a\", 11 )", function() {
        // given
        var values = {o:{a:1,b:1}};
        // when
        var result = by( values, "a", 11 );
        // then
        expect(result.length).toBe(0);
    });
    it("by( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, \"o1.a\", 1 )", function() {
        // given
        var values = {o:{o1:{a:1,b:1},o2:{a:2,b:2}}};
        // when
        var result = by( values, "o1.a", 1 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["o1"]["a"]).toBe(1);
        expect(result[0]["o1"]["b"]).toBe(1);
        expect(result[0]["o2"]["a"]).toBe(2);
        expect(result[0]["o2"]["b"]).toBe(2);
    });
    it("by( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, \"o1.a\", 11 )", function() {
        // given
        var values = {o:{o1:{a:1,b:1},o2:{a:2,b:2}}};
        // when
        var result = by( values, "o1.a", 11 );
        // then
        expect(result.length).toBe(0);
    });
});