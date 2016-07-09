import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _some from 'lodash/some';
import _each from 'lodash/each';
import _remove from 'lodash/remove';
import _includes from 'lodash/includes';
import customError from 'custom-error';
import {observable, action} from 'mobx';
import mergeItems from 'merge-items';

const _ = {
  find: _find,
  filter: _filter,
  some: _some,
  each: _each,
  remove: _remove,
  includes: _includes,
};

const isInvalidIdArgument = arg => {
  if (arg instanceof Array) {
    return _.some(arg, isInvalidIdArgument);
  } else {
    return _.includes(['number', 'string'], typeof arg) === false;
  }
};

export default class Collection {
  static InvalidIdArgumentError = customError('InvalidIdArgumentError');

  @observable records = [];
  primaryKey = 'id';

  constructor(recordArg) {
    if (recordArg) {
      this.inject(recordArg);
    }
  }

  get(idArg) {
    if (isInvalidIdArgument(idArg)) {
      throw new this.constructor.InvalidIdArgumentError('Either number, string or array of numbers or strings required');
    }

    if (idArg instanceof Array) {
      return _.filter(this.records, record => {
        return _.includes(idArg, record[this.primaryKey]);
      });
    } else {
      return _.find(this.records, {[this.primaryKey]: idArg});
    }
  }

  filter(predicate) {
    return _.filter(this.records, predicate);
  }

  find(predicate) {
    return _.find(this.records, predicate);
  }

  @action inject(recordArg) {
    const opts = {
      primaryKey: this.primaryKey,
      ...((typeof this.recordMapper === 'function') && {
        mapper: this.recordMapper,
      }),
    };

    return mergeItems(this.records, recordArg, opts);
  }

  @action eject(idArg) {
    if (isInvalidIdArgument(idArg)) {
      throw new this.constructor.InvalidIdArgumentError('Either number, string or array of numbers or strings required');
    }

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

    this.inject(recordArg);

    return result;
  }
};