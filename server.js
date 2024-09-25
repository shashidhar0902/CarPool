const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Assuming HTML, CSS, JS files are in a folder named 'public'

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database setup
const db = new sqlite3.Database('carpool.db');

// Endpoint to add carpool data
app.post('/addCarpool', (req, res) => {
    const { Name, phno, origin, destination, price, vacancies, datetime } = req.body;
    const insertSQL = `
        INSERT INTO carpool (Name, phno, origin, destination, price, datetime, vacancies)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(insertSQL, [Name, phno, origin, destination, price, datetime, vacancies], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error inserting data' });
        }
        res.status(200).json({ message: 'Carpool created successfully!', id: this.lastID });
    });
});

// Endpoint to fetch all carpool data
app.get('/getCarpools', (req, res) => {
    const selectSQL = `SELECT * FROM carpool`;

    db.all(selectSQL, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.json(rows);
    });
});

// Endpoint to delete a carpool entry by ID
app.delete('/deleteCarpool/:id', (req, res) => {
    const id = req.params.id;
    const deleteSQL = `DELETE FROM carpool WHERE Id = ?`;

    db.run(deleteSQL, id, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting data' });
        }
        res.status(200).json({ message: 'Carpool deleted successfully!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
