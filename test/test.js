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
    new Collection([{id: 1}, {id: 2}, {id: 3}]).records
    .should.containDeepOrdered([{id: 1}, {id: 2}, {id: 3}]);
  });
});

describe('recordMapper', () => {
  it('maps records', () => {
    class Foo {
      constructor(body) {
        this.id = body.id * 3;
      }
    }

    class FooCollection extends Collection {
      constructor(records) {
        super();

        this.recordMapper = foo => new Foo(foo);
        this.inject(records);
      }
    }

    const coll = new FooCollection([{id: 1}, {id: 2}, {id: 3}]);

    coll.records.slice().should.be.lengthOf(3);
    coll.records.slice()[0].should.be.instanceOf(Foo);
    coll.records.slice()[0].should.have.property('id', 3);
    coll.records.slice()[1].should.be.instanceOf(Foo);
    coll.records.slice()[1].should.have.property('id', 6);
    coll.records.slice()[2].should.be.instanceOf(Foo);
    coll.records.slice()[2].should.have.property('id', 9);
  });
});

describe('get', () => {
  describe('with ID', () => {
    it('returns single record', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.get(2).should.containDeepOrdered({id: 2});
    });
  });

  describe('with array of IDs', () => {
    it('returns many records', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.get([2, 1]).should.containDeepOrdered([{id: 1}, {id: 2}]);
    });
  });
});

describe('filter', () => {
  it('returns array of records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.filter(r => [2, 1].includes(r.id)).should.containDeepOrdered([{id: 1}, {id: 2}]);
  });
});

describe('find', () => {
  it('returns record', () => {
    it('returns array of records', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.find({id: 2}).should.containDeepOrdered({id: 2});
    });
  });
});

// uses external library
describe('inject', () => {
  // it('injects single record', () => {
  //   const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

  //   coll.inject({id: 4});
  //   coll.inject({id: 2, name: 'foo'});
  //   coll.records.should.containDeepOrdered([{id: 1}, {id: 2, name: 'foo'}, {id: 3}, {id: 4}]);
  // });

  // it('injects many records', () => {
  //   const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

  //   coll.inject([{id: 4}, {id: 2, name: 'foo'}]);
  //   coll.records.should.containDeepOrdered([{id: 1}, {id: 2, name: 'foo'}, {id: 3}, {id: 4}]);
  // });

  // it('returns object with inserted and updated records IDs', () => {
  //   const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

  //   coll.inject([{id: 4}, {id: 2, name: 'foo'}]).should.containDeepOrdered({
  //     inserted: [4],
  //     updated: [2],
  //   });
  // });
});

describe('eject', () => {
  describe('with ID', () => {
    it('removes single record', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.eject(2);

      coll.records.should.containDeepOrdered([{id: 1}, {id: 3}]);
    });

    it('returns removed record', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.eject(2).should.containDeepOrdered({id: 2});
    });
  });

  describe('with array of IDs', () => {
    it('removes many records', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.eject([2, 3]);

      coll.records.should.containDeepOrdered([{id: 1}]);
    });

    it('returns removed records', () => {
      const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

      coll.eject([2, 3]).should.containDeepOrdered([{id: 2}, {id: 3}]);
    });
  });
});

describe('clear', () => {
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

describe('replace', () => {
  it('removes all records and adds new records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.replace({id: 4})

    coll.records.should.containDeepOrdered([{id: 4}]);
  });

  it('returns number of removed records', () => {
    const coll = new Collection([{id: 1}, {id: 2}, {id: 3}]);

    coll.replace({id: 4}).should.equal(3);
  });
});