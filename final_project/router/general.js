const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

function prettyFormat(object) {
  return JSON.stringify(object, null, 4);
}

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: 'User successfully registered. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }

  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const booksPromise = new Promise((resolve, reject) => {
    resolve(books);
  });

  booksPromise.then((books) => {
    res.send(JSON.stringify({ books }, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const matchedBook = books[isbn];

    if (matchedBook) {
      resolve(matchedBook);
    } else {
      reject('Unable to find book!');
    }
  });

  bookPromise
    .then((book) => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      res.send(error);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const booksPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchedBooks = {};

    for (const key of bookKeys) {
      const book = books[Number(key)];
      const isMatch = book.author === author;

      if (isMatch) {
        matchedBooks[key] = books[key];
      }
    }

    resolve(matchedBooks);
  });

  booksPromise.then((books) => {
    res.send(JSON.stringify({ books }, null, 4));
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const booksPromise = new Promise((resolve, reject) => {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchedBooks = {};

    for (const key of bookKeys) {
      const book = books[Number(key)];
      const isMatch = book.title === title;

      if (isMatch) {
        matchedBooks[key] = books[key];
      }
    }

    resolve(matchedBooks);
  });

  booksPromise.then((books) => {
    res.send(JSON.stringify({ books }, null, 4));
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(prettyFormat({ reviews: books[isbn].reviews }));
});

module.exports.general = public_users;
