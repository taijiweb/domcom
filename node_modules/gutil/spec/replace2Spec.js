var gutil = require("../lib/gutil");
var replace2 = gutil.replace2;

describe("replace2 : ", function() {
    it("null", function() {
        // given
        var txt = null;
        var oldValues = null;
        var newValues = null;
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe(null);
    });
    it("empty", function() {
        // given
        var txt = "";
        var oldValues = [];
        var newValues = [];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("");
    });
    it("no replace", function() {
        // given
        var txt = "simple text";
        var oldValues = [];
        var newValues = [];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("simple text");
    });
    it("simple replace", function() {
        // given
        var txt = "simple text";
        var oldValues = ["simple"];
        var newValues = ["hello"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("hello text");
    });
    it("too short", function() {
        // given
        var txt = "simpl";
        var oldValues = ["simple"];
        var newValues = ["hello"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("simpl");
    });
    it("all simple replace", function() {
        // given
        var txt = "simple";
        var oldValues = ["simple"];
        var newValues = ["hello"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("hello");
    });
    it("no simple replace", function() {
        // given
        var txt = "siMple";
        var oldValues = ["simple"];
        var newValues = ["hello"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("siMple");
    });
    it("two replace", function() {
        // given
        var txt = "simple text";
        var oldValues = ["simple","text"];
        var newValues = ["hello","world"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("hello world");
    });
    it("conflict replace - 1", function() {
        // given
        var txt = "simple text";
        var oldValues = ["simple text","simple"];
        var newValues = ["hello world","hello"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("hello world");
    });
    it("conflict replace - 2", function() {
        // given
        var txt = "simple text";
        var oldValues = ["simple","simple text"];
        var newValues = ["hello","hello world"];
        // when
        var result = replace2(txt, oldValues, newValues);
        // then
        expect(result).toBe("hello world");
    });
});