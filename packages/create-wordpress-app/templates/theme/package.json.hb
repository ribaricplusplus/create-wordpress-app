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
		"@wordpress/dom-ready": "^3.3.1"
	},
	"devDependencies": {
		"@wordpress/scripts": "^21.0.1",
		"concurrently": "^7.0.0",
		"@wordpress/env": "^4.2.1",
		"@ribarich/wp-dev": "{{ packageJson.wpDev }}",
		"sass": "^1.49.8"
	},
	"keywords": [],
	"author": "",
	"license": "GPL"
}
