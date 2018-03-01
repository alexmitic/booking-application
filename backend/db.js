const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
})

// pool.query('SELECT * FROM test', (err, res) => {
//   console.log("Result" + res.rows[0].id)
//   pool.end()
// })

module.exports = pool;