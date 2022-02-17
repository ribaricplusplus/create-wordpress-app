<?php

defined( 'ABSPATH' ) || exit;

require 'vendor/autoload.php'

define( {{ mainFileName }}, __FILE__ );

{{ pascalCaseName }}\Main::get_instance()->init();
