const sqlite3 = require('sqlite3');
let db;

new dqlite3.Database('./db', sqlite3.OPEN_READWRITE, (err) => {

    if (err && err.code == "SQLITE_CANTOPEN") {
        // Already exists, create new
        createDatabase();
        return;
    } 
    else if (err) {
        console.log("Database Error: " + err);
        exit(1);
    }

    // Ready
    
});

const createDatabase = () => {
    let dbNew = new sqlite3.Database('./db', (err) => {
        if (err) {
            console.log("Database Error: " + err);
            exit(1);
        }
        generate(dbNew);
    });
}

const generate = (dbNew) => {
    dbNew.exec(`
    PRAGMA foreign_keys;

    create table users (
        userID int primary key not null,
        username text not null,
        fname text not null,
        sname text not null,
        email text not null,
        password text not null,
        accountElevation int not null, 
        groupCreated int not null, 
        avatar text not null, 
        lastLoggedIn text not null, 
        online int not null, 
        createdAtDate text not null,
        private int not null
    );
    create table puzzles (
        puzzleID int primary key not null,
        puzzleData text not null,
        difficulty int not null,
        solution text not null,
        datePublished int not null,
        timePublished int not null
        
    );
    create table user_puzzle (
        FOREIGN KEY(userID) REFERENCES users(userID),
        FOREIGN KEY(puzzleID) REFERENCES puzzles(puzzleID),
        progress text,
        isSolved int not null, 
        hasSolved int not null,
        currentTime text not null,
        currentScore int not null,
        previousScores text,
        previousTimes text,
        userRating int,
        PRIMARY KEY(userID, puzzleID)
    );
    create table comments (
        commentID int primary key not null,
        FOREIGN KEY(userID) REFERENCES users(userID),
        FOREIGN KEY(puzzleID) REFERENCES puzzles(puzzleID),
        datePosted text not null,
        timePosted text not null,
        commentData text not null
    );
    create table puzzle_creation (
        FOREIGN KEY(userID) REFERENCES users(userID),
        FOREIGN KEY(puzzleID) REFERENCES puzzles(puzzleID),
        state text not null,
        solution text not null,
        isPossible int not null,
        PRIMARY KEY(userID, puzzleID)
    );
    




    `);
}

/*
https://docs.google.com/document/d/1Qi8s-wMO8wA3Lqsq-LqtA5_jU61neo_pxDxFQinGFpU/edit
*/
