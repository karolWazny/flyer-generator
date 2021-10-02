<?php

if (!isset($_GET['arg'])) {
	die("No songs provided!");
}

require_once(explode("wp-content", __FILE__)[0] . "wp-load.php");
require_once('class-flyer-generator.php');
require_once('class-flyer-builder.php');

$ids = array();

$arg = $_GET['arg'];
$ids_string = explode('-', $arg);

foreach ($ids_string as &$single_id) {

	array_push($ids, (int) $single_id);
	
}
unset($single_id);
	
$posts = get_posts(array(
	'numberposts' => -1,
	'orderby' => 'post_name',
	'order' => 'ASC',
	'include' => $ids
));

$flyerBuilder = new FlyerBuilder();

foreach ($posts as &$single_post) {
	
	$flyerBuilder->appendTitle($single_post->post_title);
	
	$song_text = FlyerGenerator::strip_post_to_song($single_post->post_content);
	
	$song_text = preg_replace('~^<\!--[\s]*~', '', $song_text);
	$song_text = preg_replace('~[\s]*-->$~', '', $song_text);
	
	$song_parts = preg_split('~-->[\s]*<\!--~', $song_text);
	
	foreach( $song_parts as &$song_part ){
		
		if( preg_match('~^[\s]*wp:lazyblock/zwrotka~', $song_part) ){
			$str = FlyerGenerator::strip_chords(FlyerGenerator::strip_to_lyrics_with_chords($song_part));
			$flyerBuilder->appendVerse(FlyerBuilder::manage_linebreaks($str));
		} elseif( preg_match('~^[\s]*wp:lazyblock/refren~', $song_part) ){
			$str = FlyerGenerator::strip_chords(FlyerGenerator::strip_to_lyrics_with_chords($song_part));
			$flyerBuilder->appendChorus(FlyerBuilder::manage_linebreaks($str));
		}
	}
	
	unset($song_part);
}
unset($single_post);

$generated_file = $flyerBuilder->generateAndSaveDocx();

header('Content-Description: File Transfer');
header('Content-Disposition: attachment; filename=' . basename('ulotka.docx'));
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($generated_file));
header("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document");
readfile($generated_file);

unlink($generated_file);

?>