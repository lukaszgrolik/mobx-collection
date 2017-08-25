import _find = require('lodash/find');
import _filter = require('lodash/filter');
import _reduce = require('lodash/reduce');
import _remove = require('lodash/remove');
import _includes = require('lodash/includes');
import {observable, action} from 'mobx';
import mergeItems from 'merge-items';

const _ = {
  find: _find,
  filter: _filter,
  reduce: _reduce,
  remove: _remove,
  includes: _includes,
};

type TId = number | string;

class MobxCollection<TBody = {}, TItem = TBody> {
  @observable records: TItem[] = [];
  primaryKey = 'id';

  constructor(recordArg?: TBody | TBody[]) {
    if (recordArg) {
      if (recordArg instanceof Array) {
        this.upsert(recordArg);
      } else {
        this.upsert(recordArg);
      }
    }
  }

  get(idArg: TId[]): TItem[]
  get(idArg: TId): TItem | undefined
  get(idArg: TId[] | TId): TItem[] | TItem | undefined {
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

  upsert(recordArg: TBody[]): TItem[]
  upsert(recordArg: TBody): TItem
  @action upsert(recordArg: TBody[] | TBody): TItem[] | TItem {
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

  remove(idArg: TId[]): TItem[]
  remove(idArg: TId): TItem | undefined
  @action remove(idArg: TId[] | TId): TItem[] | TItem | undefined {
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

  @action clear(): number {
    const n = this.records.length;

    this.records.length = 0;

    return n;
  }

  @action replace(recordArg: TBody | TBody[]): number {
    const result = this.clear();

    if (recordArg instanceof Array) {
      this.upsert(recordArg);
    } else {
      this.upsert(recordArg);
    }

    return result;
  }
}

export default MobxCollection