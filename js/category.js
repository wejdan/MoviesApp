const category=sessionStorage.getItem('category');
const category_name=sessionStorage.getItem('category-name');


let page=1;
var total_pages;
const header=document.querySelector('.category-name');
header.innerText=category_name;
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
     const search_url=`https://api.themoviedb.org/3/discover/movie?api_key=${APP_KEY}&with_genres=${category}&page=${page}`
   
   
    showLoader();

    setTimeout(async ()=>{
    fetch(search_url).then(res => res.json()).then(data => {
       
        total_pages=data.total_pages;
        
      
        for (let index = 0; index < data.results.length; index++) {
            const element = data.results[index];
         create_movie(element).then((movie)=>{
            moives_container.appendChild(movie);


         })


            
            
        }
        hideLoader();
        
        
        });
        },1);
}

fetch_page();