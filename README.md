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

After installation completes, you can start the local server

```
cd ./my-wp-app
npx wp-env start
```

Every template has its own documentation. You can see all currently available templates in the [templates folder](./packages/create-wordpress-app/templates)

Build styles and JavaScript:

```
npm run start
```

Other commands that are available:

- `npm run sync` => Synchronize local server with remote server (make sure to configure remote server in wpdev.config.js first).
- `npm run zip` => Generate ZIP. The files that are included are defined by "files" entry in package.json.
- `npm run format` => Format files according to WordPress standards.

Look into the following files for further configuration and commands:

- wpdev.config.js => Remote server configuration
- src/Main.php => Main theme initialization code
- package.json => Various commands available in scripts
