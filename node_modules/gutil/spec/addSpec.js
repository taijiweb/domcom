var gutil = require("../lib/gutil");
var add = gutil.add;

describe("add : ", function() {
    it("add in empty array", function() {
        // given
        var values = [];
        // when
        add(values, 'a');
        // then
        expect(values.length).toBe(1);
        expect(values[0]).toBe('a');
    });
    it("add without pos", function() {
        // given
        var values = ['a','b','c'];
        // when
        add(values, 'd');
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("add after the end", function() {
        // given
        var values = ['a','b','c'];
        // when
        add(values, 'd', 4);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("add at the end", function() {
        // given
        var values = ['a','b','c'];
        // when
        add(values, 'd', 3);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("add in middle", function() {
        // given
        var values = ['a','c','d'];
        // when
        add(values, 'b', 1);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("add at the beginning", function() {
        // given
        var values = ['b','c','d'];
        // when
        add(values, 'a', 0);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
    it("add before the beginning", function() {
        // given
        var values = ['a','b','c','d'];
        // when
        add(values, 'p', -1);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
});