<?php
declare(strict_types=1);

namespace {{ pascalCaseName }};

defined( 'ABSPATH' ) || exit;

class Main {
	/** @var Assets */
	public $assets;

	/** @var Main */
	private static $instance = null;

	public function init() {
		$this->assets->init();

		// Theme initialization code goes here.
	}

	public static function get_instance() {

		if ( self::$instance === null ) {
			self::$instance = new Main();
		}

		return self::$instance;
	}

	private function __construct() {
		$this->assets = new Assets();
	}
}
