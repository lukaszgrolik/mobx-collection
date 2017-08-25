// import * as _ from 'lodash';

// type id = number | string;
// type objAny = {[key: string]: any};

// declare class MobxCollection<TBody = {}, TItem = TBody> {
//   records: TItem[];
//   new(records?: TBody | TBody[]);

//   primaryKey: string;
//   mapInsert: (body: TBody) => TItem;

//   get(arg: id[]): TItem[];
//   get(arg: id): TItem | undefined;
//   // get(arg: any): any;

//   find(arg: ((item: TItem) => boolean)): TItem | undefined;
//   find(arg: objAny): TItem | undefined;
//   // find(arg: any): any;

//   filter(arg: ((item: TItem) => boolean)): TItem[];
//   filter(arg: objAny): TItem[];
//   filter(): TItem[];
//   // filter(arg: any): any;

//   upsert(arg: TBody[]): TItem[];
//   upsert(arg: TBody): TItem;
//   // upsert(arg: any): any;

//   remove(arg: id | id[]): void; // @todo

//   clear(): number; // @todo

//   replace(): number; // @todo
// }

// export = MobxCollection;