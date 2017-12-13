'use strict'

// export PORT=3000
// export CLIENT_URL=http://localhost:8000
// export DATABASE_URL=postgres://localhost:5432/task_app
// export DATABASE_URL=postgres://postgres:sunitha@localhost:5432/books_app 


const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/index', (req, res) => {
    resp.sendFile('index.html', {root: './public'});
  });

  
//app.get('/', (req, res) => res.send('Testing 1, 2, 3'));


//retrieve an array of book objects from the database, limited to only the book_id, title, author, and image_url.
app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT book_id, title, author, image_url FROM books`)
      .then(result => {
        res.send(result.rows);
        console.log('select status code-' + res.statusCode);
        console.log('select method-' + res.Method);
    })
    .catch(err => {
        console.error(err)
    });
});


// app.use would apply to any page, so it's more efficient. Still rmemeber to place it at the bottom.
app.use((req, res) => {
    res.status(404).send('sorry, route does not exist.');
});

//createBooks();

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


// <<<<<<<<<<<<,<<>>>>>>>>>>>>>>>>>>>
// function loadBooks() {
//     client.query('SELECT COUNT(*) FROM books')
//     .then(result => {
//       if(!parseInt(result.rows[0].count)) {
//         fs.readFile('./data/books.json', 'utf8', (err, fd) => {
//           JSON.parse(fd).forEach(ele => {
//             client.query(`
//             INSERT INTO
//             books (title, author, isbn, image_url, description)
//             VALUES ($1, $2, $3, $4, $5);
//           `,
//             [ele.title, ele.author, ele.isbn, ele.image_url, ele.description])

//             .catch(console.error);
//           })
//         })
//       }
//     })
//   }

//   function createBooks() {
//     client.query(`
//       CREATE TABLE IF NOT EXISTS books (
//         book_id SERIAL PRIMARY KEY,
//         author VARCHAR(50) NOT NULL,
//         title VARCHAR(50) NOT NULL,
//         isbn VARCHAR (50),
//         image_url VARCHAR(500),
//         description TEXT NOT NULL);`
//     )
//       .then(() => {
//         console.log('created table')
//         loadBooks();
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   }
