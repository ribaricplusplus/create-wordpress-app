# WordPress Environment

Fork of @wordpress/env.

- Added new PHP extension: GMP
- PHPUnit, CLI and WordPress Dockerfiles are the same between development and test environments.
- xDebug 3 added to PHPUnit
- Made it possible to add a custom PHP config: Put it in .wpenv/100-php-custom.ini
- Mount xDebug output to `.xdebug`
