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
  let genres = film.genres.join(", ")
  let countries = film.countries.join(", ")
  let gross_income = film.worldwide_gross_income != null ? film.worldwide_gross_income : 'N/A'
  let directors = film.directors.join(", ")
  let actors = film.actors.join(", ")
  let modal_headers = ''
  let modal_img = ''
  let modal_main_text = ''

  modal_headers += `<h3>${film.title}</h3>`
  modal_headers += `<h5>${film.year} - ${genres}</h5>`
  modal_headers += `<h5>${film.rated} - ${film.duration} minutes (${countries})</h5>`
  modal_headers += `<h5>IMDB Score: ${film.imdb_score}/10</h5>`
  modal_headers += `<h5>Recettes au box office: ${gross_income}</h5>`
  modal_headers += `<p></p>`
  modal_headers += `<p><b>Realisé par:</b></p>`
  modal_headers += `<p>${directors}</p>`

  modal_img = `<img src="${film.image_url}">`

  modal_main_text += `<p>${film.long_description}</p>`
  modal_main_text += `<p><b>Avec:</b></p>`
  modal_main_text += `<p>${actors}</p>`
  
  console.log(modal_main_text)

  document.getElementById("modal_headers").innerHTML = modal_headers
  document.getElementById("modal_header_img").innerHTML = modal_img
  document.getElementById("modal_main_text").innerHTML = modal_main_text
  
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
  document.getElementById("top_film_button").setAttribute('onclick', `openModal(${film.id})`)
}


// Main function
function loadInitial() {
  getTopBox()
  getFilmBoxes("cat_container_1", false)
  getFilmBoxes("cat_container_2", "Mystery")
  getFilmBoxes("cat_container_3", "Comedy")
  populateList()
}