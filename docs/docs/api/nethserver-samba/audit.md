# audit

Display and manage Samba Audit logs.

## read

### Input

The read API requires an `action` field.
Valid actions are:

- `query`

#### query

Execute a query inside the database with given filters.
If no filter is given, all records are returned.

Input example:
```json
{
  "action": "query",
  "username": "myuser",
  "address": "",
  "share": "",
  "operation": "",
  "message": "",
  "from": "1546300800",
  "to": "1557360000"
}
```

### Output

##### query

Output example:
```json
[
  {
    "id": "16",
    "when": "2019-05-08 15:12:57",
    "share": "iba1",
    "ip": "192.168.5.22",
    "user": "giacomo@local.neth.eu",
    "op": "open",
    "result": "ok",
    "arg": "w|20190507-1121-janus_debug_threads.log"
  },
  {
    "id": "15",
    "when": "2019-05-08 15:12:57",
    "share": "iba1",
    "ip": "192.168.5.22",
    "user": "giacomo@local.neth.eu",
    "op": "open",
    "result": "ok",
    "arg": "r|."
  },
  ...
]
```

## update

The update API parses `/var/log/smbaudit.log` log and insert records inside the database.

No input is required.

## delete

The delete API takes the same input from `read` API for the `query` action.
Selected records are deleted instead of returned.

Output example:
```json
{
  "state": "success",
  "deleted": 2
}
```
