# Development

Documentation for doing development on Create WordPress App.

## Start development - build and watch for changes

```
npm run start
```

## Updating npm repository

```
npm publish --workspace packages/create-wordpress-app --workspace packages/wp-dev
```

## Updating dependencies

- Remember to keep nanoid at 3.3.4 because Jest doesn't support ESM, so issues happen with nanoid 4.0.0.
