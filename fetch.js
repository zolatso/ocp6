function getSingleFilm(id) {
  const url = "http://localhost:8000/api/v1/titles/" + id;
  return  fetch(url)
  .then(response => response.json())
  .then(data => { return data })
}

function getTopFilms(url) {
  const url_page_2 = url + '&page=2'
  let results = []
  return Promise.all([
        fetch(url)
          .then(response => response.json()),
        fetch(url_page_2)
          .then(response => response.json())
      ])
      .then(([data1, data2]) => {
        // Add all results once both fetches are complete
        results.push(...data1.results, ...data2.results);
        return results
  })
}

function getGenres() {
  let genres = [];
  let results = [];
  let url = 'http://localhost:8000/api/v1/genres/'
  return Promise.all([
    fetch(url)
      .then(response => response.json()),
    fetch(url + '?page=2')
      .then(response => response.json()),
    fetch(url + '?page=3')
      .then(response => response.json()),
    fetch(url + '?page=4')
      .then(response => response.json()),
    fetch(url + '?page=5')
      .then(response => response.json())
  ])
  .then(([data1, data2, data3, data4, data5]) => {
    results.push(...data1.results, ...data2.results, ...data3.results, ...data4.results, ...data5.results);
    for (let i = 0; i < results.length; i++) {
      genres.push(results[i].name);
    }
    return genres
  })
}

async function openModal(id){
  const film = await getSingleFilm(id)
  document.getElementById("modal_headers").innerHTML = film.title
  let genres = film.genres.join(", ")
  document.getElementById("modal_headers").innerHTML += film.year + " - " + genres
  document.getElementById("modal_header_img").innerHTML = `<img src="${film.image_url}">`
}
  
async function getFilmBoxes(container_id, genre) {
    let url;
    if (genre) {
      url = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}`
    } else {
      url = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score'
    }
    const results = await getTopFilms(url);
    let divList = ''
    let i = 0;
    while (i < 6) {
        divList += '<div class="col-12 col-md-6 col-lg-4 mb-3">'
        divList += '<div class="card bg-dark text-white img-fluid">'
        divList += `<img class="card-img" src="${results[i].image_url}"></img>`
        divList += '<div class="card-img-overlay" style="background-color: #aaa; opacity: 0.5; height:35%;">'
        divList += `<p>${results[i].title}</p>`
        divList += `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="openModal(${results[i].id})">Details</button>`
        divList += '</div>'
        divList += '</div>'
        divList += '</div>'
        i++
    }
  
    // Get the element where we want to display the data
    const displayElement = document.getElementById(container_id);    
  
    // Insert the 6 divs
    displayElement.innerHTML = divList
  
  }
  
async function populateList() {
    const genres = await getGenres();
    let selectList;
    for (let i = 0; i < genres.length; i++) {
      selectList += `<option value="${genres[i]}">${genres[i]}</option>`
    }
    const list = document.getElementById("select_list_1");
    list.innerHTML = selectList
  }

async function getTopBox() {
  const all_films = await getTopFilms('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
  const film = await getSingleFilm(all_films[0].id)
  document.getElementById("top_img").src = film.image_url
  document.getElementById("top_box_title").innerHTML = film.title
  document.getElementById("top_box_description").innerHTML = film.description
}


// Main function
function loadInitial() {
  getTopBox()
  getFilmBoxes("cat_container_1", false)
  getFilmBoxes("cat_container_2", "Mystery")
  getFilmBoxes("cat_container_3", "Comedy")
  populateList()
}