const fs = require("fs/promises");
const { v1: uuidv1 } = require("uuid");
const pool = require("./queries.js");
// import { checkSolution } from './GameFunctions/sudoku.js';
const checkSolution = require("./GameFunctions/sudoku.js");
const { resolve } = require("dns");

// Current Date Time
const getCurrentDT = (callback) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    callback(
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
};

// Retrieve user by name
const getAllUsers = (callback) => {
    let query = "SELECT * FROM users";

    pool.query(query, (err, res) => {
        if (res.length == 0) {
            err = "No users found";
        }
        console.log(res);
        callback(res);
    });
};

// Retrieve user by name
const getUsers = (values, callback) => {
    let query = "SELECT * FROM users WHERE username = ?";

    pool.query(query, values, (err, res) => {
        if (err) {
            console.log(err);
        }
        if (res.length == 0) {
            //console.log('res is ' + res);
            err = "No users found";
        }

        //console.log(res);
        callback(err, res);
    });
};

// retrieve all users with username containing given string
const getUsersMatching = (values, callback) => {
    let query = "SELECT * FROM users WHERE username REGEXP ?";

    pool.query(query, values, (err, res) => {
        callback(err, res);
    });
};

// Retrieve user by name
const getUsersID = (values, callback) => {
    let query = "SELECT * FROM users WHERE userid = ?";

    pool.query(query, values, (err, res) => {
        callback(err, res);
    });
};

// Retrieve user with u/p
const loginUser = (values, callback) => {
    let query = "SELECT * FROM users WHERE username = ? AND password = ?";
    pool.query(query, values, (err, res) => {
        if (err) {
            console.log("Username or password invalid!");
            callback[(false, null)];
        } else if (res.length == 1) {
            res = eval(JSON.parse(JSON.stringify(res)));

            // Exists
            let userData = res[0];
            console.table(res);

            userLoginTime([values[0], ""]);
            callback[(true, userData)];
        } else {
            console.log("Username or password invalid!");
            callback[(false, null)];
        }
    });
};

// Update user log-in time
const userLoginTime = (uid) => {
    let query = "UPDATE users SET lastloggedin = (?) WHERE users.userid = (?)";
    let values = ["", uid];

    // Set DT
    getCurrentDT((date) => {
        // Set date
        values[0] = date;
    });

    pool.query(query, values, (err, res) => {
        // Not important
    });
};

// get users' bios
const getUserBio = (userid, callback) => {
    let query = "SELECT bio FROM users WHERE userid = (?)";

    pool.query(query, userid, (err, res) => {
        if (res.length == 0) {
            console.log("User cannot be found!");
            callback(null);
        } else {
            res = eval(JSON.parse(JSON.stringify(res[0])));
            callback(res);
        }
    });
};
// update the bio for users
const updateBio = (values) => {
    let userid = values[0];
    let bioText = values[1];
    let query = "UPDATE users SET bio = (?) WHERE userid = (?)";
    let newValues = [bioText, userid];
    pool.query(query, newValues, (err, callback) => {
        if (err) {
            console.error(err);
            callback(false);
        } else {
            callback(true);
        }
    });
};

// a getXP function reserved for use

const getXP = (values, callback) => {
    let query = "SELECT xp FROM users WHERE userid = (?)";

    pool.query(query, values, (err, res) => {
        if (res.length == 0) {
            console.log("User cannot be found!");
            callback[(false, null)];
        } else {
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

// update xp to user accounts when they solve a puzzle depends on its difficulty
const updateXP = (values, callback) => {
    let userid = values[0];
    let puzzleid = values[1];
    let query = "SELECT * FROM users WHERE userid = (?)";
    let difficultyQuery = "SELECT difficulty FROM puzzles WHERE puzzleid = (?)";
    // get the user's xp first
    pool.query(query, [userid], (err, res) => {
        if (err) {
            console.log("Error in retrieving XP from database: ", err);
            callback([false, null]);
        } else if (res.length == 0) {
            console.log("User cannot be found!");
            callback([false, null]);
        } else {
            let elevation = res[0].accountelevation;
            // get the difficulty of the puzzle
            pool.query(difficultyQuery, [puzzleid], (err, difficultyResult) => {
                if (err) {
                    console.log(
                        "Error in retrieving difficulty from database: ",
                        err
                    );
                    callback([false, null]);
                } else if (difficultyResult.length == 0) {
                    console.log("Puzzle cannot be found!");
                    callback([false, null]);
                } else {
                    console.log("start updating the xp");
                    // console.log(res[0]);
                    const totalXP = res[0].xp;
                    const difficulty = difficultyResult[0].difficulty;
                    let newXP;
                    // add 1 xp for easy puzzles, 2 for medium, 3 for hard
                    switch (difficulty) {
                        case 0:
                            newXP = totalXP + 1;
                            break;
                        case 1:
                            newXP = totalXP + 2;
                            break;
                        case 2:
                            newXP = totalXP + 3;
                            break;
                        default:
                            break;
                    }
                    // update user's xp
                    let update_query = `UPDATE users SET xp = (?) WHERE userid = (?) AND EXISTS (
                        SELECT 1 FROM user_puzzle
                        WHERE userid = (?) AND puzzleid = (?) AND hassolved = 1
                      )`;
                    pool.query(
                        update_query,
                        [newXP, userid, userid, puzzleid],
                        (err, result) => {
                            if (err) {
                                console.log(
                                    "Error in updating XP in database: ",
                                    err
                                );
                                console.error(err);
                                callback([false, null]);
                            } else {
                                let level = Math.ceil(getLevelFromXP(newXP));
                                console.log("updated the xp " + newXP);
                                console.log("the level is " + level);
                                console.log("the elevation is " + elevation);
                                // upgrade the user's account to author if they are above level 1
                                // and not have an elevation above 0(not a author already or a moderator)
                                if (level >= 1 && elevation < 1) {
                                    let elevate_query =
                                        "UPDATE users SET accountelevation = 1 WHERE userid = (?)";

                                    pool.query(
                                        elevate_query,
                                        [userid],
                                        (err) => {
                                            console.log("update the elevation");
                                            if (err) {
                                                console.error(err);
                                            } else {
                                                console.log(
                                                    "account elevation upgraded"
                                                );
                                            }
                                        }
                                    );
                                }

                                callback([true, level]);
                            }
                        }
                    );
                }
            });
        }
    });
};

// calculate xps for each level
const xpToReachLevel = (level) => {
    return 0.875 * level ** 2 + 2.125 * level;
};

// calculate levels from the xp
const getLevelFromXP = (totalXP) => {
    return (-17 + Math.sqrt(224 * totalXP + 289)) / 14;
};

// check if the puzzle has been solved before by the user
const solvedBefore = (values, callback) => {
    let userid = values[0];
    let puzzleid = values[1];
    let query =
        "SELECT * FROM user_puzzle WHERE userid = (?) AND puzzleid = (?) AND hassolved = 1";

    pool.query(query, [userid, puzzleid], (err, result) => {
        if (err) {
            console.error(err);
        } else {
            // if the length of the result is 0, then the user has not solved this puzzle before
            if (result.length == 0) {
                callback([false]);
            } else {
                console.log(result[0]);
                callback([true]);
            }
        }
    });
};

const checkUsernameEmail = (values, callback) => {
    let query = "SELECT * FROM users WHERE username = ? OR email = ?";

    pool.query(query, values, (err, res) => {
        callback(err, res);
    });
};

// Sign up
const addNewUser = (values, callback) => {
    // Set DT
    getCurrentDT((date) => {
        // Set date
        values[9] = date;
        values[11] = date;
    });

    // Add user to database (already checked in this version)
    let query =
        "INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    pool.query(query, values, (err, res) => {
        callback(err, res);
    });
};

// Delete Account
const deleteUser = (values) => {
    // Remove user by ID
    let query = "DELETE FROM USERS WHERE userid = (?)";

    pool.query(query, values, (err, res) => {
        if (err) {
            // Error
            console.log(err.stack);
        }
    });
};

// moderator can delete puzzles with this function
const deletePuzzle = (value, callback) => {
    let puzzleid = value[0];
    // remove puzzles by their ids

    console.log("database deletePuzzle initialized");

    // delete all the comments relates to this puzzle
    let deleteComm = "DELETE FROM comments WHERE puzzleid = (?)";
    pool.query(deleteComm, [puzzleid], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log(
                "deleted all the comments to this puzzle with the id " +
                puzzleid
            );
        }
    });
    // delete all the user progress on this puzzle
    let deleteProgress = "DELETE FROM user_puzzle WHERE puzzleid = (?)";
    pool.query(deleteProgress, [puzzleid], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log(
                "deleted all the user progress to this puzzle with the id " +
                puzzleid
            );
        }
    });
    // finally delete the puzzle
    let query = "DELETE FROM puzzles WHERE puzzleid = (?)";
    pool.query(query, [puzzleid], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log("deleted the puzzle with the id of " + puzzleid);
            console.log("deleted puzzle");
            callback(true);
        }
    });
};

// get user's elevation
const getElevation = (values, callback) => {
    let userid = values[0];
    let query = "SELECT accountelevation FROM users WHERE userid = (?)";
    pool.query(query, [userid], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            // console.log('get the user elevation from the backend ' + res[0].accountelevation);
            callback(res[0]);
        }
    });
};

// Get user's xp
const getXp = (values, callback) => {
    let userid = values[0];
    let query = "SELECT xp FROM users WHERE userid = (?)";
    pool.query(query, [userid], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            callback(res[0]);
        }
    });
};

// Save users' progress in puzzle creation
const puzzleCreation = (values) => {
    // UID, PNAME, SOLUTION, PUZZLE
    let query = "INSERT INTO puzzle_creation VALUES (?,?,?,?,?,?)";

    pool.query(query, values, (err, res) => {
        if (err) {
            console.log("creation error");
            // Check errors
            console.log(err.stack);
        } else {
            console.log("Puzzle creation saved");

            res = eval(JSON.parse(JSON.stringify(res)));
            console.table(res[0]);
        }
    });
};

// Get Puzzles - TAKES IN REQUIREMENTS E.G. top 10 or by date -> get certain number
/*
    MODES:
    orderByDifficulty - order results
    orderByCreated 
    orderByNameDesc
    orderByNameAsc
*/
const getPuzzlesFrom = (start, count, mode, puzzletype, callback) => {
    let query = "SELECT * FROM puzzles WHERE puzzletype=(?)";

    if (mode.includes("orderByDifficulty")) {
        if (mode.includes("Desc")) query = query + " ORDER BY difficulty DESC";
        else query = query + " ORDER BY difficulty ASC";
    } else if (mode.includes("orderByCreated")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY datepublished DESC";
        else query = query + " ORDER BY datepublished ASC";
    } else if (mode.includes("orderByName")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY LOWER(puzzlename) DESC";
        else query = query + " ORDER BY LOWER(puzzlename) ASC";
    } else if (mode.includes("sortDate")) {
        if (mode.includes("Desc")) {
            query = query + " ORDER BY datepublished DESC";
        } else {
            query = query + " ORDER BY datepublished ASC";
        }
    }

    console.log(query);
    pool.query(query, [puzzletype], (err, res) => {
        if (err) {
            // Error
            console.log(err.stack);
            callback(null);
        } else {
            if (res.length == 0) {
                console.log(res);
                callback(null);
            } else {
                res = JSON.parse(JSON.stringify(res));
                start = parseInt(start);
                count = parseInt(count);

                if (start < 0 || start >= res.length) {
                    callback(null);
                } else if (start + count >= res.length) {
                    callback([res.slice(start), res.length]);
                } else if (count == 0) {
                    callback([res, res.length]);
                } else {
                    callback([res.slice(start, start + 10), res.length]);
                }
            }
        }
    });
};

const getPuzzles = (mode, callback) => {
    getPuzzlesFrom(0, 0, mode, "puzzles", (callback2) => {
        callback(callback2[0]);
    });
};

// Get Puzzle by ID
const getPuzzleID = (id, callback) => {
    let query =
        "SELECT puzzles.*, users.username FROM puzzles INNER JOIN users ON puzzles.author = users.userid WHERE puzzles.puzzleid = (?)";

    pool.query(query, [id], (err, res) => {
        if (err) {
            // Error
            callback(null);
        } else {
            // Check a result exists
            if (res.length == 0) {
                callback(null);
            }
            // Success - return one result with the name
            res[0].progress = res[0].puzzledata;
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res[0]);
        }
    });
};

// Get Puzzle by Name
const getPuzzleName = (id, callback) => {
    let query = "SELECT * FROM puzzles WHERE puzzlename = (?)";

    pool.query(query, [id], (err, res) => {
        if (err) {
            // Error
            callback(null);
        } else {
            if (res.length == 0) {
                callback(null);
            }
            // Success - return all results with name
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

const formatFedPuzzleJson = (puzzles, callback) => {
    for (puzzle of puzzles) {
        puzzle.puzzledata = eval(puzzle.puzzledata);

        let newpuzzledata = [];
        for (row of puzzle.puzzledata) {
            let puzzlerow = [];

            for (elem of row) {
                puzzlerow.push(elem.toString());
            }
            newpuzzledata.push(puzzlerow);
        }
        puzzle.puzzledata = newpuzzledata;
        puzzle.puzzle = newpuzzledata;
        puzzle.group = 15;
        puzzle.sudoku_id = puzzle.puzzleid;
        puzzle.author_id = puzzle.author;
    }

    callback(puzzles);
};

// Get Puzzle by difficulty
const getPuzzleDifficulty = (difficulty, callback) => {
    let query = "SELECT * FROM puzzles WHERE difficulty = (?)";

    pool.query(query, [difficulty], (err, res) => {
        if (err) {
            // Error
            callback(null);
        } else {
            if (res.length == 0) {
                callback(null);
            }
            //Success - return all results with name
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

/**
 * Retrieves the puzzle solution data for a given puzzle id
 * @param {*} id        : the puzzle id
 * @param {*} callback
 */
const getPuzzleSolutionID = (id, callback) => {
    let query = "SELECT solution FROM puzzles WHERE puzzleid = (?)";

    pool.query(query, [id], (err, res) => {
        if (err) {
            // Error
            callback(null);
        } else {
            if (res.length == 0) {
                callback(null);
            }
            // Success
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

/**
 * Returns all puzzles by a user
 * @param {*} id        : the user id
 * @param {*} callback
 */
const puzzlesByUser = (id, callback) => {
    let query = "SELECT * FROM puzzles WHERE puzzles.author = (?)";

    pool.query(query, [id], (err, res) => {
        if (err) {
            // Error
            callback(null);
        } else {
            if (res.length == 0) {
                callback(null);
            }
            // Success
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

/**
 * Retrieves all puzzles that a user has created in a paginated and ordered manner
 * @param {*} id        : USER ID
 * @param {*} start     : start index of pagination
 * @param {*} count     : Number of puzzles to retrieve
 * @param {*} mode      : Order
 * @param {*} callback
 */
const puzzlesByUserFrom = (id, start, count, mode, callback) => {
    console.log("magic");
    let query = "SELECT * FROM puzzles WHERE puzzles.author = (?)";
    if (mode.includes("orderByDifficulty")) {
        if (mode.includes("Desc")) query = query + " ORDER BY difficulty DESC";
        else query = query + " ORDER BY difficulty ASC";
    } else if (mode.includes("orderByCreated")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY datepublished DESC";
        else query = query + " ORDER BY datepublished ASC";
    } else if (mode.includes("orderByName")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY LOWER(puzzlename) DESC";
        else query = query + " ORDER BY LOWER(puzzlename) ASC";
    } else if (mode.includes("sortDate")) {
        if (mode.includes("Desc")) {
            query = query + " ORDER BY datepublished DESC";
        } else {
            query = query + " ORDER BY datepublished ASC";
        }
    }

    pool.query(query, [id], (err, res) => {
        if (err) {
            // Error
            callback(null);
        } else {
            if (res.length == 0) {
                console.log(res);
                callback(null);
            } else {
                res = eval(JSON.parse(JSON.stringify(res)));

                start = parseInt(start);
                count = parseInt(count);

                if (start < 0 || start >= res.length) {
                    callback(null);
                } else if (start + count >= res.length) {
                    callback([res.slice(start), res.length]);
                } else if (count == 0) {
                    callback([res, res.length]);
                } else {
                    callback([res.slice(start, start + count), res.length]);
                }
            }
        }
    });
};

/**
 * Retrieves all puzzles that a user has created in a paginated and ordered manner 
 * USES USERNAME INSTEAD OF ID!!!!
 * @param {*} id        : USER ID 
 * @param {*} start     : start index of pagination
 * @param {*} count     : Number of puzzles to retrieve
 * @param {*} mode      : Order 
 * @param {*} callback 
 */
const puzzlesByUserFromName = (id, start, count, mode, callback) => {
    // Get userid
    getUsers(id, function (err, res) {
        if (!err) {
            res = eval(JSON.parse(JSON.stringify(res)))[0].userid;
            console.log("id", res);
            puzzlesByUserFrom(res, start, count, mode, function (callback2) {
                console.log("yay");
                callback(callback2);
            });
        }
    });
};

/**
 * Updates database to reflect a user solving and submitting a puzzle 
 * @param {*} inValues  : [userid, puzzleid, issolved, hassolved, puzzledata, date, previousscores, previoustimes, userrating]
 * @param {*} callback
 */
const submitSolution = (inValues, callback) => {
    let userid = inValues[0];
    let puzzleid = inValues[1];
    // check if user has saved the puzzle before
    let checkQuery =
        "SELECT * FROM user_puzzle WHERE userid = (?) AND puzzleid = (?)";
    pool.query(checkQuery, [userid, puzzleid], (err, res) => {
        if (err) {
            console.error(err);
        } // check if there is a row in the user puzzle to update the value, otherwise insert a row
        // in case of the edge case that user did not save the puzzle and submit it right away
        else if (res.length == 0) {
            let insertQuery = `INSERT INTO user_puzzle (userid, puzzleid, issolved, hassolved, puzzledata, date, previousscores, previoustimes, userrating)
            VALUES (?, ?, 1, 1, (SELECT puzzledata FROM puzzles WHERE puzzleid = ?), NOW(), NULL, NULL, NULL)
            `;
            pool.query(
                insertQuery,
                [userid, puzzleid, puzzleid],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        callback([false]);
                    } else {
                        callback([true]);
                    }
                }
            );
        } else {
            // if the user has saved the puzzle, then update the values
            let query =
                "UPDATE user_puzzle SET issolved = 1, hassolved = 1, puzzledata = (SELECT puzzledata FROM puzzles WHERE puzzleid = (?)) WHERE userid = (?) AND puzzleid = (?)";

            pool.query(query, [puzzleid, userid, puzzleid], (err, res) => {
                if (err) {
                    console.error(err);
                    // Error
                    callback([false]);
                } else {
                    console.log("successfully submitted the solution");
                    callback([true]);
                }
            });
        }
    });
};

/**
 * Adds a new puzzle to the database (for handling puzzle creation)
 * @param {*} values    : [all puzzle attributes ]
 * @param {*} callback  : callback for returning result
 */
const addPuzzle = (values, callback) => {
    // PID, PNAME, PDATA, "", SOLUTION, "", UID
    let query =
        "INSERT INTO puzzles VALUES (?,?,?,?,?,?,?,?,?,?,?) RETURNING *";

    // Set DT
    getCurrentDT((date) => {
        // Set date
        values[5] = date;
    });

    // Array to string for storing
    values[2] = JSON.stringify(values[2]);
    values[4] = JSON.stringify(values[4]);

    // set rating to default 0
    values[9] = 0.0;
    // Make query
    pool.query(query, values, (err, res) => {
        if (err) {
            if (err.message.includes("duplicate key value")) {
                // Puzzle ID already exists
                console.log("Puzzle already exists, trying new ID");

                values[0] = uuidv1(); // Try new UUID
                addPuzzle(values);
            } else {
                // Unknown Error
                console.log(err.stack);
            }
        } else {
            console.log("Added Puzzle");
            res = eval(JSON.parse(JSON.stringify(res)));
            console.table(res);
            callback(true);
        }
    });
};

// Save puzzle from editor
const addEditorPuzzle = (values) => {
    let query = "INSERT INTO puzzle_creation VALUES (?,?,?,?,?,?)";

    pool.query(query, values, (err, res) => {
        if (err) {
            if (err.message.includes("duplicate key value")) {
                // User ID already exists
                console.log("Puzzle already exists, trying new ID");

                values[0] = values[0] + 1; // Increment ID until it doesn't match ~> comes from random int so next number is very unlikely to also be taken
                addPuzzle(values);
            } else {
                // Unknown Error
                console.log(err.stack);
            }
        } else {
            console.log("Added Puzzle");
        }
    });
};

/**
 * Calculates the average rating for a puzzle
 * @param {*} puzzleid : the id of the puzzle
 * @param {*} callback
 */
const calculateRatings = (puzzleid, callback) => {
    /*  
        calculate the puzzle rating by getting the average of all the user ratings on this puzzle
        from the user_puzzle table through the puzzle id, round them up to the one decimal place,
        and update that in the puzzle table
     */
    let query = `UPDATE puzzles 
                SET puzzleRating = 
                ROUND((SELECT AVG(userrating) FROM user_puzzle WHERE puzzleid = (?) AND userrating IS NOT NULL), 1)
                WHERE puzzleid = (?)`;
    pool.query(query, [puzzleid, puzzleid], (err, res) => {
        if (err) {
            console.error("Error message " + err.stack);
            callback([false, null]);
        } else {
            let query = `SELECT puzzleRating FROM puzzles WHERE puzzleid = (?)`;
            pool.query(query, [puzzleid], (err, result) => {
                if (err) {
                    callback([false, null]);
                    console.log(err.stack);
                } else if (result.length === 0) {
                    callback([false, null]);
                    console.log("puzzle not found");
                } else {
                    result = eval(
                        JSON.parse(JSON.stringify(result[0].puzzleRating))
                    );
                    callback([true, result]);
                }
            });
        }
    });
};

/**
 * Updates the ratings for a puzzle
 * @param {*} values    : [rating, userid, puzzleid, puzzledata]
 * @param {*} callback
 */
const updateRatings = (values, callback) => {
    let userid = values[1];
    let puzzleid = values[2];
    let rating = values[0];
    let puzzledata = values[3];
    // check if there is a row in user_puzzle for this user with this puzzle
    // if not, insert the row to allow the user to rate the puzzle
    let checkQuery = `SELECT *
    FROM user_puzzle
    WHERE userid = (?) AND puzzleid = (?);`;
    pool.query(checkQuery, [userid, puzzleid], (err, res) => {
        if (err) {
            console.error("Error:", err.message);
            console.error("Stack trace:", err.stack);
            console.log("check value has gone wrong");
            throw err;
        } else {
            // if there exist a row, then update the rating in the row
            if (res.length == 1) {
                let newVal = [rating, userid, puzzleid];
                let query =
                    "UPDATE user_puzzle SET userrating = (?) WHERE userid = (?) AND puzzleid = (?)";
                pool.query(query, newVal, (err, res) => {
                    console.log("update rating query starts");
                    if (err) {
                        console.error("Error:", err.message);
                        console.error("Stack trace:", err.stack);
                        console.log("rating is not updated");
                        throw err;
                    } else {
                        console.log("rating updated " + rating);
                        const success = true;
                        callback(success);
                    }
                });
            } else {
                // get the values to insert a row
                let initValue = [
                    userid,
                    puzzleid,
                    puzzledata,
                    0,
                    0,
                    "",
                    "",
                    "",
                    rating,
                ];
                let query = `INSERT INTO user_puzzle (userid, puzzleid, puzzledata, issolved, hassolved, date, previousscores, previoustimes, userrating)
                            VALUES(?,?,?,?,?,?,?,?,?)`;
                pool.query(query, initValue, (err, res) => {
                    console.log(
                        "user_puzzle initialization for the rating starts"
                    );
                    if (err) {
                        console.error("Error:", err.message);
                        console.error("Stack trace:", err.stack);
                        console.log("rating is not inserted");
                        throw err;
                    } else {
                        console.log("rating inserted " + rating);
                        const success = true;
                        callback(success);
                    }
                });
            }
        }
    });
};

/**
 * Adds comment for a particular puzzle
 * @param {*} values    : [comment attributes ]
 * @param {*} callback  : callback for returning results
 */
const addComment = (values, callback) => {
    let query = "INSERT INTO comments VALUES (?,?,?,?,?) RETURNING *";

    // Set DT
    getCurrentDT((date) => {
        // Set date
        values[3] = date;
    });

    pool.query(query, values, (err, res) => {
        if (err) {
            if (err.message.includes("duplicate key value")) {
                // Comment ID already exists
                console.log("Comment already exists, trying new ID");

                values[0] = uuidv1(); // Try new UUID
                addComment(values);
            } else {
                console.log(err.stack);
            }
        } else {
            console.log("Added Comments");
            callback(true);
        }
    });
};

/**
 * Updates a user's profile image
 * @param {*} values    : [avatar ID, user ID ]
 * @param {*} callback  : Returns true or false to indicate success of update
 */
const addPfp = (values, callback) => {
    let query = "UPDATE users SET avatar = (?) WHERE userid = (?)";

    pool.query(query, values, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            callback(true);
        }
    });
};

/**
 * Deletes a comment from the database for a particular puzzle
 * @param {*} values    : [comment ID]
 * @param {*} callback  : Call back for returning result
 */
const removeComment = (values, callback) => {
    let query = "DELETE FROM comments WHERE commentid = (?)";

    pool.query(query, values[1], (err, res) => {
        if (err) {
        } else {
            console.log("Removed Comment");
            callback(true);
        }
    });
};

/**
 * Returns all comments for a particular puzzle id
 * @param {*} pid       : ID of the puzzle
 * @param {*} callback  : call back for returning the result
 * @returns             : array of comment objects
 */
const getComments = (pid, callback) => {
    let query =
        "SELECT comments.*, users.username, users.avatar FROM comments, users WHERE comments.puzzleid = (?) AND comments.userid = users.userid ORDER BY comments.dateposted DESC";

    pool.query(query, pid, (err, res) => {
        if (err) {
            callback(null);
        } else {
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

/**
 * Records a user progress for a puzzle into the database
 * @param {*} values   : [userid, puzzleid, puzzledata, issolved, hassolved, date, previousscores, previoustimes, userrating]
 * @param {*} callback : callback for returning result
 */
const addUserPuzzleProgress = (values, callback) => {
    let query = `INSERT INTO user_puzzle (userid, puzzleid, puzzledata, issolved, hassolved, date, previousscores, previoustimes, userrating)
    VALUES (?,?,?,?,?,?,?,?, NULL)`;
    console.log(values);

    pool.query(query, values, (err, res) => {
        if (err) {
            let newValues = [values[2], values[1], values[0]];
            console.log(newValues);
            let updateQuery =
                "UPDATE user_puzzle SET puzzledata = (?) WHERE puzzleid = (?) AND userid = (?)";
            pool.query(updateQuery, newValues, (err2, res2) => {
                if (err2) {
                    console.error(err2);
                    callback(false);
                } else {
                    console.log("Users' progress saved");
                    callback(true);
                }
            });
        } else {
            console.log("Users' progress saved");
            callback(true);
        }
    });
};

/**
 * Checks if a user has progress for a particaulr puzzle and returns the progress state if there is any progress and the default state otherwise
 * @param {*} values        : [userid, puzzleid]
 * @param {*} callback      : call back to return the result
 */
const resumeOrNew = (values, callback) => {
    console.log("RESUMEORNEW");

    let puzzleQuery =
        "SELECT puzzles.*, users.username FROM puzzles INNER JOIN users ON puzzles.author = users.userid WHERE puzzles.puzzleid = (?)";
    let userPuzzleQuery =
        "SELECT * FROM user_puzzle WHERE userid = (?) AND puzzleid = (?)";

    // Query puzzle
    pool.query(puzzleQuery, [values[1]], (err, res) => {
        if (res.length == 0) {
            // No puzzle
            callback([false, null]);
        } else {
            res = eval(JSON.parse(JSON.stringify(res)));

            res[0].progress = res[0].puzzledata;
            let progress = res[0].progress;

            // Look for progress
            pool.query(userPuzzleQuery, values, (err, res2) => {
                if (res.length == 0) {
                    // No progress

                    callback([false, res[0]]);
                } else {
                    res2 = eval(JSON.parse(JSON.stringify(res2)));

                    // Progress found
                    // Insert P name and color
                    if (res2[0]) {
                        res2[0].puzzlename = res[0].puzzlename;
                        res2[0].titleCSS = res[0].titleCSS;
                        res2[0].puzzletype = res[0].puzzletype;
                        res2[0].puzzleImage = res[0].puzzleImage;
                        res2[0].username = res[0].username;
                        res2[0].solution = res[0].solution;
                        res2[0].group = res[0].group;
                        res2[0].difficulty = res[0].difficulty;
                        res2[0].progress = res2[0].puzzledata;
                        res2[0].puzzledata = res[0].puzzledata;
                        res2[0].datepublished = res[0].datepublished;

                        callback([true, res2[0]]);
                    } else {
                        callback([false, res[0]]);
                    }
                }
            });
        }
    });
};

// fixed puzzleid, "queens", puzzletype "queens", blank string solution, author PuzzleFlix, ""
// ("queens","Eight Queens","",0,"","","","queens","",0)
// ("520de350-6077-11ed-8bf2-1991712f055g","Eights","[[0,1,2][3,4,5][6,7,8]]",0,"","","2ae08440-5d2a-11ed-b2e7-c3c7c28faaee","eights","Blue",0)
const resumeOrNewQueens = (uid, callback) => {
    resumeOrNew([uid, "queens"], function (res) {
        console.log("RESUMEORNEW ONE");
        console.log(res);
        callback(res);
    });
};

// Resume section
const getResumables = (uid, callback) => {
    let query =
        "SELECT puzzles.* FROM puzzles, user_puzzle WHERE user_puzzle.userid = (?) AND puzzles.puzzleid = user_puzzle.puzzleid";

    pool.query(query, [uid], (err, res) => {
        if (err) {
            callback(null);
        } else {
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

/**
 * Returns all puzzles the user has progress in, paginated and orderd
 * @param {*} uid       : the user's id
 * @param {*} start     : The start index of the pagination
 * @param {*} count     : The number of puzzles to retrieve
 * @param {*} mode      : The sorting order
 * @param {*} callback  : Call back for returning result
 */
const getResumablesFrom = (uid, start, count, mode, callback) => {
    let query =
        "SELECT puzzles.* FROM puzzles, user_puzzle WHERE user_puzzle.userid = (?) AND puzzles.puzzleid = user_puzzle.puzzleid AND hassolved=0";

    // establish order of pagiantion
    if (mode.includes("orderByDifficulty")) {
        if (mode.includes("Desc")) query = query + " ORDER BY difficulty DESC";
        else query = query + " ORDER BY difficulty ASC";
    } else if (mode.includes("orderByCreated")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY datepublished DESC";
        else query = query + " ORDER BY datepublished ASC";
    } else if (mode.includes("orderByName")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY LOWER(puzzlename) DESC";
        else query = query + " ORDER BY LOWER(puzzlename) ASC";
    } else if (mode.includes("sortDate")) {
        if (mode.includes("Desc")) {
            query = query + " ORDER BY datepublished DESC";
        } else {
            query = query + " ORDER BY datepublished ASC";
        }
    }

    pool.query(query, [uid], (err, res) => {
        if (err) {
            callback(null);
        } else {
            if (res.length == 0) {
                console.log(res);
                callback(null);
            } else {
                res = eval(JSON.parse(JSON.stringify(res)));
                start = parseInt(start);
                count = parseInt(count);

                if (start < 0 || start >= res.length) {
                    callback(null);
                } else if (start + count >= res.length) {
                    callback([res.slice(start), res.length]);
                } else if (count == 0) {
                    callback([res, res.length]);
                } else {
                    callback([res.slice(start, start + count), res.length]);
                }
            }
        }
    });
};

/**
 * Returns all puzzle objects that the user has solved
 * @param {*} uid       : id of the user
 * @param {*} callback  : call back to return the result
 */
const getSolved = (uid, callback) => {
    let query =
        "SELECT puzzles.* FROM puzzles, user_puzzle WHERE user_puzzle.userid = (?) AND puzzles.puzzleid = user_puzzle.puzzleid AND user_puzzle.hassolved = 1";

    pool.query(query, [uid], (err, res) => {
        if (err) {
            callback(null);
        } else {
            res = eval(JSON.parse(JSON.stringify(res)));
            callback(res);
        }
    });
};

/**
 * Returns all puzzles the user has solved in a paginated and ordered manner
 * @param {*} uid       : ID of the user
 * @param {*} start     : the start index of the pagination
 * @param {*} count     : The number of puzzles to retrieve
 * @param {*} mode      : The order of the pagination
 * @param {*} callback  : Call back to return the result
 * @return              : an array of form [[puzzle objects], total count]
 */
const getSolvedFrom = (uid, start, count, mode, callback) => {
    let query =
        "SELECT puzzles.* FROM puzzles, user_puzzle WHERE user_puzzle.userid = (?) AND puzzles.puzzleid = user_puzzle.puzzleid AND user_puzzle.hassolved = 1";

    if (mode.includes("orderByDifficulty")) {
        if (mode.includes("Desc")) query = query + " ORDER BY difficulty DESC";
        else query = query + " ORDER BY difficulty ASC";
    } else if (mode.includes("orderByCreated")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY datepublished DESC";
        else query = query + " ORDER BY datepublished ASC";
    } else if (mode.includes("orderByName")) {
        if (mode.includes("Desc"))
            query = query + " ORDER BY LOWER(puzzlename) DESC";
        else query = query + " ORDER BY LOWER(puzzlename) ASC";
    } else if (mode.includes("sortDate")) {
        if (mode.includes("Desc")) {
            query = query + " ORDER BY datepublished DESC";
        } else {
            query = query + " ORDER BY datepublished ASC";
        }
    }

    pool.query(query, [uid], (err, res) => {
        if (err) {
            callback(null);
        } else {
            if (res.length == 0) {
                console.log(res);
                callback(null);
            } else {
                res = eval(JSON.parse(JSON.stringify(res)));
                start = parseInt(start);
                count = parseInt(count);

                if (start < 0 || start >= res.length) {
                    callback(null);
                } else if (start + count >= res.length) {
                    callback([res.slice(start), res.length]);
                } else if (count == 0) {
                    callback([res, res.length]);
                } else {
                    callback([res.slice(start, start + count), res.length]);
                }
            }
        }
    });
};

/**
 * Runs a given query against the database (for testing)
 * @param {*} query : SQL query string
 */
const runQuery = async (query) => {
    try {
        let res = await pool.query(query);
    } catch (err) {
        console.log("Database Connection Error");
        console.log(err.stack);
    }
};

// Initialise the database (adds missing fields etc...)
const initDB = async () => {
    // Read database scheme
    console.log(process.cwd());
    let all;
    // TEST = true;
    TEST = false;

    if (TEST) {
        all = await fs.readFile("../databaseInit.txt", { encoding: "utf8" });
    } else {
        all = await fs.readFile("./src/databaseInit.txt", { encoding: "utf8" });
    }

    try {
        let cleanedAll = all.replace(/\r/g, "");
        let queries = cleanedAll.split("NEW_QUERY\n"); // ONLY \N FOR LINUX, \R\N FOR WINDOWS

        // Run queries
        queries.forEach((element) => runQuery(element));
    } catch (err) {
        console.log(err);
    }

    // On complete
    //console.log("Database init completed.")
};

// Formatting JSON objects (i.e. puzzle string to array)
const formatPuzzleJSON = (puzzles, callback) => {
    if (puzzles[0] != undefined) {
        for (puzzle of puzzles) {
            puzzle.puzzledata = eval(puzzle.puzzledata);
        }
        callback(puzzles);
    } else {
        callback(undefined);
    }
};

// Initialise DB on server startup
initDB();

// Export
module.exports = {
    addNewUser,
    deleteUser,
    getPuzzleID,
    getPuzzleName,
    getPuzzles,
    getPuzzlesFrom,
    puzzlesByUser,
    puzzlesByUserFrom,
    getPuzzleSolutionID,
    checkUsernameEmail,
    getCurrentDT,
    formatPuzzleJSON,
    resumeOrNew,
    getResumables,
    getResumablesFrom,
    addUserPuzzleProgress,
    getUsers,
    userLoginTime,
    getUsersID,
    addPuzzle,
    getPuzzleDifficulty,
    formatFedPuzzleJson,
    submitSolution,
    getSolved,
    getSolvedFrom,
    getUserBio,
    updateBio,
    updateXP,
    solvedBefore,
    addComment,
    getComments,
    calculateRatings,
    updateRatings,
    removeComment,
    deletePuzzle,
    getElevation,
    resumeOrNewQueens,
    addPfp,
    getUsersMatching,
    getXp,
    puzzlesByUserFromName,
};

//

// Testing Functions

//getPuzzlesFrom(1,"",function (callback) {
//    // Do nothing
//});
//*/

/*

    DEFAULT PUZZLE! DO NOT REMOVE!

*/

// INSERT INTO puzzles ([uuidv1(), "test puzzle 1 for deletion", '[[0,0,0,0,0,5,9,0,8],[0,8,7,1,0,0,0,4,0],[6,0,4,7,0,8,0,0,0],[7,0,0,0,0,0,0,0,0],[0,0,0,5,0,0,1,0,0],[0,0,0,0,4,0,0,0,0],[2,0,0,0,5,0,0,0,0],[0,0,0,0,0,0,2,0,1],[0,0,6,0,2,0,0,3,0]]', 1, '[[1,2,3,4,6,5,9,7,8],[5,8,7,1,9,2,3,4,6],[6,9,4,7,3,8,5,1,2],[7,3,2,6,1,9,4,8,5],[4,6,9,5,8,3,1,2,7],[8,1,5,2,4,7,6,9,3],[2,7,1,3,5,4,8,6,9],[3,4,8,9,7,6,2,5,1],[9,5,6,8,2,1,7,3,4]]', "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee', sudoku, 0, 0.0]);
//SOLUTION = '[[1,2,3,4,6,5,9,7,8],[5,8,7,1,9,2,3,4,6],[6,9,4,7,3,8,5,1,2],[7,3,2,6,1,9,4,8,5],[4,6,9,5,8,3,1,2,7],[8,1,5,2,4,7,6,9,3],[2,7,1,3,5,4,8,6,9],[3,4,8,9,7,6,2,5,1],[9,5,6,8,2,1,7,3,4]]';
//PUZZLE = '[[0,0,0,0,0,5,9,0,8],[0,8,7,1,0,0,0,4,0],[6,0,4,7,0,8,0,0,0],[7,0,0,0,0,0,0,0,0],[0,0,0,5,0,0,1,0,0],[0,0,0,0,4,0,0,0,0],[2,0,0,0,5,0,0,0,0],[0,0,0,0,0,0,2,0,1],[0,0,6,0,2,0,0,3,0]]';
// addPuzzle([uuidv1(), "an easy puzzle", PUZZLE, 1, SOLUTION, "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee']);
// addPuzzle([uuidv1(), "also an easy puzzle", PUZZLE, 1, SOLUTION, "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee']);
// addPuzzle([uuidv1(), "bit hard", PUZZLE, 1, SOLUTION, "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee']);
// addPuzzle([uuidv1(), "bit hard 2", PUZZLE, 1, SOLUTION, "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee']);
// addPuzzle([uuidv1(), "bit hard 2", PUZZLE, 1, SOLUTION, "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee']);
// addPuzzle(['57013690-5d44-11ed-a40c-554e8b9112ab', "bit hard 2", PUZZLE, 1, SOLUTION, "date",'2ae08440-5d2a-11ed-b2e7-c3c7c28faaee']);

//  getPuzzles( function (callback) {
//       console.table(callback);
//   });
//  getAllUsers( function (callback) {
//      console.table(callback);
//  });
/*
puzzlesByUser('2ae08440-5d2a-11ed-b2e7-c3c7c28faaee', function (callback) {
    console.table(callback);
}); */

// resumeOrNew(['37d0aea0-c34b-11ed-b2f5-63486313baf5','queens'], function (callback) {
//      console.log(callback)
//  });

/*
getResumables('2ae08440-5d2a-11ed-b2e7-c3c7c28faaee', function (callback) {
    console.log(callback);
});
*/
/*
resumeOrNewOld(['2ae08440-5d2a-11ed-b2e7-c3c7c28faaee','57013690-5d44-11ed-a40c-554e8b9112ab'] ,function (callback) {
    console.log(callback[1]);
});
*/
// resumeOrNew(['2ae08440-5d2a-11ed-b2e7-c3c7c28faaee','57013690-5d44-11ed-a40c-554e8b9112ab'] ,function (callback) {
//     console.log(callback[1]);
// });

/*
addUserPuzzleProgress(['2ae08440-5d2a-11ed-b2e7-c3c7c28faaee', '57013690-5d44-11ed-a40c-554e8b9112ab', '[[1,2,3,4,6,5,9,7,8],[5,8,7,1,9,2,3,4,6],[6,9,4,7,3,8,5,1,2],[7,3,2,6,1,9,4,8,5],[4,6,9,5,8,3,1,2,7],[8,1,5,2,4,7,6,9,3],[2,7,1,3,5,4,8,6,9],[3,4,8,9,7,6,2,5,1],[9,5,6,8,2,1,7,3,4]]', 0, 0, "date", 0, 0, 0, 0], function (callback) {

});
*/
