# mobx-collection

Objects store for MobX

## Getting started

`npm install --save mobx mobx-collection`

```js
import Collection from 'mobx-collection';

class FooCollection extends Collection {}

const foos = new FooCollection();

foos.inject([
  {id: 1, name: 'John'},
]);

foos.get(1);
// => {id: 1, name: 'John'}
```

## Example

```js
import {extendObservable, computed, action} from 'mobx';
import Collection from 'mobx-collection';

class Person {
  constructor(params) {
    const {id, ...body} = params;

    this.id = id;

    extendObservable(this, {
      friendsIds: [],
      isAlive: true,
    }, body);
  }

  @computed get friends() {
    return PersonCollection.get(this.friendsIds);
  }

  @computed get hasFriends() {
    return !!this.friends.length;
  }

  @action die() {
    this.isAlive = false;
  }
}

class PersonCollection extends Collection {
  transformRecords = person => new Person(person);

  @computed alonePeople() {
    return this.filter(person => !person.hasFriends);
  }

  @action killAll() {
    this.filter().forEach(person => person.die());
  }
}

const people = new PersonCollection();

people.inject([
  {id: 1, name: 'Foo', friendsIds: [3]},
  {id: 2, name: 'Bar'},
  {id: 3, name: 'Baz'},
]);

const person = people.get(2);

if (!person.hasFriends) person.die();
```

## API

### constructor(recordArg)

- `recordArg` - *object* or array of *objects*

If `recordArg` is given, initializes collection with record(s).

```js
class FooCollection extends Collection {}

const foos = new FooCollection([{id: 1, name: 'John'}]);

foos.get(1);
// => {id: 1, name: 'John'}
```

### properties

#### primaryKey

- type: *string*|*number*
- default: `id`

```js
class FooCollection extends Collection {
  // es7
  primaryKey = '_id';

  // es6
  constructor() {
    super();

    this.primaryKey = '_id';
  }
}
```

#### transformRecords

- type: *function*

```js
class Foo {
  constructor(params) {
    const {id, ...body} = params;

    this.id = id;

    extendObservable(this, body);
  }
}

class FooCollection extends Collection {
  // es7
  transformRecords = foo => new Foo(foo);

  // es6
  constructor() {
    super();

    this.transformRecords = foo => new Foo(foo);
  }
}
```

### methods

#### #get(idArg)

- `idArg` - *string*|*number* or array of *strings*|*numbers*

Returns found record(s) by given ID(s).

- Returns *record*|*undefined* if primitive ID given or array of records if array of IDs given.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
]);

foos.get(1);
// => {id: 1, name: 'John'}
foos.get([1, 2]);
// => [{id: 1, name: 'John'}, {id: 2, name: 'Bob'}]
```

#### #filter(...params)

Lodash `filter` function bound to collection's records.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Alice'},
]);

foos.filter(f => f.name.length > 3);
// => [{id: 1, name: 'John'}, {id: 3, name: 'Alice'}]
```

#### #find(...params)

Lodash `find` function bound to collection's records.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Alice'},
]);

foos.find({name: 'Alice'});
// => {id: 3, name: 'Alice'}
```

#### #inject(recordArg)

- `recordArg` - *object* or array of *objects*

Upserts record(s) into collection. Utilizes [merge-items](https://github.com/lukaszgrolik/merge-items).

- Returns object containing arrays of inserted and updated records' IDs.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
]);

foos.inject({id: 2, name: 'Alice'});
// => {inserted: [], updated: [2]}
foos.inject([{id: 1, name: 'Andrew'}, {id: 3, name: 'Steve'}]);
// => {inserted: [3], updated: [1]}

foos.filter();
// => [{id: 1, name: 'Andrew'}, {id: 2, name: 'Alice'}, {id: 3, name: 'Steve'}]
```

#### #eject(idArg)

- idArg - *string*|*number* or array of *strings*|*numbers*

Removes record(s) from collection by given ID(s). Returns removed record(s).

- Returns *record*|*undefined* if primitive ID given or array of records if array of IDs given.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Alice'},
  {id: 4, name: 'Steve'},
]);

foos.eject(1);
// => {id: 1, name: 'John'}
foos.eject([2, 3]);
// => [{id: 2, name: 'Bob'}, {id: 3, name: 'Alice'}]

foos.filter();
// => [{id: 4, name: 'Steve'}]
```

#### #clear()

Removes all records from collection.

- Returns number of removed records.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Alice'},
]);

foos.clear();
// => 3

foos.filter();
// => []
```

#### #replace(recordArg)

- `recordArg` - *object* or array of *objects*

Removes current records from collection and adds new record(s).

- Returns number of removed records.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Alice'},
]);

foos.replace([
  {id: 1, name: 'Alice'},
  {id: 2, name: 'Steve'},
]);
// => 3

foos.filter();
// => [{id: 1, name: 'Alice'}, {id: 2, name: 'Steve'}]
```