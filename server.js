'use strict'

// export PORT=3000
// export CLIENT_URL=http://localhost:8000
// export DATABASE_URL=postgres://localhost:5432/task_app

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 4040;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));


//retrieve an array of book objects from the database, limited to only the book_id, title, author, and image_url.
app.get('/api/v1/books', (request, response) => {
    client.query(`SELECT book_id, title, author, and image_url FROM books`)
      .then(result => {
        response.send(result.rows);
        response.send('results', result);
        console.error('error from get request',err);
    })
    .catch(err => {
        console.error(err)
    });


// app.use would apply to any page, so it's more efficient. Still rmemeber to place it at the bottom.
app.use((req, res) => {
    res.status(404).send('sorry, route does not exist.');
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`)); // keep last