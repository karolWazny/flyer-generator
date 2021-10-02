<?php

class FlyerGenerator
{
	public function __construct() {
		
		add_action( 'wp_enqueue_scripts', array($this, 'scripts') );
		
		add_action( 'wp_ajax_nopriv_generate_flyer', array( $this, 'generate_flyer'));
		add_action( 'wp_ajax_generate_flyer', array( $this, 'generate_flyer'));
		
	}
	
	function scripts(){
		
		wp_enqueue_script( 'general-jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', array('jquery'), null, true);
		wp_enqueue_script( 'flyer-generator', plugin_dir_url( __FILE__ ) . 'js/scripts.js', array( 'jquery' ), null, true );

		// set variables for script
		wp_localize_script( 'flyer-generator', 'settings', array(
			'generateurl' => plugin_dir_url( __FILE__ ) . 'generate-and-download-file.php'
		) );
		
		wp_enqueue_style('flyer-generator-styles', plugin_dir_url( __FILE__ ) . 'css/styles.css');
	}
	
	function generate_flyer(){
		
		$data = $_POST;
		
		wp_send_json( __('Debug message!') );
		
	}
	
	function strip_post_to_song($post) {
		$song = preg_replace('~^[\s\S]* wp:lazyblock\/piesn[^>]*>[\s]~', '', $post);
		$song = preg_replace('~[\s]<\!-- \/wp:lazyblock\/piesn[\s\S]*$~', '', $song);
		return $song;
	}
	
	function strip_to_lyrics_with_chords($song_part){
		$result = preg_replace('~^([^\"]*\"){3}~', '', $song_part);
		$result = preg_replace('~\"[\s\S]*$~', '', $result);
		return $result;
	}
	
	function strip_chords($song){
		$result = preg_replace('~\[[^\]]*\]~', '', $song);
		return $result;
	}
}

?>