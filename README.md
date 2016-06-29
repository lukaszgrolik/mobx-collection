```js
import Collection from 'collection';

class Task {
  constructor(body) {
    Object.assign(this, body);
  }
}

class TaskCollection extends Collection {
  static recordMapper = record => new Task(record);
}
```