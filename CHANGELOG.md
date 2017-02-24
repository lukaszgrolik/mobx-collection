# 0.3.0

## Breaking changes

- `inject` method
  - renamed to `upsert`
  - now returns upserted record(s)
- `eject` method renamed to `remove`
- `get` method
  - now uses weak ID comparison (`1 == '1'`)
  - now returns records in the same order as given IDs
- `transformRecords` option removed - use `mapInsert` option instead

## New features

- added callback options
  - `mapInsert(data)`
  - `mapUpdate(data)`
  - `mapUpsert(data, isNew)`
  - `afterInsert(record, data)`
  - `afterUpdate(record, data)`
  - `afterUpsert(record, data, isNew)`

# 0.2.1

- Changed `merge-items` version in `package.json` to prevent installing incompatible `0.2.x` releases

# 0.2.0

- Removed argument checking for `get` and `eject` methods
- Renamed `recordMapper` option to `transformRecords`
- "main" field in package.json now points to unminified version of distributable script
- Updated README.md