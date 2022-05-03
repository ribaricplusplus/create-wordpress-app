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

## Debugging tests

There are debug commands in `package.json`.

Example of a command for debugging tests:

```
node --inspect-brk ./node_modules/.bin/jest 'config.test.js' --selectProjects wp-env-2 --runInBand --testTimeout=500000
```

Then debug tests with `chrome://inspect`.

## Various tips:

- Ensure that tests run with a clean state after tests have been run: `vagrant snapshot restore initial-install`
