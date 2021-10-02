jQuery(document).ready(function($) {
	//Nasłuchujemy kliknięcia w przycisk o klasie show-form,
	//który może znajdować się w kontenerze o klasie report-a-bug.
	//Dlatego tak pokracznie, a nie przez metodę click()?
	//Ponieważ kiedy obiekt o klasie show-form byłby zwrócony
	//dynamicznie z AJAXa to wtedy funkcja by się nie uruchomiła.
	// //Warto o tym pamiętać.
	$('.flyer-generator-buttons').on('click', '#generate-flyer-butt', function(event) {
		
		let full_url=settings.generateurl.concat("?arg=").concat(obtain_song_ids_as_string());
		
		console.log(full_url);
		
		window.location.href = full_url;

	});

});

$( document ).ready(function() {
	initialize_songs_list();
	initialize_add_to_cart_button();
});

function obtain_song_ids_as_string(){
	let songs = JSON.parse(storage_object().getItem('flyer_items'));
	let output = "";
	songs.forEach(song => {
		output = output.concat('-').concat(song['id'].replace('post-', ""));
	});
	output = output.slice(1);
	return output;
}

function copyStringToClipboard (str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
    }
    
function get_song_parts(song) {
      let entire_song = document.getElementById("piesn_z_akordami");
      let song_contents = entire_song.querySelectorAll("*");
      let song_parts = new Array();
      Array.from(song_contents).forEach(div => {
        if(div.className.normalize() === "my_verse" || div.className === "my_chorus") {
          song_parts.push(div);
        }
        });
      return song_parts;
    }
      
function get_lyrics() {
      let song_parts = get_song_parts();
      let lyrics = "";
      song_parts.forEach(div => {
        let song_section = "";
        let cpress_lines = div.querySelectorAll(".cpress_line");
        Array.from(cpress_lines).forEach(line => {
          let line_text = "";
          let line_sections = line.querySelectorAll(".lyric");
          Array.from(line_sections).forEach(sec => {
            line_text = line_text.concat(sec.innerText);
          });
          if(line_text === "") {
            line_text = line.innerText;
          }
          line_text = line_text.trim().replace(/\s+/g,' ');
          song_section = song_section.concat(line_text).concat('\n');
        });
        lyrics = lyrics.concat(song_section);
      });
      
      copyStringToClipboard(lyrics.trim());
    }
    
function get_lyrics_and_chords(){
      let song_parts = get_song_parts();
      let lyrics = "";
      song_parts.forEach(div => {
        let song_section = "";
        let cpress_lines = div.querySelectorAll(".cpress_line");
        Array.from(cpress_lines).forEach(line => {
          let line_text = "";
          let line_chords = "|";
          let line_sections = line.querySelectorAll(".lyric");
          Array.from(line_sections).forEach(sec => {
            line_text = line_text.concat(sec.innerText);
          });
          if(line_text === "") {
            line_text = line.innerText;
          }
          
          let chord_sections = line.querySelectorAll(".chord");
          Array.from(chord_sections).forEach(sec => {
            if(sec.style.display != "none") {
              line_chords = line_chords.concat(" ").concat(sec.innerText.trim());
            }
          });
          
          line_text = line_text.trim().concat(" ").concat(line_chords).replace(/\s+/g,' ');
          if(line_text.trim() != "|") {
            song_section = song_section.concat(line_text).concat('\n');
          }
        });
        lyrics = lyrics.concat(song_section).concat('\n');
      });
      
      copyStringToClipboard(lyrics.trim());
    }
    
function add_to_flyer(){
	let post_id = get_post_id();
    let flyer_items = JSON.parse(storage_object().getItem("flyer_items"));
    if(!flyer_items){
    flyer_items = [];
    }
	  let post = get_flyer_item_object();
	  let list_contains = false;
    flyer_items.forEach(flyer_item => {
      if(flyer_item['id'] === post['id']){
        list_contains = true;
      }
    });
    if(!list_contains){
      flyer_items.push(post);
      storage_object().setItem("flyer_items", JSON.stringify(flyer_items));
    }
    console.log(flyer_items);
	disable_add_to_cart_button();
}

function get_flyer_item_object(){
	let output = {"id":get_post_id(),"title":get_post_title(), "url":get_post_url()};
	return output;
}
    
function get_post_id(){
    let post_id = document.getElementsByTagName("article")[0].id;
    return post_id;
}

function get_post_title(){
	return document.getElementsByClassName("post-title")[0].innerText;
}

function get_post_url(){
	return window.location.href;
}

  function clear_cart(){
    storage_object().setItem("flyer_items", JSON.stringify([]));
    initialize_songs_list();
  }

  function storage_object(){
	  return window.localStorage;
  }
  
  function song_list_item_from(song_item){
    let output = "<li id='".concat(song_item['id']).concat("'><a href='").concat(song_item['url']);
    output = output.concat("'>").concat(song_item['title']).concat("</a>");
    let button_html = "<button onclick=remove_from_list('".concat(song_item['id']).concat("') style='float:right;'>");
    button_html = button_html.concat("Usuń</button>");
    output = output.concat(button_html).concat("</li>");
    return output;
  }
  
  function remove_from_list(song_id){
    let songs = JSON.parse(storage_object().getItem("flyer_items"));
    let index = -1;
    songs.forEach(song_item => {
      if(song_item['id'] === song_id){
        index = songs.indexOf(song_item);
      }
    });
    songs.splice(index, 1);
    storage_object().setItem("flyer_items", JSON.stringify(songs));
    initialize_songs_list();
  }
  
  function initialize_songs_list(){
    let songs = document.getElementById("songs_flyer_generator_songs");
    if(songs){
      let song_items = JSON.parse(storage_object().getItem("flyer_items"));
      let songs_html = "";
      song_items.forEach(song_item => {
        songs_html = songs_html.concat(song_list_item_from(song_item));
      });
      songs.innerHTML = songs_html;
    }
  }
  
  function initialize_add_to_cart_button(){
	  let song_items = JSON.parse(storage_object().getItem('flyer_items'));
	  let post_id = document.querySelector('.status-publish').getAttribute('id');
	  song_items.forEach(song_item => {
		  if(song_item['id'] === post_id){
			  disable_add_to_cart_button();
		  }
	  });
  }
  
  function disable_add_to_cart_button(){
	  let button = document.getElementById('add_to_cart_butt');
	  button.innerHTML = 'Pieśń dodana!';
	  button.disabled = true;
  }