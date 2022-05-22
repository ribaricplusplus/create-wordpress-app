{
	"name": "{{ name }}",
	"version": "1.0.0",
	"description": "{{ description }}",
	"main": "index.js",
	"scripts": {
		"build-js": "wp-scripts build",
		"build-scss": "sass ./scss:./css",
		"start-js": "wp-scripts start",
		"start-scss": "sass ./scss:./css --watch",
		"build": "concurrently 'npm:build-*'",
		"start": "concurrently 'npm:start-*'",
		"sync": "wp-dev sync",
		"zip": "wp-scripts plugin-zip",
		"format-js": "wp-scripts format",
		"format-php": "./vendor/bin/phpcbf .",
		"format-scss": "wp-scripts lint-style --fix",
		"format": "concurrently 'npm:format-*'"
	},
	"files": [
		"src/**/*",
		"vendor/**/*",
		"build/**/*",
		"css/**/*",
		"style.css",
		"*.php"
	],
	"dependencies": {
		"@wordpress/dom-ready": "x"
	},
	"devDependencies": {
		"@wordpress/scripts": "x",
		"concurrently": "x",
		"@ribarich/wp-env-2": "{{ packageJson.wpEnv }}",
		"@ribarich/wp-dev": "{{ packageJson.wpDev }}",
		"sass": "x",
		"prettier": "npm:wp-prettier@2.2.1-beta-1"
	},
	"keywords": [],
	"author": "",
	"license": "GPL"
}
