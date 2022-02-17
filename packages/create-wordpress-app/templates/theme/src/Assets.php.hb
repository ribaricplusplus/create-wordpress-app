<?php
declare(strict_types=1);

namespace {{ pascalCaseName }};

defined( 'ABSPATH' ) || exit;

class Assets {
	public function init() {
		\add_action( 'init', array( $this, 'register_scripts' ) );
	}

	public function register_scripts() {
		$scripts_path = \plugin_dir_path( \\{{ mainFileName }} ) . 'build/';

		if ( ! file_exists( $scripts_path ) ) {
			return;
		}

		$scripts_files = scandir( $scripts_path );

		foreach( $scripts_files as $file ) {

			if ( preg_match( '/(?<name>\\w+)\\.bundle\\.js/', $file, $matches ) ) {

				$name = $matches['name'];
				$data = $this->get_script_data( $name );

				\wp_register_script(
					"{{ prefix }}-{$name}",
					\get_theme_file_uri( "build/$file" ),
					$data['dependencies'],
					$data['version'],
					false
				);
			}
		}
	}

	/**
	 * Get script data as produced by dependency extraction webpack plugin
	 *
	 * @param string $script_name Script name defined by a webpack entry point.
	 * @return array Script data (version, dependencies)
	 */
	protected function get_script_data( $script_name ) {
		$assets_path = \plugin_dir_path( \\{{ mainFileName }} ) . 'build/' . $script_name . '.asset.php';

		if ( file_exists( $assets_path ) ) {
			$data = require $assets_path;
			return $data;
		}

		return array(
			'dependencies' => array(),
			'version'      => '',
		);
	}
}
