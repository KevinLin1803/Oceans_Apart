const { Pool } = require('pg')

require('dotenv').config()

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: "To-Do-App"
})

module.exports = pool
