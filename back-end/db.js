const { Pool } = require('pg')

require('dotenv').config()

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    port: process.env.DBPORT,
    password: process.env.PASSWORD,
    database: "To-Do-App",
    max: 20,               // Reduce max connections to make debugging easier
    idleTimeoutMillis: 1000,  // Reduce idle timeout to clean up faster
    connectionTimeoutMillis: 1000, // Fail fast if can't connect
    allowExitOnIdle: true    // Allow the pool to exit if all clients are idle
})

pool.on('error', (err, client) => {
    console.error('Database pool error:', err)
    if (err.code === '57P01') { // connection lost error
        console.log('Attempting to reconnect...')
        client.release(true) // force release with error
    }
})

module.exports = pool
