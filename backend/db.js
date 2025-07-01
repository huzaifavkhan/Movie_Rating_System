const { Pool } = require('pg');

// Set up a connection pool for PostgreSQL using the connection string from environment variables
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "huzaifa123",
    database: "Movies"
});

module.exports = pool;
