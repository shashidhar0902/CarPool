document.getElementById('carpoolForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phno = document.getElementById('phno').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const price = parseFloat(document.getElementById('price').value);
    const vacancies = parseInt(document.getElementById('vacancies').value);

    const response = await fetch('/addCarpool', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Name: name,
            phno: phno,
            origin: origin,
            destination: destination,
            price: price,
            vacancies: vacancies,
            datetime: new Date().toISOString(),
        }),
    });

    const result = await response.json();
    alert(result.message);
    document.getElementById('carpoolForm').reset();

    // Refresh the table after adding a new carpool
    fetchCarpools();
});

async function fetchCarpools() {
    const response = await fetch('/getCarpools');
    const data = await response.json();
    const tableBody = document.getElementById('carpoolTable').getElementsByTagName('tbody')[0];

    // Clear existing rows
    tableBody.innerHTML = '';

    // Populate table with new data
    data.forEach(row => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${row.Id}</td>
            <td>${row.Name}</td>
            <td>${row.phno}</td>
            <td>${row.origin}</td>
            <td>${row.destination}</td>
            <td>${row.price}</td>
            <td>${row.datetime}</td>
            <td>${row.vacancies}</td>
            <td><button class="delete-btn" data-id="${row.Id}">Delete</button></td> <!-- Delete button -->
        `;
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            await deleteCarpool(id);
        });
    });
}

async function deleteCarpool(id) {
    const response = await fetch(`/deleteCarpool/${id}`, {
        method: 'DELETE',
    });

    const result = await response.json();
    alert(result.message);
    fetchCarpools(); // Refresh the table
}

// Call fetchCarpools on page load
fetchCarpools();
