


let page=1;
var total_pages;

const moives_container=document.querySelector('.movie-list');
const loader = document.querySelector('.load');
const hasMorePages = () => {
    if(page<total_pages){
        return true;
    }

    else{
        return false;
    }
};
const hideLoader = () => {
    loader.classList.remove('show');
};

const showLoader = () => {
    loader.classList.add('show');
};

window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMorePages()) {
            page=page+1;
            fetch_page();
    }
}, {
    passive: true
});




function fetch_page(){
   
   
    showLoader();

    setTimeout(async ()=>{
        let favorite_movies=get_list("favorite");
        if(favorite_movies){
          let list_movies= favorite_movies;
     
      
       
        
      
        for (let index = 0; index < list_movies.length; index++) {
            const id = list_movies[index];
            let movie_detail_http = `https://api.themoviedb.org/3/movie/${id}?api_key=${APP_KEY}`;
            const response=await fetch(movie_detail_http);
            const results=await response.json();
            let poster=results.backdrop_path;
            if (poster==null){
              poster=results.poster_path;
      
            }
            const movie=document.createElement("div");
            movie.classList.add("movie");
            movie.id=results.id;
    
        
            const movie_img=document.createElement("img");
            movie_img.src=img_url+poster;
          
            const movie_title=document.createElement("p");
            movie_title.classList.add("movie-title");
            movie_title.addEventListener("click",()=>{
                showDetails(results.id)
            })
          
            movie_title.innerText=results.title

            const remove_from_list=document.createElement("div");
            remove_from_list.addEventListener('click',()=>{
                show_overlay_load();
                
                Mark_as_Favorite(results.id)
                 
                
              


                removeElement(results.id);
                hide_load();
            })
     
            remove_from_list.innerHTML=`<i class="trash-icon absolute top-3 opacity-0 right-2 fa-lg h-6 w-6 fas fa-trash"></i>`

        
            movie.appendChild(movie_img);
            movie.appendChild(movie_title);
            movie.appendChild(remove_from_list);
            moives_container.appendChild(movie);
            $(remove_from_list).prop('title', 'Remove From Favourite');


            
            
        }
        hideLoader();
        
        
        }
        },1);
}

fetch_page();
