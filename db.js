const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.UNION_HOST,
    user: process.env.UNION_USER,
    database: process.env.UNION_DB,
    password: process.env.UNION_PASSWORD,
    port: 3306
});


module.exports = pool;