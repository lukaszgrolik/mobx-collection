const _ = require('lodash');
const mergeItems = require('merge-items');

module.exports = class Collection {
  constructor(recordArg, opts) {
    if (opts === undefined) opts = {};

    if (typeof opts.recordsMapper === 'function') {
      this.records = opts.recordsMapper([]);
    } else {
      this.records = [];
    }

    this.inject(recordArg);
  }

  inject(recordArg) {
    return mergeItems(this.records, recordArg, {
      mapper: item => new this.constructor.recordMapper(item),
    });
  }

  eject(idArg) {
    const ids = idArg instanceof Array ? idArg : [idArg];

    return _.remove(this.records, record => {
      return _.includes(ids, record.id);
    });
  }

  filter(predicate) {
    return _.filter(this.records, predicate);
  }

  find(predicate) {
    return _.find(this.records, predicate);
  }

  replace(recordArg) {
    this.records.length = 0;

    return this.inject(recordArg);
  }
};