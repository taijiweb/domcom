var gutil = require("../lib/gutil");
var addAll = gutil.addAll;

describe("add : ", function() {
    it("add in empty array", function() {
        // given
        var values = [];
        // when
        addAll(values, ['a']);
        // then
        expect(values.length).toBe(1);
        expect(values[0]).toBe('a');
    });
    it("add without pos", function() {
        // given
        var values = ['a','b','c'];
        // when
        addAll(values, ['d']);
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
        addAll(values, ['d'], 4);
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
        addAll(values, ['d'], 3);
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
        addAll(values, ['b'], 1);
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
        addAll(values, ['a'], 0);
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
        addAll(values, ['p'], -1);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });

    // add many values

    it("addAll without pos", function() {
        // given
        var values = ['a','b','c'];
        // when
        addAll(values, ['d','e','f']);
        // then
        expect(values.length).toBe(6);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
        expect(values[4]).toBe('e');
        expect(values[5]).toBe('f');
    });
    it("addAll after the end", function() {
        // given
        var values = ['a','b','c'];
        // when
        addAll(values, ['d','e','f'], 4);
        // then
        expect(values.length).toBe(6);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
        expect(values[4]).toBe('e');
        expect(values[5]).toBe('f');
    });
    it("addAll at the end", function() {
        // given
        var values = ['a','b','c'];
        // when
        addAll(values, ['d','e','f'], 3);
        // then
        expect(values.length).toBe(6);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
        expect(values[4]).toBe('e');
        expect(values[5]).toBe('f');
    });
    it("add in middle", function() {
        // given
        var values = ['a','e','f'];
        // when
        addAll(values, ['b','c','d'], 1);
        // then
        expect(values.length).toBe(6);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
        expect(values[4]).toBe('e');
        expect(values[5]).toBe('f');
    });
    it("addAll at the beginning", function() {
        // given
        var values = ['d','e','f'];
        // when
        addAll(values, ['a','b','c'], 0);
        // then
        expect(values.length).toBe(6);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
        expect(values[4]).toBe('e');
        expect(values[5]).toBe('f');
    });
    it("addAll before the beginning", function() {
        // given
        var values = ['a','b','c','d'];
        // when
        addAll(values, ['p','q','r'], -1);
        // then
        expect(values.length).toBe(4);
        expect(values[0]).toBe('a');
        expect(values[1]).toBe('b');
        expect(values[2]).toBe('c');
        expect(values[3]).toBe('d');
    });
});