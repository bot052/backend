// @ts-check
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: process.env.DB_DATABASE,
});

connection.connect();

module.exports = connection;
