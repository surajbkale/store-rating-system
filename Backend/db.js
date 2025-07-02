const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


pool.connect((err, client, release) => {
    if (err) {
        return console.error("Error connection to the databse ", err)
    }
    console.log("Connected to PostgreSQL...");
    release();
})

module.exports = pool;