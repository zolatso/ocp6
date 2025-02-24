
function getMysteryFilms() {
    let results = []
    Promise.all([
        fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Mystery')
          .then(response => response.json()),
        fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Mystery&page=2')
          .then(response => response.json())
      ])
      .then(([data1, data2]) => {
        // Add all results once both fetches are complete
        results.push(...data1.results, ...data2.results);

        let divList = ''
        let i = 0;

        while (i < 6) {
            console.log(results[i].title)
            divList += '<div class="film">'
            divList += `<div class="film_overlay"><p>${results[i].title}</p></div>`
            divList += `<img class="film_thumbnail" src="${results[i].image_url}"></img>`
            divList += '</div>'
            i++
        }

        // Get the element where we want to display the data
        const displayElement = document.getElementById('cat_container_1');    

        // Insert the 6 divs
        displayElement.innerHTML = divList
    })
    .catch(error => console.error('Error:', error));
}