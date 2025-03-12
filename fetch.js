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

  modal_headers += `<h2>${film.title}</h2>`
  modal_headers += `<h4>${film.year} - ${genres}</h4>`
  modal_headers += `<h4>${film.rated} - ${film.duration} minutes (${countries})</h4>`
  modal_headers += `<h4>IMDB Score: ${film.imdb_score}/10</h4>`
  modal_headers += `<h4>Recettes au box office: ${gross_income}</h4>`
  modal_headers += `<p></p>`
  modal_headers += `<p><b>Realisé par:</b></p>`
  modal_headers += `<p>${directors}</p>`

  modal_img = `<img class="img-fluid" src="${film.image_url}">`

  modal_main_text += `<p>${film.long_description}</p>`
  modal_main_text += `<p><b>Avec:</b></p>`
  modal_main_text += `<p>${actors}</p>`

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
    //const box_id_row_1 = container_id + "_boxid1"
    const box_id_row_2 = container_id + "_boxid2"
    const box_id_row_3 = container_id + "_boxid3"
    while (i < 6) {
      let line1 = ''
      if (i < 2) {
        line1 = `<div class="col-12 col-md-6 col-lg-4 mb-3">`
      } else if (i > 1 && i < 4) {
        line1 = `<div class="col-12 col-md-6 col-lg-4 mb-3 d-none d-md-block" id="${container_id}_box_${i}">`
      } else {
        line1 = `<div class="col-12 col-md-6 col-lg-4 mb-3 d-none d-lg-block" id="${container_id}_box_${i}">`
      }
        divList += line1
        divList += '<div class="card bg-dark text-white ratio ratio-1x1 overflow-hidden">'
        divList += `<img class="card-img w-100 h-auto object-fit-cover" src="${results[i].image_url}" alt="Thumbnail image: ${results[i].title}"></img>`
        divList += '<div class="card-img-overlay">'
        divList += '<div class="overlay-strip">'
        divList += `<p>${results[i].title}</p>`
        divList += `<button class="btn btn-secondary overlay-button" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="openModal(${results[i].id})">Details</button>`
        divList += '</div>'
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

function toggleButtonText(button) {
  if (button.innerHTML === "Voir plus") {
    button.innerHTML = "Voir moins"
  } else if (button.innerHTML === "Voir moins") {
    button.innerHTML = "Voir plus"
  }
}

function toggleFilms(button_id, container_id) {
  const button = document.getElementById(button_id)
  const state = button.innerHTML === "Voir plus" ? 0 : 1
  const row_2 = [document.getElementById(container_id + "_box_2"), document.getElementById(container_id + "_box_3")];
  const row_3 = [document.getElementById(container_id + "_box_4"), document.getElementById(container_id + "_box_5")];
  if (state == 0) {
    row_2[0].classList.remove("d-none")
    row_2[0].classList.remove("d-md-block")
    row_2[1].classList.remove("d-none")
    row_2[1].classList.remove("d-md-block")
    row_3[0].classList.remove("d-none")
    row_3[0].classList.remove("d-sd-block")
    row_3[1].classList.remove("d-none")
    row_3[1].classList.remove("d-sd-block")
  } else if (state == 1) {
    row_2[0].classList.add("d-none")
    row_2[0].classList.add("d-md-block")
    row_2[1].classList.add("d-none")
    row_2[1].classList.add("d-md-block")
    row_3[0].classList.add("d-none")
    row_3[0].classList.add("d-sd-block")
    row_3[1].classList.add("d-none")
    row_3[1].classList.add("d-sd-block")
  } 
  toggleButtonText(button)
}


// Main function
function loadInitial() {
  getTopBox()
  getFilmBoxes("cat_container_1", false)
  getFilmBoxes("cat_container_2", "Mystery")
  getFilmBoxes("cat_container_3", "Comedy")
  populateList()
}