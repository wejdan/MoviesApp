const search_word=sessionStorage.getItem('SearchWord');
let page=1;
var total_pages;
const header=document.querySelector('.search-name');
header.innerText=search_word;
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
`$(window).scroll(function() {
    if($(document).scrollTop() + $(window).height() >= $(document).height()) {
        if(page<total_pages){
            page=page+1;
            fetch_page();
    
          }
          else{
            moives_container.innerHTML=moives_container.innerHTML+"<h1> end of the page </h1>"
          }    }
  });`




function fetch_page(){
    const search_url= `https://api.themoviedb.org/3/search/movie?query=${search_word}&api_key=${APP_KEY}&page=${page}`;
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