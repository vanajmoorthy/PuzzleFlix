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

function handleDisconnect(conn) {
    conn.on('error', function (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNRESET') {
            console.error('Database connection was closed.');
            reconnect(conn);
        } else {
            throw error;
        }
    });
}

function reconnect(conn) {
    console.log('Reconnecting to database...');
    // Create a new connection
    conn = mysql.createConnection(conn.config);
    handleDisconnect(conn);
    conn.connect(function (error) {
        if (error) {
            console.error('Error when reconnecting to the database:', error);
            setTimeout(reconnect, 2000, conn);
        } else {
            console.log('Successfully reconnected to the database.');
        }
    });
}

handleDisconnect(pool);

pool.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database.');
    }
});
module.exports = pool;
