// Basic GET request
function fetchData() {
    fetch('http://localhost:8000/api/v1/titles/')
    .then(response => {
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Get the element where we want to display the data
        const displayElement = document.getElementById('display_data');
            
        // Create a list of object properties
        const objectList = Object.entries(data).map(([key, value]) => {
            return `<li><strong>${key}:</strong> ${value}</li>`;
        }).join('');

        // Display as a formatted list
        displayElement.innerHTML = `
            <ul>
                ${objectList}
            </ul>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}