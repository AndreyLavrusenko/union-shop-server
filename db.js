const mysql = require("mysql2");

const union_pool = mysql.createPool({
    host: process.env.UNION_HOST,
    user: process.env.UNION_USER,
    database: process.env.UNION_DB,
    password: process.env.UNION_PASSWORD,
    port: 3306
});


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});



module.exports = {
    pool,
    union_pool,
};