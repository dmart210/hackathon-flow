// 📂 backend/hackathon-flow/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'waga_db',
  password: 'mypassword',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
