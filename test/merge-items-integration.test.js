const should = require('should');

const Collection = require('../dist/mobx-collection' + (process.env.NODE_ENV === 'production' ? '.min' : ''));

describe('merge-items integration', () => {
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

    it('returns upserted records', () => {
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

  describe('"mapInsert" option', () => {
    it('maps records', () => {
      class Foo {
        constructor(body) {
          this.id = body.id;
          this.a = body.id * 3;
        }
      }

      class FooCollection extends Collection {
        constructor(records) {
          super();

          this.mapInsert = foo => new Foo(foo);
          this.upsert(records);
        }
      }

      const coll = new FooCollection([{id: 1}, {id: 2}, {id: 3}]);

      coll.records.slice().should.be.lengthOf(3);
      coll.records.slice()[0].should.be.instanceOf(Foo);
      coll.records.slice()[1].should.be.instanceOf(Foo);
      coll.records.slice()[2].should.be.instanceOf(Foo);
      coll.records.slice()[0].should.have.property('a', 3);
      coll.records.slice()[1].should.have.property('a', 6);
      coll.records.slice()[2].should.have.property('a', 9);
    });
  });

  describe('"afterUpsert" option', () => {

  });
});