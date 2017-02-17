import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _reduce from 'lodash/reduce';
import _remove from 'lodash/remove';
import _includes from 'lodash/includes';
import {observable, action} from 'mobx';
import mergeItems from 'merge-items';

const _ = {
  find: _find,
  filter: _filter,
  reduce: _reduce,
  remove: _remove,
  includes: _includes,
};

export default class Collection {
  @observable records = [];
  primaryKey = 'id';

  constructor(recordArg) {
    if (recordArg) {
      this.upsert(recordArg);
    }
  }

  get(idArg) {
    if (idArg instanceof Array) {
      return _.reduce(idArg, (memo, id) => {
        const record = _.find(this.records, record => {
          return record[this.primaryKey] == id;
        });

        if (record) {
          memo.push(record);
        }

        return memo;
      }, []);
    } else {
      return _.find(this.records, record => {
        return record[this.primaryKey] == idArg;
      });
    }
  }

  filter(predicate) {
    return _.filter(this.records, predicate);
  }

  find(predicate) {
    return _.find(this.records, predicate);
  }

  @action upsert(recordArg) {
    const callbacks = [
      'mapInsert',
      'mapUpdate',
      'mapUpsert',
      'afterInsert',
      'afterUpdate',
      'afterUpsert',
    ];
    const opts = {
      primaryKey: this.primaryKey,
      ..._.reduce(callbacks, (memo, cb) => {
        if (typeof this[cb] === 'function') {
          memo[cb] = this[cb]
        }

        return memo;
      }, {}),
    };

    return mergeItems(this.records, recordArg, opts);
  }

  @action remove(idArg) {
    const ids = idArg instanceof Array ? idArg : [idArg];
    const result = _.remove(this.records, record => {
      return _.includes(ids, record[this.primaryKey]);
    });

    if (idArg instanceof Array) {
      return result;
    } else {
      return result[0];
    }
  }

  @action clear() {
    const n = this.records.length;

    this.records.length = 0;

    return n;
  }

  @action replace(recordArg) {
    const result = this.clear();

    this.upsert(recordArg);

    return result;
  }
};