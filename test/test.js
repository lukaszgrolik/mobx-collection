const should = require('should');
const {isObservableArray} = require('mobx');

const Collection = require('../dist/mobx-collection' + (process.env.NODE_ENV === 'production' ? '.min' : ''));

describe('constructor', () => {
  it('contains observable records array', () => {
    isObservableArray(new Collection().records).should.equal(true);
  });

  it('contains primaryKey property', () => {
    new Collection().primaryKey.should.equal('id') ;
  });

  it('adds records', () => {
    new Collection([{id: 1}, {id: 2}, {id: 3}]).records.slice()
    .should.eql([{id: 1}, {id: 2}, {id: 3}]);
  });
});

describe('"get" method', () => {
  it('returns single record when single ID given', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.get(2).should.eql({id: 2});
  });

  it('returns array of records when array of IDs given', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.get([2, 1]).should.eql([
      {id: 2},
      {id: 1},
    ]);
  });

  it('uses weak ID comparison', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.get('1').should.eql({id: 1});
    coll.get(['2', '1']).should.eql([
      {id: 2},
      {id: 1},
    ]);
  });

  it('returns items in the same sequence as given IDs', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.get([2, 1]).should.eql([
      {id: 2},
      {id: 1},
    ]);
  });
});

describe('"filter" method', () => {
  it('returns array of records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.filter(r => [2, 1].includes(r.id)).should.eql([{id: 1}, {id: 2}]);
  });
});

describe('"find" method', () => {
  it('returns record', () => {
    it('returns array of records', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.find({id: 2}).should.eql({id: 2});
    });
  });
});

describe('"upsert" method', () => {
  it('upserts single record', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.upsert({id: 4});
    coll.upsert({id: 2, name: 'foo'});

    coll.records.slice().should.eql([
      {id: 1},
      {id: 2, name: 'foo'},
      {id: 3},
      {id: 4},
    ]);
  });

  it('upserts many records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.upsert([
      {id: 4},
      {id: 2, name: 'foo'},
    ]);

    coll.records.slice().should.eql([
      {id: 1},
      {id: 2, name: 'foo'},
      {id: 3},
      {id: 4},
    ]);
  });

  it('returns object with inserted and updated records IDs', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);
    const res = coll.upsert([
      {id: 4},
      {id: 2, name: 'foo'},
    ]);

    res.should.eql([
      {id: 4},
      {id: 2, name: 'foo'},
    ]);
  });
});

describe('"remove" method', () => {
  it('removes single record when single ID given', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.remove(2);

    coll.records.slice().should.eql([{id: 1}, {id: 3}]);
  });

  it('returns removed record when single ID given', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.remove(2).should.eql({id: 2});
  });

  it('removes many records when array of IDs given', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.remove([2, 3]);

    coll.records.slice().should.eql([{id: 1}]);
  });

  it('returns array of removed records when array of IDs given', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.remove([2, 3]).should.eql([{id: 2}, {id: 3}]);
  });
});

describe('"clear" method', () => {
  it('removes all records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.clear();
    coll.records.should.be.lengthOf(0);
  });

  it('returns number of removed records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.clear().should.equal(3);
  });
});

describe('"replace" method', () => {
  it('removes all records and adds new records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.replace({id: 4})

    coll.records.slice().should.eql([{id: 4}]);
  });

  it('returns number of removed records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.replace({id: 4}).should.equal(3);
  });
});