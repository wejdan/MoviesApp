

let genres_list_http = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APP_KEY}`;

async function getPopularMovies(){
  let page= Math.floor(Math.random() * 3) + 1

  const url=`https://api.themoviedb.org/3/trending/movie/day?api_key=${APP_KEY}&page=${page}`;
  const response=await fetch(url);
  const results=await response.json();
  createPopularMovies(results.results);

}
async function createPopularMovies(list_movies){
  const moives_container=document.querySelector('.popular-list');
    let html=``;
    moives_container.innerHTML='';
    for (let index = 0; index < 5; index++) {
        const element = list_movies[index];
       
        let  poster=element.poster_path;
        if (poster==null){
          poster=element.backdrop_path;
        }

        const movie=document.createElement("div");
        movie.classList.add("movie-popular");
      
      
        const movie_img=document.createElement("img");
        movie_img.src=img_url+poster;
      
        movie.addEventListener("click",()=>{
          showDetails(element.id)
      })
      
      
        movie.appendChild(movie_img);
   
        
        moives_container.appendChild(movie);



        
        
    }


    

}
async function getMovesByGeners(id){
    let page= Math.floor(Math.random() * 3) + 1
    let movie_genres_http = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${APP_KEY}&page=${page}`;

    const response=await fetch(movie_genres_http);
    const results=await response.json();
 
    createMoviesSliders(id,results.results);
}

async function getAllGeners(){

    const response=await fetch(genres_list_http);
    const results=await response.json();

    createMoviesLists(results.genres);
   
  
   results.genres.map((genre)=>{getMovesByGeners(genre.id)})
    
    
}
function showCategory(id,name){

  sessionStorage.setItem('category', id);
  sessionStorage.setItem('category-name', name);
window.location="genre.html"
}
function createMoviesLists(genres){
    const genres_container=document.querySelector(".genres");
    let html=``;

    for (let index = 0; index < genres.length; index++) {
        const element = genres[index];
        let move_list=document.createElement("div");
        move_list.className="movie-list"
        let header=document.createElement("h1");
        header.className="movie-category pl-2 capitalize mb-10 text-lg font-bold"
  
        header.innerHTML=element.name+" Movies"+`<svg xmlns="http://www.w3.org/2000/svg" class="icon ml-5 inline opacity-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>`
        header.addEventListener('click',()=>{showCategory( element.id,element.name+" Movies")})
        move_list.appendChild(header);

        let movie_slider=document.createElement("div");
        movie_slider.className="movie-slider"
        movie_slider.id=`movies_${element.id}`;

        movie_slider.innerHTML=`

        <div class="flex justify-center items-center">
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
      </div>
     


    `
    move_list.appendChild(movie_slider);
    genres_container.appendChild(move_list);
        
        
    }
  
    
   


}
function init_slider(selector){
    $(selector).slick({
        infinite: true,
        slidesToShow: 3,
        
        slidesToScroll: 3,
    
        mobileFirst:true,
         responsive: [
         {
          breakpoint: 1300,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
            infinite: true,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4
          }
        }]
      });
}


function AddToList(id){

}
async function createMoviesSliders(id,movies){
    const moives_container=document.querySelector(`#movies_${id}`);
    let html=``;
    moives_container.innerHTML='';
    for (let index = 0; index < movies.length; index++) {
        const element = movies[index];
        if(document.getElementById(`${element.id}_movie`)){
          continue
        }

        let movie=await create_movie(element);

   
        
        moives_container.appendChild(movie);



        
        
    }

    init_slider(`#movies_${id}`);

    



}
getPopularMovies();
getAllGeners();