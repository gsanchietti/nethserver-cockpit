# system-shutdown

Reboot or poweroff the server.

## update

### Input

A JSON containg an `action` field. Valid actions are: `poweroff` and `reboot`.

Example:
```json
{
    "action": "reboot"
}
```