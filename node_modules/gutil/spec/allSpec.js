var gutil = require("../lib/gutil");
var all = gutil.all;
/*
describe("all : ", function() {
    it("all in empty array", function() {
        // given
        var values = [];
        // when
        all(values, 'a');
        // then
        expect(values.length).toBe(1);
        expect(values[0]).toBe('a');
    });
    it("all without pos", function() {
        // given
        var values = ['a','b','c'];
        // when
        all(values, 'd');
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("all after the end", function() {
        // given
        var values = ['a','b','c'];
        // when
        all(values, 'd', 4);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("all at the end", function() {
        // given
        var values = ['a','b','c'];
        // when
        all(values, 'd', 3);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("all in middle", function() {
        // given
        var values = ['a','c','d'];
        // when
        all(values, 'b', 1);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("all at the beginning", function() {
        // given
        var values = ['b','c','d'];
        // when
        all(values, 'a', 0);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("all before the beginning", function() {
        // given
        var values = ['a','b','c','d'];
        // when
        all(values, 'p', -1);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
});
    */