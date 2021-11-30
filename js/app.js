



const APP_KEY='';


let img_url = "https://image.tmdb.org/t/p/w500";
async function create_movie(element){
  let poster=element.backdrop_path;
  if (poster==null){
    poster=element.poster_path;
  }
  const isInFav=await isMovieInList(element.id,'favorite');
  const isInWatchlist=await isMovieInList(element.id,'watchlist');

  const movie=document.createElement("div");
  movie.classList.add("movie");
  movie.id=`${element.id}_movie`;


  const movie_img=document.createElement("img");
  movie_img.src=img_url+poster;

  const movie_title=document.createElement("h1");
  movie_title.classList.add("movie-title");

movie_title.addEventListener("click",(e)=>{
  showDetails(element.id)
})

  movie_title.innerText=element.title


  const add_tolist=document.createElement("div");
  add_tolist.id=`watch_${element.id}`
  add_tolist.addEventListener('click',()=>{

    Add_to_Watchlist(element.id);
  })


  if(isInWatchlist){
    add_tolist.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute top-1 opacity-0 right-1  h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>`
  $(add_tolist).prop('title', 'Remove From Watch Later');

  }else{

    add_tolist.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute top-1 opacity-0 right-1  h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
  </svg>`
  $(add_tolist).prop('title', 'Add To Watch Later');

  }



const add_to_fav=document.createElement("div");
add_to_fav.id=`fav_${element.id}`
if(isInFav){
  add_to_fav.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute  top-8 right-1 opacity-0 h-6 w-6 " viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
</svg>`;
$(add_to_fav).prop('title', 'Remove from Favourite');


}else{
  add_to_fav.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute  top-8 right-1 opacity-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
</svg>`;
$(add_to_fav).prop('title', 'Add To Favourite');


}
add_to_fav.addEventListener('click',()=>{
Mark_as_Favorite(element.id);
})


  movie.appendChild(movie_img);
  movie.appendChild(movie_title);
  movie.appendChild(add_tolist);
  movie.appendChild(add_to_fav);

  return movie;
}

function show_overlay_load(){

  html=`    <div wire:loading id="overlay-load" class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
  <div class="loader-overlay ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
  <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
  <p class="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p>
</div>`

$(document.body).prepend(html);
}

function hide_load(){

  removeElement("overlay-load");
}
 function isMovieInList(id,listname){
  const list_movies= get_list(listname);
  for (let index = 0; index < list_movies.length; index++) {
    const element = list_movies[index];

    

    if(element==id){
      return true;
      
    }
    
  }
 

}
 function isMovieRated(id){
  const rated_movies= getRatedMoves();
  for (let index = 0; index < rated_movies.length; index++) {
    const element = rated_movies[index];
    if(element.id==id){
      return element;
    }
    
  }

}
document.getElementById("rate-btn").addEventListener('click',(e)=>{
  show_overlay_load();
  const movieid=e.target.getAttribute("movie-id");
  const isRated=e.target.getAttribute("isRated");
  if(isRated=="false"){
    const stars =document.querySelectorAll(".active-star").length;
    let rated_movies=getRatedMoves();
    
    rated_movies.push({id:parseInt(movieid),rating:stars*2});
    localStorage.setItem("rated",JSON.stringify(rated_movies));
    e.target.innerText="unrate";
    e.target.setAttribute("isRated",true);

    clean_stars(stars)
    hide_load();
  
    
    
  }else{
    let rated_movies=getRatedMoves();


      let new_rated_movies=rated_movies.filter((movie)=>{return movie.id!=movieid})
      sessionStorage.setItem("rated",JSON.stringify(new_rated_movies));
      e.target.innerText="rate";
      e.target.setAttribute("isRated",false);
  
      clean_stars(0)
      hide_load();

 
  }


  




})









function get_list(listname){
  //listname rated,favorite,watchlist
  let list_movies=localStorage.getItem(listname);
  if(list_movies){
    return JSON.parse(list_movies);

  }
  

  localStorage.setItem(listname,JSON.stringify([]));
  return [];
  
}

function getRatedMoves(){
  let rated_movies=localStorage.getItem("rated");
  if(rated_movies){
    return JSON.parse(rated_movies);

  }
  
  
  localStorage.setItem("rated",JSON.stringify([]));
  return [];
  
}
async function getFavoriteMoves(){
  let favorite_movies=localStorage.getItem("favorite");
  if(favorite_movies){
    let list_movies= JSON.parse(favorite_movies);
    
    let movie_detail_http = `https://api.themoviedb.org/3/movie/${id}?api_key=${APP_KEY}`;
    const response=await fetch(movie_genres_http);
    const results=await response.json();

  }

  
  
  localStorage.setItem("favorite",JSON.stringify([]));
  return [];
  
}


 function getWatchlistMoves(page){
  
  let watchlist_movies=localStorage.getItem("watchlist");
  if(watchlist_movies){
    return JSON.parse(fwatchlist_movies);

  }
  
  
  localStorage.setItem("watchlist",JSON.stringify([]));
  return [];
  
}
function removeElement(id) {
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
}
function Mark_as_Favorite(id){
  show_overlay_load();

  const isInFav= isMovieInList(id,'favorite');

  const add_to_fav=document.getElementById(`fav_${id}`)
  let favorite_movies= get_list("favorite");
 
  
  if (!isInFav){
    favorite_movies.push(id);
    localStorage.setItem("favorite",JSON.stringify(favorite_movies))
    if (add_to_fav){
      add_to_fav.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute  top-8 right-1 opacity-0 h-6 w-6 " viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
    </svg>`;
    $(add_to_fav).prop('title', 'Remove from Favourite');

    }


  }else{
   const new_favorite_movies= favorite_movies.filter((movie)=>{return movie!=id})
    localStorage.setItem("favorite",JSON.stringify(new_favorite_movies));
    if(add_to_fav){
      add_to_fav.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute  top-8 right-1 opacity-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>`;
    $(add_to_fav).prop('title', 'Add To Favourite');
      
    }



  }

  hide_load();

  
}

 function Add_to_Watchlist(id){

  show_overlay_load();

  const isInWatchlist= isMovieInList(id,'watchlist');
  const add_tolist=document.getElementById(`watch_${id}`);


  let favorite_movies= get_list("watchlist");
  if (!isInWatchlist){
    favorite_movies.push(id);
    localStorage.setItem("watchlist",JSON.stringify(favorite_movies))

    if(add_tolist){
      add_tolist.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute top-1 opacity-0 right-1  h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>`
    $(add_tolist).prop('title', 'Remove From Watch Later');

    }

  }else{
   const new_favorite_movies= favorite_movies.filter((movie)=>{return movie!=id})

    localStorage.setItem("watchlist",JSON.stringify(new_favorite_movies));;
    if(add_tolist){
      add_tolist.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="add-icon absolute top-1 opacity-0 right-1  h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>`
    $(add_tolist).prop('title', 'Add To Watch Later');

    }

  }
  
  hide_load();

  
  
}



function clean_stars(score){
  const stars=[...document.getElementsByClassName("rating__star")];
  const starClassInactive = "rating__star far fa-star";

  stars.map((star)=>{
    star.className=starClassInactive;

  })

  for (let index = 0; index < score; index++) {
    stars[index].className="rating__star fas fa-star active-star";
    
  }
}
function executeRating(stars) {
  const starClassActive = "rating__star fas fa-star active-star";
  const starClassInactive = "rating__star far fa-star";
  const starsLength = stars.length;
  let i;

  stars.map((star) => {
    star.onclick = () => {
       i = stars.indexOf(star);

       if (star.className===starClassInactive) {        
          for (i; i >= 0; --i) stars[i].className = starClassActive;
       } else {
          for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
       }
    };
 });
  }









document.onkeydown = function(evt) {
  evt = evt || window.event
  var isEscape = false
  if ("key" in evt) {
  isEscape = (evt.key === "Escape" || evt.key === "Esc")
  } else {
  isEscape = (evt.keyCode === 27)
  }
  if (isEscape && document.body.classList.contains('modal-active')) {
  toggleModal()
  }
};


function toggleModal () {
  const body = document.querySelector('body')
  const modal = document.querySelector('.modal')
  modal.classList.toggle('opacity-0')
  modal.classList.toggle('pointer-events-none')
  body.classList.toggle('modal-active')
}

function clearDetails(){
  const loader=`       <div class="flex justify-center items-center ">
  <div
    class="
      loader
      ease-linear
      rounded-full
    border-t-2 border-gray-500
      h-12
      w-12
    "
  ></div>
</div>`

$('.movie-name').html("");
$('.des').html(loader);
$('.movie-info').css('background', 'linear-gradient(90deg, rgba(24, 24, 24, 1), rgba(24, 24, 24, 0.8) 0%),url("' + `` + '")');
$('.trailer-container').html(loader);
$('.recommendations-container').html("");




}

async function showDetails(id){

  const modal_content=document.querySelector(`.modal-content`);
  const credits=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${APP_KEY}`
  const videos=`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${APP_KEY}`
  const recommendations=`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${APP_KEY}`
 

  let movie_detail_http = `https://api.themoviedb.org/3/movie/${id}?api_key=${APP_KEY}`;
  clearDetails();
  const isRated= isMovieRated(id);


  const rate_btn=document.getElementById("rate-btn");
  

  rate_btn.setAttribute("movie-id",id);
  if(isRated){
    rate_btn.innerText="unrate";
    rate_btn.setAttribute("isRated",true);

    clean_stars(isRated.rating/2)

  }else{
    rate_btn.setAttribute("isRated",false);

    rate_btn.innerText="rate";
    clean_stars(0);

  }



  toggleModal();


  fetch(movie_detail_http).then(res => res.json()).then(results => {
     
      let genres_list=[];
      results.genres.map((i)=>{genres_list.push(i.name)})
      $('.movie-name').html(results.title);
      $('.des').html(results.overview);
      $('.genres-list').html(genres_list.toString());
      $(".release").html(results.release_date.split('-')[0]+"| ")

  
      $('.movie-info').css({'background': 'linear-gradient(90deg, rgba(24, 24, 24, 1), rgba(24, 24, 24, 0.8) 80%),url("' + `https://image.tmdb.org/t/p/original${results.backdrop_path}` + '")',
      'background-size': 'cover','background-repeat': 'no-repeat'
  });

  });
const recommendations_container=document.querySelector('.recommendations-container');
recommendations_container.innerHTML="";

  fetch(recommendations).then(res => res.json()).then(data => {

      let html=``
for (let index = 0; index < data.results.length; index++) {
  const recommendations_movie=document.createElement("div");

  const element = data.results[index];

  recommendations_movie.classList.add("recommendations-movie");
  recommendations_movie.addEventListener('click',()=>{
      toggleModal();
      showDetails(element.id);
  });
  const recommendations_movie_img=document.createElement("img");
  recommendations_movie_img.src=`https://image.tmdb.org/t/p/w500/${element.backdrop_path}`
  const recommendations_movie_title=document.createElement("p");
  recommendations_movie_title.classList.add("recommendations-movie-title");
  recommendations_movie_title.innerText=element.title;

  recommendations_movie.appendChild(recommendations_movie_img);
  recommendations_movie.appendChild(recommendations_movie_title);
recommendations_container.appendChild(recommendations_movie);
  
}
     



  });

  fetch(credits).then(res => res.json()).then(data => {
      let cast=[]
      if(data.cast){
        for(let i = 0; i < 5; i++){
          cast.push(data.cast[i].name ) ;
      }

      $('.starring-list').html(cast.toString());

      }
    


  });


  fetch(videos).then(res => res.json()).then(data => {
  
      let maxClips = data.results.length < 7 ? data.results.length:5;
      let html=``;
      if(data.results.length){
     html=html+`<div class="main-video mb-10 px-10">
     <iframe class="mb-3 "  src="https://youtube.com/embed/${data.results[0].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

     </div>`

      }
      html=html+`
      <div class="videos sm:grid sm:grid-cols-2 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 gap-4">
      
      `

      for(let i = 1; i < maxClips; i++){
  
          html += `
          <iframe class="mb-3"  src="https://youtube.com/embed/${data.results[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `;
      }



      $('.trailer-container').html(html+" </div>");

    


  });



 
  
  
}
//delete_rate(385128);
//rate(512195,5);
const overlay = document.querySelector('.modal-overlay')
overlay.addEventListener('click', ()=>{toggleModal();clearDetails();})

var closemodal = document.querySelectorAll('.modal-close')
for (var i = 0; i < closemodal.length; i++) {
  closemodal[i].addEventListener('click',  ()=>{toggleModal();clearDetails();})
}
const ratingStars = [...document.getElementsByClassName("rating__star")];
executeRating(ratingStars);  
const Search_form=document.querySelector("#Search");
Search_form.addEventListener("submit",(e)=>{
e.preventDefault();
const search_word=document.querySelector(".search-word").value
sessionStorage.setItem('SearchWord', search_word);
window.location="search.html"
})


getRatedMoves();
const mylists=['rated','favorite','watchlist'];
mylists.map((l)=>{
  get_list(l);
})
