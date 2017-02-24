# mobx-collection

Objects store for MobX

## Getting started

`npm install --save mobx mobx-collection`

```js
import Collection from 'mobx-collection';

class FooCollection extends Collection {}

const foos = new FooCollection();

foos.upsert([
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
  mapInsert = person => new Person(person);

  @computed alonePeople() {
    return this.filter(person => !person.hasFriends);
  }

  @action killAll() {
    this.filter().forEach(person => person.die());
  }
}

const people = new PersonCollection();

people.upsert([
  {id: 1, name: 'Foo', friendsIds: [3]},
  {id: 2, name: 'Bar'},
  {id: 3, name: 'Baz'},
]);

const person = people.get(2);

if (!person.hasFriends) person.die();
```

## API

### `constructor(recordArg)`

- `recordArg` - *object* or array of *objects*

If `recordArg` is given, initializes collection with record(s).

```js
class FooCollection extends Collection {}

const foos = new FooCollection([{id: 1, name: 'John'}]);

foos.get(1);
// => {id: 1, name: 'John'}
```

### properties

#### `primaryKey`

- type: *string*|*number*
- default: `id`

```js
class FooCollection extends Collection {
  primaryKey = '_id';
}
```

#### `mapInsert`, `mapUpdate`, `mapUpsert` callbacks

- `mapInsert(data)` - maps records to be inserted (new records)
- `mapUpdate(data)` - maps records to be updated (existing records)
- `mapUpsert(data, isNew)` - maps all records

```js
class Person {
  constructor(body) {
    const {id, ...body} = params;

    this.id = id;

    extendObservable(this, body);
  }
}

class PersonCollection extends Collection {
  mapUpsert = (data, isNew) => {
    if (isNew) {
      return new Person(data);
    } else {
      return data;
    }
  };
}

const people = new PersonCollection();

people.upsert({
  id: 1,
  name: 'Bob',
  age: 20,
});
// => Person {
//   id: 1,
//   name: 'Bob',
//   age: 20,
// }
```

#### `afterInsert`, `afterUpdate`, `afterUpsert` callbacks

- `afterInsert(record, data)` - invokes after record was inserted (new record)
- `afterUpdate(record, data)` - invokes after record was updated (existing record)
- `afterUpsert(record, data, isNew)` - always invokes

```js
class PersonCollection extends Collection {
  mapUpsert = (data, isNew) => {
    const {friends, ...body} = data;

    if (isNew) {
      return new Person(body);
    } else {
      return body;
    }
  };
  afterUpsert = (person, data, isNew) => {
    const {friends} = data;

    person.setFriends(friends);
  };
}

const people = new PersonCollection();

class Person {
  @observable friendsIds = [];

  constructor(body) {
    const {id, ...body} = params;

    this.id = id;

    extendObservable(this, body);
  }

  @action setFriends(friends) {
    const newPeople = friends.map(f => {
      return {
        id: _.uniqueId(), // lodash function to generate unique ID
        name: f,
      };
    })

    people.upsert(newPeople);

    this.friendsIds = newPeople.map(f => f.id);
  }

  @computed get friends() {
    return people.filter(p => {
      return this.friendsIds.includes(p.id);
    });
  }
}

people.upsert({
  id: 1,
  name: 'Bob',
  age: 20,
  friends: ['Alice', 'Charlie'],
});
// => Person {
//   id: 1,
//   name: 'Bob',
//   age: 20,
//   friendsIds: [<uniqueId>, <uniqueId>]
// }

people.filter();
// => [
//   Person {id: 1, name: 'Bob', age: 20, friendsIds: [<uniqueId>, <uniqueId>]},
//   Person {id: <uniqueId>, name: 'Alice', friendsIds: []},
//   Person {id: <uniqueId>, name: 'Charlie', friendsIds: []},
// ]
```

### methods

#### `get(idArg)`

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

#### `filter(...params)`

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

#### `find(...params)`

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

#### `upsert(recordArg)`

- `recordArg` - *object* or array of *objects*

Upserts record(s) into collection. Utilizes [merge-items](https://github.com/lukaszgrolik/merge-items).

- Returns *record*|*undefined* if single object given or array of *records* if array of objects given.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
]);

foos.upsert({id: 2, name: 'Alice'});
// => {id: 2, name: 'Alice'}
foos.upsert([{id: 1, name: 'Andrew'}, {id: 3, name: 'Steve'}]);
// => [{id: 1, name: 'Andrew'}, {id: 3, name: 'Steve'}]

foos.filter();
// => [{id: 1, name: 'Andrew'}, {id: 2, name: 'Alice'}, {id: 3, name: 'Steve'}]
```

#### `remove(idArg)`

- `idArg` - *string*|*number* or array of *strings*|*numbers*

Removes record(s) from collection by given ID(s). Returns removed record(s).

- Returns *record*|*undefined* if primitive ID given or array of *records* if array of IDs given.

```js
const foos = new FooCollection([
  {id: 1, name: 'John'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Alice'},
  {id: 4, name: 'Steve'},
]);

foos.remove(1);
// => {id: 1, name: 'John'}
foos.remove([2, 3]);
// => [{id: 2, name: 'Bob'}, {id: 3, name: 'Alice'}]

foos.filter();
// => [{id: 4, name: 'Steve'}]
```

#### `clear()`

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

#### `replace(recordArg)`

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