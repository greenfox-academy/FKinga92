'use strict';

const express = require('express');
const mysql = require('mysql');
const app = express();

app.use('/assets', express.static('./assets'));
app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bookstore'
});

app.get('/titles', (req, res) => {
  conn.query('SELECT book_name FROM book_mast;', (err, rows) => {
    if(err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.send(rows);
  });
});

app.get('/books', (req, res) => {
  const requestQuery = req.query;
  let myQuery = 'SELECT book_name, aut_name, cate_descrip, pub_name, book_price ' +
                'FROM book_mast ' +
                'INNER JOIN author ON book_mast.aut_id = author.aut_id ' +
                'INNER JOIN category ON book_mast.cate_id = category.cate_id ' +
                'INNER JOIN newpublisher ON book_mast.pub_id = newpublisher.pub_id ';
  
  if (Object.keys(requestQuery).length > 0) {
    myQuery += 'WHERE ';
    if (requestQuery.hasOwnProperty('category')) {
      myQuery += `AND cate_descrip LIKE '%${requestQuery.category}%'`;
    }
    if (requestQuery.hasOwnProperty('publisher')) {
      myQuery += `AND pub_name LIKE '%${requestQuery.publisher}%'`;
    }
    if (requestQuery.hasOwnProperty('plt')) {
      myQuery += `AND book_price < ${requestQuery.plt}`;
    }
    if (requestQuery.hasOwnProperty('pgt')) {
      myQuery += `AND book_price > ${requestQuery.pgt}`;
    }
    myQuery = myQuery.replace('WHERE AND ', 'WHERE ');
    myQuery += ';'
  }

  conn.query(myQuery, (err, rows) => {
    if(err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.send(rows);
  })
});

app.listen(8080, () => {
  console.log('the app is listening.');
});
