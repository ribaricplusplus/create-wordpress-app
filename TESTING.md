# Testing

Dependencies needed for testing

- Node.js
- Vagrant
- Virtualbox

## Integration tests

Integration tests run using 2 Vagrant machines, a client and a server.

Run integration tests:

```
npx cwapp-scripts run-integration-tests
```

Restore original state for all test machines:

```
vagrant snapshot restore initial-install
```