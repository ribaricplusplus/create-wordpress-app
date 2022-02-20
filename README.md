# Create WordPress App

Setup a WordPress development environment quickly and easily. Features:

- Local server (based on Docker)
- Remote server synchronization
- Modern JavaScript / TypeScript bundling
- Sass styles (PostCSS supported in JavaScript imports)
- Formatting and linting (PHP, Styles, JS)

Create WordPress App is intentionally designed to be extremely extensible to adapt to various local server implementations, remote server connections, WordPress configurations, etc. Documentation still needs to be written.

## Usage

```
npx @ribarich/create-wordpress-app my-wp-app
```

For now, this creates a template for a theme project. Different templates will be available in the future using the `--template` parameter.

Every template has its own documentation. For example, see the default theme template [here](./packages/create-wordpress-app/templates/theme). You can see all currently available templates in the [templates folder](./packages/create-wordpress-app/templates)
