var binaryInsert, binarySearch, expect, idescribe, iit, ndescribe, nit, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

binarySearch = dc.binarySearch, binaryInsert = dc.binaryInsert;

describe('util', function() {
  describe('binarySearch', function() {
    it('should binarySearch(0, [])', function() {
      return expect(binarySearch(0, [])).to.deep.equal(0);
    });
    it('should binarySearch(0, [0])', function() {
      return expect(binarySearch(0, [0])).to.deep.equal(0);
    });
    it('should binarySearch(0, [1])', function() {
      return expect(binarySearch(0, [1])).to.deep.equal(0);
    });
    it('should binarySearch(1, [1 2])', function() {
      return expect(binarySearch(1, [1, 2])).to.deep.equal(0);
    });
    it('should binarySearch(2, [1 2])', function() {
      return expect(binarySearch(2, [1, 2])).to.deep.equal(1);
    });
    it('should binarySearch(2, [1 3])', function() {
      return expect(binarySearch(2, [1, 3])).to.deep.equal(1);
    });
    it('should binarySearch(2, [1 2 3])', function() {
      return expect(binarySearch(2, [1, 2, 3])).to.deep.equal(1);
    });
    it('should binarySearch(2, [1 2 3 4])', function() {
      return expect(binarySearch(2, [1, 2, 3, 4])).to.deep.equal(1);
    });
    it('should binarySearch(2, [1 2 4 5])', function() {
      return expect(binarySearch(3, [1, 2, 4, 5])).to.deep.equal(2);
    });
    it('should binarySearch(2, [1 2 4 5])', function() {
      return expect(binarySearch(4, [1, 2, 4, 5])).to.deep.equal(2);
    });
    return it('should binarySearch(2, [1 2 4 5 6])', function() {
      return expect(binarySearch(4, [1, 2, 4, 5, 6])).to.deep.equal(2);
    });
  });
  return describe('binaryInsert', function() {
    it('should binaryInsert(0, [])', function() {
      var items;
      binaryInsert(0, items = []);
      return expect(items).to.deep.equal([0]);
    });
    it('should binaryInsert(0, [0])', function() {
      var items;
      binaryInsert(0, items = [0]);
      return expect(items).to.deep.equal([0]);
    });
    it('should binaryInsert(0, [1])', function() {
      var items;
      binaryInsert(0, items = [1]);
      return expect(items).to.deep.equal([0, 1]);
    });
    it('should binaryInsert(1, [1 2])', function() {
      var items;
      binaryInsert(1, items = [1, 2]);
      return expect(items).to.deep.equal([1, 2]);
    });
    it('should binaryInsert(2, [1 2])', function() {
      var items;
      binaryInsert(2, items = [1, 2]);
      return expect(items).to.deep.equal([1, 2]);
    });
    it('should binaryInsert(2, [1 3])', function() {
      var items;
      binaryInsert(2, items = [1, 3]);
      return expect(items).to.deep.equal([1, 2, 3]);
    });
    it('should binaryInsert(2, [1 2 3])', function() {
      var items;
      binaryInsert(2, items = [1, 2, 3]);
      return expect(items).to.deep.equal([1, 2, 3]);
    });
    it('should binaryInsert(2, [1 2 3 4])', function() {
      var items;
      binaryInsert(2, items = [1, 2, 3, 4]);
      return expect(items).to.deep.equal([1, 2, 3, 4]);
    });
    it('should binaryInsert(2, [1 2 4 5])', function() {
      var items;
      binaryInsert(3, items = [1, 2, 4, 5]);
      return expect(items).to.deep.equal([1, 2, 3, 4, 5]);
    });
    it('should binaryInsert(2, [1 2 4 5])', function() {
      var items;
      binaryInsert(4, items = [1, 2, 4, 5]);
      return expect(items).to.deep.equal([1, 2, 4, 5]);
    });
    return it('should binaryInsert(2, [1 2 4 5 6])', function() {
      var items;
      binaryInsert(4, items = [1, 2, 4, 5, 6]);
      return expect(items).to.deep.equal([1, 2, 4, 5, 6]);
    });
  });
});
