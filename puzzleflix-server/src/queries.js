const mysql = require("mysql");
const environment = process.env.APP_ENVIRONMENT;
console.log(environment);

// Connect to db

const pool = mysql.createConnection({
    connectionLimit: 10,
    user: "cs3099user15",
    host: "68.183.38.239",
    database: "cs3099user15_PuzzleFlix", // public database
    password: "y!pqA34S8sgEJy", // key to our school server's mariaDB 
    port: 3306,
    waitForConnections: true,
    timeout: 60000 // 60 seconds
});

pool.connect((err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log("Database Connected!");
    }
});
module.exports = pool;
