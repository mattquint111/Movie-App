// initial values
const API_KEY = "0310c1a97f001b72c2466fdfc9e4f305";
const endpointSearchMovie =
  "http://api.themoviedb.org/3/search/movie?api_key=0310c1a97f001b72c2466fdfc9e4f305&query=";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500/";

// selecting elements from the dom
const buttonElement = document.getElementById("search");
const inputElement = document.getElementById("inputValue");
const moviesSearchable = document.getElementById("movies-searchable");

// functions

function movieSection(movies) {
  return movies.map((movie) => {
    if (movie.poster_path) {
      return `<img  src=${IMAGE_URL + movie.poster_path}  data-movie-id=${
        movie.id
      }/>`;
    }
  });
}

function createMovieContainer(movies) {
  const movieElement = document.createElement("div");
  movieElement.setAttribute("class", "movie");

  const movieTemplate = `
        <section class="section">
           ${movieSection(movies)}
        </section>
        <div class="content">
            <p id="content-close">X</p>
        </div>
     `;

  movieElement.innerHTML = movieTemplate;
  return movieElement;
}

function renderSearchMovies(data) {
  moviesSearchable.innerHTML = "";
  const movies = data.results;
  const movieBlock = createMovieContainer(movies);
  moviesSearchable.appendChild(movieBlock);
}

function generateUrl(path) {
  const url = `http://api.themoviedb.org/3${path}?api_key=0310c1a97f001b72c2466fdfc9e4f305`;
  return url;
}

function requestMovies(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete)
        .catch(onError);
}

 function searchMovie(value) {
    const path = "/search/movie";
    const url = generateUrl(path) + "&query=" + value;

    requestMovies(url, renderSearchMovies, handleError)
}

function handleError(error) {
    console.log('Error: ', error)
}

// click event on submit button
buttonElement.addEventListener("click", function (event) {
  event.preventDefault();
  const value = inputElement.value;
  searchMovie(value)

  inputElement.value = "";
});

function createIframe(video) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${video.key}`;
  iframe.width = 360;
  iframe.height = 315;
  iframe.allowFullscreen = true;

  return iframe;
}

function createMovieTemplate(data, content) {
  content.innerHTML = "<p id='content-close'>X</p>"

  const videos = data.results;
  const length = videos.length > 4 ? 4 : videos.length;
  const iframeContainer = document.createElement("div");

  for (let i = 0; i < length; i++) {
    const video = videos[i];
    const iframe = createIframe(video);
    iframeContainer.appendChild(iframe);
    content.appendChild(iframeContainer);
  }

}

//event delegation
document.onclick = function (event) {
  const target = event.target;

  if (target.tagName.toLowerCase() === "img") {
    const movieId = target.dataset.movieId;
    console.log(movieId);
    const section = target.parentElement;
    const content = section.nextElementSibling;
    content.classList.add("content-display");

    const path = `/movie/${movieId}videos`;
    const url = generateUrl(path);

    //fetch movie videos
    fetch(url)
      .then((res) => res.json())
      .then((data) => createMovieTemplate(data, content))
      .catch((error) => console.log("Error: ", error));
  }

  if (target.id === "content-close") {
    const content = target.parentElement;
    content.classList.remove("content-display");
  }
};
