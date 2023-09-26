const mysql = require("mysql");
const environment = process.env.APP_ENVIRONMENT;
console.log(environment);

// Connect to db

if (environment == "LOCAL") {
    const pool = mysql.createConnection({
        user: "cs3099user15",
        host: "127.0.0.1",
        database: "cs3099user15_PuzzleFlix", // public database
        password: "y!pqA34S8sgEJy", // key to our school server's mariaDB 
        port: 3306,
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
} else if (environment == "PRODUCTION") {
    const pool = mysql.createConnection({
        user: "cs3099user15",
        host: "cs3099user15.host.cs.st-andrews.ac.uk",
        database: "cs3099user15_PuzzleFlix", // public database
        password: "y!pqA34S8sgEJy", // key to our school server's mariaDB 
        port: 3306,
    });

    pool.connect((err) => {
        if (err) {
            console.log("PROD FAIL!");
            throw err;
        } else {
            console.log("Database Connected!");
        }
    });

    module.exports = pool;
} else if (environment == "TEST"){
    const pool = mysql.createConnection({
        user: "cs3099user15",
        host: "cs3099user15.host.cs.st-andrews.ac.uk",
        database: "cs3099user15_PuzzleFlix_Test", // Test database
        password: "y!pqA34S8sgEJy", // key to our school server's mariaDB 
        port: 3306,
    });
    console.log('test database connected');
    pool.connect((err) => {
        if (err) {
            //console.log("TESTA FAIL!");
            throw err;
        } else {
            //console.log("Database Connected!");
        }
    });
    module.exports = pool;
}else {
    console.log("Incorrect environemnt: Options are LOCAL and PRODUCTION");
}
