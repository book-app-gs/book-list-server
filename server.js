'use strict'

// export PORT=3000
// export CLIENT_URL=http://localhost:8000
// export DATABASE_URL=postgres://localhost:5432/books_app
// export DATABASE_URL=postgres://postgres:sunitha@localhost:5432/books_app 


const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/index', (req, res) => {
    resp.sendFile('index.html', {root: './public'});
  });

//retrieve an array of book objects from the database, limited to only the book_id, title, author, and image_url.
app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT book_id, title, author, image_url FROM books`)
      .then(result => {
        res.send(result.rows);
        console.log('select status code-' + res.statusCode);
    })
    .catch(err => {
        console.error(err)
    });
});

//to simmulate the call being made from the view js
//to test the following - if you cant test in browser bar use ----$.get('http://localhost:3000/api/v1/books/3')
app.get('/api/v1/books/:id', (req, res) => {
    client.query(`SELECT * FROM books WHERE book_id=${req.params.id}`)
      .then(result => {
        res.send(result.rows);
        console.log('select status code-' + res.statusCode);
    })
    .catch(err => {
        console.error(err)
    });
});

//testing - $.post('http://localhost:3000/api/v1/books', {title:"Hello", author: "Gregor", isbn: "123", image_url: "this.image_url", description: "this.description"})
app.post('/api/v1/books', (req, res) => {
 
    let {title, author, isbn, image_url, description} = req.body;
    client.query(
      'INSERT INTO books (title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [title, author, isbn, image_url, description]
     )
    .catch(err => console.error(err))
});


// `DELETE FROM books WHERE book_id=${req.params.id}` - dont do this cause it risks what is being passed in params.id
app.delete('/api/v1/books/:id', (req, res) => {
  client.query(
    `DELETE FROM books WHERE book_id=$1;`,
    [req.params.id]
  )
  .then(() => res.status(204).send('Book deleted'))
  .catch(err => {
      console.error(err)
  });
});

// testing: 
// $.ajax({ url: 'http://localhost:3000/api/v1/book/8', method: 'PUT', data: { title:"Hello", author: "Gregor", isbn: "123", image_url: "image.jpg", description: "this is a description" } })
app.put('/api/v1/books/:id', (req, res) => {
  let {title, author, isbn, url, description} = req.body;

  console.log('inside book update PUT', title, author, isbn, url, description);
  client.query(`UPDATE books
      SET title=$1,
      author=$2,
      isbn=$3,
      image_url=$4, 
      description=$5 WHERE book_id=$6`,

    [title, author, isbn, image_url, description, req.params.id]
  )
  .then(() => res.send('Update complete'))
  .catch(console.error);
});

// app.use would apply to any page, so it's more efficient. Still rmemeber to place it at the bottom.
app.use((req, res) => {
    res.status(404).send('sorry, route does not exist.');
});

createBooks();

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


// <<<<<<<<<<<<,<<>>>>>>>>>>>>>>>>>>>

function loadBooks() {
    client.query('SELECT COUNT(*) FROM books')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('./data/books.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
            INSERT INTO
            books (title, author, isbn, image_url, description)
            VALUES ($1, $2, $3, $4, $5);
          `,
            [ele.title, ele.author, ele.isbn, ele.image_url, ele.description])

            .catch(console.error);
          })
        })
      }
    })
  }

  function createBooks() {
    client.query(`
      CREATE TABLE IF NOT EXISTS books (
        book_id SERIAL PRIMARY KEY,
        author VARCHAR(50) NOT NULL,
        title VARCHAR(50) NOT NULL,
        isbn VARCHAR (50),
        image_url VARCHAR(500),
        description TEXT NOT NULL);`
    )
      .then(() => {
        console.log('created table')
        loadBooks();
      })
      .catch(err => {
        console.error(err);
      });
  }

  // initial server.js test - app.get('/', (req, res) => res.send('Testing 1, 2, 3'));