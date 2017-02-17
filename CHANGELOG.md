# 0.3.0

## Breaking changes

- `#inject` method
  - renamed to `#upsert`
  - now returns upserted item(s)
- `#eject` method renamed to `#remove`
- `#get` method - now uses weak ID comparison
- `#get` method - now returns items in the same sequence as given IDs
- `transformRecords` option removed - use `mapInsert` option instead

# 0.2.1

- Changed `merge-items` version in `package.json` to prevent installing incompatible `0.2.x` releases

# 0.2.0

- Removed argument checking for `#get` and `#eject` methods
- Renamed `recordMapper` option to `transformRecords`
- "main" field in package.json now points to unminified version of distributable script
- Updated README.md