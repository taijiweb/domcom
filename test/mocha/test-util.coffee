{expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper')

{binarySearch, binaryInsert} = dc

describe 'util', ->
  describe 'binarySearch', ->
    it 'should binarySearch(0, [])', ->
      expect(binarySearch(0, [])).to.deep.equal 0
    it 'should binarySearch(0, [0])', ->
      expect(binarySearch(0, [0])).to.deep.equal 0
    it 'should binarySearch(0, [1])', ->
      expect(binarySearch(0, [1])).to.deep.equal 0
    it 'should binarySearch(1, [1 2])', ->
      expect(binarySearch(1, [1, 2])).to.deep.equal 0
    it 'should binarySearch(2, [1 2])', ->
      expect(binarySearch(2, [1, 2])).to.deep.equal 1
    it 'should binarySearch(2, [1 3])', ->
      expect(binarySearch(2, [1, 3])).to.deep.equal 1
    it 'should binarySearch(2, [1 2 3])', ->
      expect(binarySearch(2, [1, 2, 3])).to.deep.equal 1
    it 'should binarySearch(2, [1 2 3 4])', ->
      expect(binarySearch(2, [1, 2, 3, 4])).to.deep.equal 1
    it 'should binarySearch(2, [1 2 4 5])', ->
      expect(binarySearch(3, [1, 2, 4, 5])).to.deep.equal 2
    it 'should binarySearch(2, [1 2 4 5])', ->
      expect(binarySearch(4, [1, 2, 4, 5])).to.deep.equal 2
    it 'should binarySearch(2, [1 2 4 5 6])', ->
      expect(binarySearch(4, [1, 2, 4, 5, 6])).to.deep.equal 2

  describe 'binaryInsert', ->
    it 'should binaryInsert(0, [])', ->
      binaryInsert(0, items=[])
      expect(items).to.deep.equal [0]
    it 'should binaryInsert(0, [0])', ->
      binaryInsert(0, items=[0])
      expect(items).to.deep.equal [0]
    it 'should binaryInsert(0, [1])', ->
      binaryInsert(0, items=[1])
      expect(items).to.deep.equal [0, 1]
    it 'should binaryInsert(1, [1 2])', ->
      binaryInsert(1, items=[1, 2])
      expect(items).to.deep.equal [1, 2]
    it 'should binaryInsert(2, [1 2])', ->
      binaryInsert(2, items=[1, 2])
      expect(items).to.deep.equal [1, 2]
    it 'should binaryInsert(2, [1 3])', ->
      binaryInsert(2, items=[1, 3])
      expect(items).to.deep.equal [1, 2, 3]
    it 'should binaryInsert(2, [1 2 3])', ->
      binaryInsert(2, items=[1, 2, 3])
      expect(items).to.deep.equal [1, 2, 3]
    it 'should binaryInsert(2, [1 2 3 4])', ->
      binaryInsert(2, items=[1, 2, 3, 4])
      expect(items).to.deep.equal [1, 2, 3, 4]
    it 'should binaryInsert(2, [1 2 4 5])', ->
      binaryInsert(3, items=[1, 2, 4, 5])
      expect(items).to.deep.equal [1, 2, 3, 4, 5]
    it 'should binaryInsert(2, [1 2 4 5])', ->
      binaryInsert(4, items=[1, 2, 4, 5])
      expect(items).to.deep.equal [1, 2, 4, 5]
    it 'should binaryInsert(2, [1 2 4 5 6])', ->
      binaryInsert(4, items=[1, 2, 4, 5, 6])
      expect(items).to.deep.equal [1, 2, 4, 5, 6]
      