```js
import Collection from 'collection';

class Person {
  constructor(body) {
    Object.assign(this, body);
  }
}

class PersonCollection extends Collection {
  primaryKey = '_id';
  transformRecords = records => new SomeSpecialArray(record);
  recordMapper = record => new Person(record);
}
```