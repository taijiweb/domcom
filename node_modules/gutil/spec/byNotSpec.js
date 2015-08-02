var gutil = require("../lib/gutil");
var byNot = gutil.byNot;

/*
 * - array :
 *   - byNot( [{a:1,b:1},{a:2,b:2}], "a", 1 ) => {a:2,b:2}
 *   - byNot( [{a:1,b:1},{a:2,b:2}], "a", 2 ) => {a:1,b:1}
 *   - byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) => [{o2:{a:2,b:2}}]
 * - object :
 *   - byNot( {o:{a:1,b:1}}, "a", 1 ) => []
 *   - byNot( {o:{a:1,b:1}}, "a", 11 ) => [{a:1,b:1}]
 *   - byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) => []
 *   - byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) => [{o1:{a:1,b:1}},{o2:{a:2,b:2}}]
 */
describe("byNot : ", function() {
    it("byNot in null value", function() {
        // given
        var values = null;
        // when
        var result = byNot(values, 'a', 1);
        // then
        expect(result).toBe(null);
    });
    it("byNot in empty array", function() {
        // given
        var values = [];
        // when
        var result = byNot(values, 'a', 1);
        // then
        expect(result.length).toBe(0);
    });
    it("byNot in empty object", function() {
        // given
        var values = {};
        // when
        var result = byNot(values, 'a', 1);
        // then
        expect(result.length).toBe(0);
    });
    it("byNot( [{a:1,b:1},{a:2,b:2}], \"a\", 1 )", function() {
        // given
        var values = [{a:1,b:1},{a:2,b:2}];
        // when
        var result = byNot( values, "a", 1 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["a"]).toBe(2);
        expect(result[0]["b"]).toBe(2);
    });
    it("byNot( [{a:1,b:1},{a:2,b:2}], \"a\", 2 )", function() {
        // given
        var values = [{a:1,b:1},{a:2,b:2}];
        // when
        var result = byNot( values, "a", 2 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["a"]).toBe(1);
        expect(result[0]["b"]).toBe(1);
    });
    it("byNot( [{a:1,b:1},{a:2,b:2}], \"a\", 11 )", function() {
        // given
        var values = [{a:1,b:1},{a:2,b:2}];
        // when
        var result = byNot( values, "a", 11 );
        // then
        expect(result.length).toBe(2);
        expect(result[0]["a"]).toBe(1);
        expect(result[0]["b"]).toBe(1);
        expect(result[1]["a"]).toBe(2);
        expect(result[1]["b"]).toBe(2);
    });
    it("byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], \"o1.a\", 1 )", function() {
        // given
        var values = [{o1:{a:1,b:1}},{o2:{a:2,b:2}}];
        // when
        var result = byNot( values, "o1.a", 1 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["o2"]["a"]).toBe(2);
        expect(result[0]["o2"]["b"]).toBe(2);
    });
    it("byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], \"o1.a\", 11 )", function() {
        // given
        var values = [{o1:{a:1,b:1}},{o2:{a:2,b:2}}];
        // when
        var result = byNot( values, "o1.a", 11 );
        // then
        expect(result.length).toBe(2);
        expect(result[0]["o1"]["a"]).toBe(1);
        expect(result[0]["o1"]["b"]).toBe(1);
        expect(result[1]["o2"]["a"]).toBe(2);
        expect(result[1]["o2"]["b"]).toBe(2);
    });
    it("byNot( {o:{a:1,b:1}}, \"a\", 1 )", function() {
        // given
        var values = {o:{a:1,b:1}};
        // when
        var result = byNot( values, "a", 1 );
        // then
        expect(result.length).toBe(0);
    });
    it("byNot( {o:{a:1,b:1}}, \"a\", 11 )", function() {
        // given
        var values = {o:{a:1,b:1}};
        // when
        var result = byNot( values, "a", 11 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["a"]).toBe(1);
        expect(result[0]["b"]).toBe(1);
    });
    it("byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}} \"o1.a\", 1 )", function() {
        // given
        var values = {o:{o1:{a:1,b:1},o2:{a:2,b:2}}};
        // when
        var result = byNot( values, "o1.a", 1 );
        // then
        expect(result.length).toBe(0);
    });
    it("byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, \"o1.a\", 11 )", function() {
        // given
        var values = {o:{o1:{a:1,b:1},o2:{a:2,b:2}}};
        // when
        var result = byNot( values, "o1.a", 11 );
        // then
        expect(result.length).toBe(1);
        expect(result[0]["o1"]["a"]).toBe(1);
        expect(result[0]["o1"]["b"]).toBe(1);
        expect(result[0]["o2"]["a"]).toBe(2);
        expect(result[0]["o2"]["b"]).toBe(2);
    });
});