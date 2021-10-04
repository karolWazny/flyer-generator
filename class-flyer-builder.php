<?php
require_once 'vendor/autoload.php';

class FlyerBuilder
{
	var $template_file;
	var $temp_file_name;
	var $number_of_songs;
	
	var $phpWord;
	var $currentSection;
	
	public function __construct(){
		$this->temp_file_name = 'flyer' . time() . 'docx';
		$this->number_of_songs = 0;
		$this->template_file = 'flyer-template.docx';
		
		$this->initializePhpWordObject();
	}
	
	private function initializePhpWordObject(){
		$this->phpWord = $phpWord = \PhpOffice\PhpWord\IOFactory::load($this->template_file);
		
		$this->phpWord->addFontStyle('flyerchorus', array('name' => 'Calibri Light',
											'italic' => true,
											'size' => 9));
											
		$this->phpWord->addFontStyle('flyerverse', array('name' => 'Calibri Light',
											'size' => 9));
											
		$this->phpWord->addFontStyle('flyertitle', array('name' => 'Calibri Light',
											'bold' => true,
											'size' => 9));
											
		$this->currentSection = $phpWord->getSections()[0];
	}
	
	public function appendTitle($title){
		$this->number_of_songs++;
		
		$this->currentSection->addText("" . $this->number_of_songs . ". " . $title, 'flyertitle');
	}
	
	public function appendVerse($verse){
		$this->currentSection->addText(trim($verse), 'flyerverse');
	}
	
	public function appendChorus($chorus){
		$this->currentSection->addText(trim($chorus), 'flyerchorus');
	}
	
	public function generateAndSaveDocx(){
		$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
		$objWriter->save($this->temp_file_name);
		
		return $this->temp_file_name;
	}
	
	public function generateAndDownloadDocx(){
		$this->phpWord->save('ulotka.docx', 'Word2007', true);
	}
	
	public function manage_linebreaks($str){
		$result = str_replace('\n', '<w:br/>', $str);
		return $result;
	}
}