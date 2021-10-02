<ul id="songs_flyer_generator">
</ul>
<div class="wp-block-buttons">
  <button id="clear-cart-butt" onclick="clear_cart()">
    Wyczyść listę
  </button>
</div>
<script>
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
    let index = 0;
    songs.forEach(song_item => {
      if(song_item['id'] == song_id){
        index = songs.indexOf(song_item);
      }
    });
    songs = songs.splice(index, 1);
    storage_object().setItem("flyer_items", JSON.stringify(songs));
    initialize_songs_list();
  }
  
  function initialize_songs_list(){
    let songs = document.getElementById("songs_flyer_generator");
    let song_items = JSON.parse(storage_object().getItem("flyer_items"));
    let songs_html = "";
    song_items.forEach(song_item => {
      songs_html = songs_html.concat(song_list_item_from(song_item));
    });
    songs.innerHTML = songs_html;
  }

  document.addEventListener("DOMContentLoaded", function(){
    initialize_songs_list();
  });
</script>