{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{binarySearch} = dc

describe 'util', ->
  describe 'binarySearch', ->
    it 'should binarySearch(0, [])', ->
      expect(binarySearch(0, [])).to.equal -1
    it 'should binarySearch(0, [0])', ->
      expect(binarySearch(0, [0])).to.equal 0
    it 'should binarySearch(0, [1])', ->
      expect(binarySearch(0, [1])).to.equal -1
    it 'should binarySearch(1, [1 2])', ->
      expect(binarySearch(1, [1, 2])).to.equal 0
    it 'should binarySearch(2, [1 2])', ->
      expect(binarySearch(2, [1, 2])).to.equal 1
    it 'should binarySearch(2, [1 3])', ->
      expect(binarySearch(2, [1, 3])).to.equal 0
    it 'should binarySearch(2, [1 2 3])', ->
      expect(binarySearch(2, [1, 2, 3])).to.equal 1
    it 'should binarySearch(2, [1 2 3 4])', ->
      expect(binarySearch(2, [1, 2, 3, 4])).to.equal 1
    it 'should binarySearch(2, [1 2 4 5])', ->
      expect(binarySearch(3, [1, 2, 4, 5])).to.equal 1
    it 'should binarySearch(2, [1 2 4 5])', ->
      expect(binarySearch(4, [1, 2, 4, 5])).to.equal 2
    it 'should binarySearch(2, [1 2 4 5 6])', ->
      expect(binarySearch(4, [1, 2, 4, 5, 6])).to.equal 2
