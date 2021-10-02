<?php
/**
 * Plugin Name
 *
 * @author            Karol Wazny
 * @copyright         2019 Karol Wazny
 * @license           GPL-2.0
 *
 * @wordpress-plugin
 * Plugin Name:       Flyer Generator
 * Description:       Description of the plugin.
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Karol Wazny
 * Text Domain:       plugin-slug
 * License:           GPL v2
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Update URI:        
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

define ('FLYER_GENERATOR_VERSION', '1.0.0');

function activate_flyer_generator() {
	
}

function deactivate_flyer_generator() {
	
}

require_once 'class-flyer-generator.php';

register_activation_hook( __FILE__, 'activate_flyer_generator');
register_deactivation_hook( __FILE__, 'deactivate_flyer_generator');

$flyer_generator=new FlyerGenerator();