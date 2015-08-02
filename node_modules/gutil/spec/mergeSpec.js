var merge = require("../lib/util/merge");

describe("difference : ", function() {
    it("abc -> azc", function() {
        // given
        var c1 = "abc";
        var c2 = "azc";
        // when
        var diffs = difference(c1,c2);
        // then
        expect(diffs.length).toBe(1);
        expect(diffs[0].oldBegin).toBe(1);
        expect(diffs[0].oldEnd).toBe(2);
        expect(diffs[0].oldTxt).toBe("b");
        expect(diffs[0].newBegin).toBe(1);
        expect(diffs[0].newEnd).toBe(2);
        expect(diffs[0].newTxt).toBe("z");
    });
    it("abcde -> azcze", function() {
        // given
        var c1 = "abcde";
        var c2 = "azcze";
        // when
        var diffs = difference(c1,c2);
        // then
        expect(diffs.length).toBe(2);
        expect(diffs[0].oldBegin).toBe(1);
        expect(diffs[0].oldEnd).toBe(2);
        expect(diffs[0].oldTxt).toBe("b");
        expect(diffs[0].newBegin).toBe(1);
        expect(diffs[0].newEnd).toBe(2);
        expect(diffs[0].newTxt).toBe("z");
    });
    it("abcde -> acze", function() {
        // given
        var c1 = "abcde";
        var c2 = "acze";
        // when
        var diffs = difference(c1,c2);
        // then
        expect(diffs.length).toBe(2);
        expect(diffs[0].oldBegin).toBe(1);
        expect(diffs[0].oldEnd).toBe(2);
        expect(diffs[0].oldTxt).toBe("b");
        expect(diffs[0].newBegin).toBe(1);
        expect(diffs[0].newEnd).toBe(2);
        expect(diffs[0].newTxt).toBe("z");
    });
});

describe("merge : ", function() {
    it("merge", function() {
        // given
        var oldContent = "old";
        var newContent = "new";
        var currentContent = "current";
        // when
        var result = merge(oldContent, newContent, currentContent);
        // then
        expect(result).toBe("current");
    });
});