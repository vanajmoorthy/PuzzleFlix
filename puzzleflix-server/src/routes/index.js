var express = require("express");
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v1: uuidv1 } = require("uuid");
const bcrypt = require("bcrypt");

const multer = require("multer");
const path = require("path");

const sharp = require("sharp");
const fs = require("fs");
const atob = require("atob");

//custom functions
const db = require("./../database");
const pool = require("../queries.js");
const jwtTokens = require("./../middleware/token");
const authorization = require("./../middleware/authorization");
const sudokusolver = require("./../GameFunctions/sudokusolver");

const { origins, axiosConfig } = require("./config");

require("dotenv").config();

const environment = process.env.APP_ENVIRONMENT;

//------------------------Middleware-------------------------
// Middleware

// console.log(origins);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

if (environment == "LOCAL") {
    const corsOptions = {
        origin: function (origin, callback) {
            if (['http://127.0.2.2:24600', 'http://localhost:3000'].includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };
    router.use(cors(corsOptions));

    // router.use(
    //     cors({
    //         origin: origins, // <-- location of the react app were connecting to
    //         credentials: true,
    //     })
    // );
} else if (environment == "PRODUCTION") {
    router.use(cors());
} else {
    console.log("Incorrect environemnt: Options are LOCAL and PRODUCTION");
}

//-----------------------------------------------------------

//decodes token
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

router.get("/test", async (req, res) => {
    res.send({ "everyhing": "working fine" });
});

router.get('/api/test', (req, res) => {
    res.json({ message: "API test route working" });
});


router.post("/signup", async (req, res) => {
    console.log(req.body);
    console.log("hellooo");
    try {
        db.checkUsernameEmail(
            [req.body.username, req.body.email],
            async (err, result) => {
                if (err) {
                    res.status(500).send("Error Check Details!");
                }
                if (result[0] != null) {
                    res.status(500).send("Username or email already taken!");
                } else {
                    const hashedPassword = await bcrypt.hash(
                        req.body.password,
                        16
                    );
                    let id = uuidv1();
                    let values = [
                        id, // UserID
                        req.body.username,
                        req.body.firstname,
                        req.body.surname,
                        req.body.email,
                        hashedPassword,
                        0, // Elevation (default 0)
                        15, // Group
                        "/uploads/1679312777040-defaultPfp.png.jpg", // PFP
                        "", // Will be overwritten in function (date)
                        1, // Online
                        "", // Will be overwritten in function (date)
                        "", // Bio
                        0, //xp
                        1, // Private
                    ];
                    db.addNewUser(values, async (error, result) => {
                        console.log("Here");
                        if (error) {
                            console.log(error);
                            res.status(500).send("Error Check Details!");
                        } else {
                            console.log("User " + req.body.username + " has been registered.");
                            let tokens = jwtTokens.jwtTokens(id, req.body.username, req.body.email);

                            // Check if result is not empty and has at least one object
                            if (result && result.length > 0) {
                                delete result[0].password; // Ensure there's no accidental password exposure
                                tokens.user = result[0];
                            } else {
                                // Handle the case where no user data is returned
                                tokens.user = { id: id, username: req.body.username, email: req.body.email };
                            }

                            res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
                            res.json(tokens); // Send back access token and refresh token
                        }
                    });

                } //end else
            }
        );
    } catch (err) {
        res.send("FAILURE");
    }
}); //end post

router.post("/login", async (req, res) => {
    console.log("whatever");
    try {
        const { username, password } = req.body;

        db.getUsers([username], async (err, result) => {
            result = eval(JSON.parse(JSON.stringify(result)));

            if (err) {
                res.status(500).send(
                    "Incorrect Credentials! Please check fields!"
                );
            } else {
                if (result.rowCount == 0) {
                    res.status(500).send("Username is not registered!");
                } else {
                    const validPassword = await bcrypt.compare(
                        password,
                        result[0].password
                    );
                    if (!validPassword)
                        res.status(500).send("Incorrect Password!");
                    else {
                        let tokens = jwtTokens.jwtTokens(
                            result[0].userid,
                            result[0].username,
                            result[0].email
                        );
                        res.cookie("refresh_token", tokens.refreshToken, {
                            httpOnly: true,
                        });
                        delete result.password;
                        tokens.user = result[0];

                        // Log in
                        db.userLoginTime(username);
                        res.json(tokens); //send back access token and refresh token
                    }
                }
            }
        });
    } catch (err) {
        res.status(500).send(new Error("Failure"));
    }
});

// update the bio for the user
router.post("/updateBio", authorization.authenticateToken, (req, res) => {
    try {
        db.updateBio([userid, bioText], async (err, res) => {
            if (callback == false) {
                res.status(500).send("bio is not updated");
            } else {
                res.status(200).json("Success");
            }
        });
    } catch (err) {
        res.status(500).send(new Error("Failure"));
    }
});
// For retrieving user data from database
router.post("/userdata", authorization.authenticateToken, (req, res) => {
    try {
        let username = req.body.username;

        db.getUsers([username], async (err, result) => {
            result = eval(JSON.parse(JSON.stringify(result)));

            if (err) {
                res.status(500).send(
                    "Incorrect Credentials! Please check fields!"
                );
            } else {
                res.json(result[0]);
            }
        });
    } catch (err) {
        res.status(500).send(new Error("Failure"));
    }
});

// For retrieving user data for search bar
router.post("/searchUsers", (req, res) => {
    try {
        const { username } = req.body;

        db.getUsersMatching([username], async (err, result) => {
            result = eval(JSON.parse(JSON.stringify(result)));

            // console.log(result);
            if (err) {
                result = [];
            }
            res.json(result);
        });
    } catch (err) {
        res.status(200).send([]);
    }
});

// Get paginated and sorted puzzles for content belt
router.post("/paginatedpuzzle", (req, res) => {

    // For retreiving from all puzzles
    if (req.body.type == "puzzles" || req.body.type == "eights") {
        db.getPuzzlesFrom(
            req.body.index,
            req.body.count,
            req.body.mode,
            req.body.puzzletype,
            (callback) => {
                if (callback == null) {
                    console.log("paginatedpuzzles CALLBACK NULL 1");
                    res.status(500).send(new Error("FAILURE"));
                } else {
                    db.formatPuzzleJSON(callback[0], (result) => {
                        // console.log(result);
                        res.status(200).json([result, callback[1]]);
                    });
                }
            }
        );
    }
    // For retrieving from puzzles user has progress in
    else if (req.body.type == "progresspuzzles") {
        let userid = parseJwt(req.body.accessToken).userid;
        db.getResumablesFrom(
            userid,
            req.body.index,
            req.body.count,
            req.body.mode,
            (callback) => {
                if (callback == null) {
                    console.log("paginatedpuzzles CALLBACK NULL 2");
                    res.status(500).send(new Error("FAILURE"));
                } else {
                    db.formatPuzzleJSON(callback[0], (result) => {
                        // console.log(result);
                        res.status(200).json([result, callback[1]]);
                    });
                }
            }
        );
    }
    // For retrieving from puzzles user has already solved
    else if (req.body.type == "solveagain") {
        let userid = parseJwt(req.body.accessToken).userid;
        db.getSolvedFrom(
            userid,
            req.body.index,
            req.body.count,
            req.body.mode,
            (callback) => {
                if (callback == null) {
                    console.log("paginatedpuzzles CALLBACK NULL 3");
                    res.status(500).send(new Error("FAILURE"));
                } else {
                    db.formatPuzzleJSON(callback[0], (result) => {
                        // console.log(result);
                        res.status(200).json([result, callback[1]]);
                    });
                }
            }
        );
    }
    // For retreiving from puzzles the user has created
    else if (req.body.type == "yourpuzzles") {
        let userid = parseJwt(req.body.accessToken).userid;
        db.puzzlesByUserFrom(
            userid,
            req.body.index,
            req.body.count,
            req.body.mode,
            (callback) => {
                if (callback == null) {
                    console.log("paginatedpuzzles CALLBACK NULL 4");
                    res.status(500).send(new Error("FAILURE"));
                } else {
                    db.formatPuzzleJSON(callback[0], (result) => {
                        // console.log(result);
                        res.status(200).json([result, callback[1]]);
                    });
                }
            }
        );
    }
    // For retreiving from puzzles the user has created
    else if (req.body.type == "userspuzzles") {

        db.puzzlesByUserFromName(
            req.body.user,
            req.body.index,
            req.body.count,
            req.body.mode,
            (callback) => {
                if (callback == null) {
                    console.log("paginatedpuzzles CALLBACK NULL 4");
                    res.status(500).send(new Error("FAILURE"));
                } else {
                    db.formatPuzzleJSON(callback[0], (result) => {
                        // console.log(result);
                        res.status(200).json([result, callback[1]]);
                    });
                }
            }
        );
        console.log("done");
    }
});



//get the users current progress on a given puzzle
router.post("/puzzleprogress", authorization.authenticateToken, (req, res) => {
    let userid = parseJwt(req.body.accessToken).userid;

    db.resumeOrNew([userid, req.body.puzzleid], (callback) => {
        console.log(callback[1]);
        if (callback[1] === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            db.formatPuzzleJSON([callback[1]], (result) => {
                res.status(200).json(result);
            });
        }
    });
});

//get puzzle (default state) with given puzzleid
router.post("/puzzle", (req, res) => {
    db.getPuzzleID(req.body.puzzleid, (callback) => {
        if (callback === null) {
            //res.status(500).send(new Error("FAILURE"));
            res.status(404).send(new Error("Puzzle not found"));
        } else {
            db.formatPuzzleJSON([callback], (result) => {
                if (result != undefined) {
                    res.status(200).json(result[0]);
                }
            });
        }
    });
});

//to save progress of puzzle solving
router.post(
    "/savepuzzleprogress",
    authorization.authenticateToken,
    (req, res) => {
        let puzzle = req.body.puzzle;
        let userid = parseJwt(req.body.accessToken).userid;
        values = [
            userid,
            puzzle.puzzleid,
            JSON.stringify(puzzle.progress),
            0,
            0,
            "",
            "",
            "",
        ];
        db.addUserPuzzleProgress(values, (callback) => {
            if (callback === true) {
                res.status(200).send("Success");
            } else {
                res.status(500).send(new Error("FAILURE"));
            }
        });
    }
);

// Add a puzzle to database - create puzzle handler
router.post("/addPuzzle", authorization.authenticateToken, (req, res) => {
    let puzzle = req.body;
    let userid = parseJwt(req.body.accessToken).userid;
    if (puzzle.puzzletype == "sudoku") {
        let board = JSON.parse(JSON.stringify(puzzle.puzzledata));
        sudokusolver.runSolver(board, (callback) => {
            let id = uuidv1();

            //console.log("here")

            if (callback[0]) {
                let values = [
                    id, // ID
                    puzzle.puzzlename, // Name
                    puzzle.puzzledata, // Data
                    puzzle.difficulty, // Difficulty
                    callback[2], // Solution
                    "", // Date Created
                    userid, // Used ID
                    puzzle.puzzletype, // Type
                    puzzle.bgCSS, // Title CSS
                    0, // Rating
                    puzzle.puzzleImage, // Puzzle Image URL
                ];

                db.addPuzzle(values, (callback) => {
                    if (callback == true) {
                        res.status(200).send([true, id]);
                    } else {
                        res.status(500).send(new Error("FAILURE"));
                    }
                });
            } else {
                res.status(200).send(callback);
            }
        });
    }

    else {
        let id = uuidv1();
        let values = [
            id, // ID
            puzzle.puzzlename, // Name
            puzzle.puzzledata, // Data
            2, // Difficulty (always normal for a slides puzzle)
            puzzle.solution, // Solution
            "", // Date Created
            userid, // Used ID
            puzzle.puzzletype, // Type
            puzzle.bgCSS, // Title CSS
            0, // Rating
            puzzle.puzzleImage, // Puzzle Image URL
        ];

        db.addPuzzle(values, (callback) => {
            if (callback == true) {
                res.status(200).send([true, id]);
            } else {
                res.status(500).send(new Error("FAILURE"));
            }
        });
    }


});

// delete a puzzle
router.post("/deletePuzzle", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let values = [data.puzzleid];
    db.deletePuzzle(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send("Success");
        }
    });
});

// get user's elevation
router.post("/getElevation", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let values = [data.userid];
    db.getElevation(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send(callback);
        }
    });
});

// Retrieves XP for a particular user 
router.post("/getLevel", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let values = [data.userid];

    db.getXp(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send(callback);
        }
    });
});

// the router to add the ratings
router.post("/addRating", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let puzzledata = JSON.stringify(data.puzzle.puzzledata);
    let userid = parseJwt(req.body.accessToken).userid;

    let values = [data.userrating, userid, data.puzzleid, puzzledata];

    db.updateRatings(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send("Success");
        }
    });
});

// Retrieves rating for a particular puzzle
router.post("/getRating", (req, res) => {
    let data = req.body;

    db.calculateRatings(data.puzzleid, (callback) => {
        if (callback[0] === false) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            // console.log(callback[1]);
            res.status(200).json(callback[1]);
        }
    });
});

// Adds a comment object for a particular puzzle 
router.post("/addComment", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let userid = parseJwt(req.body.accessToken).userid;

    let values = [
        // commentID, userID, puzzleID, date, comment
        uuidv1(),
        userid,
        data.puzzleid,
        0,
        data.comment,
    ];

    db.addComment(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send("Success");
        }
    });
});

// Handles deleting a comment from a puzzle 
router.post("/removeComment", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let userid = parseJwt(req.body.accessToken).userid;

    let values = [userid, data.commentid];

    db.removeComment(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send("Success");
        }
    });
});

// retrieves all comments for a particular 
router.post("/getcomments", authorization.authenticateToken, (req, res) => {
    let data = req.body;

    db.getComments(data.puzzleid, (callback) => {
        if (callback[1] === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            //console.log(callback)
            res.status(200).json(callback);
        }
    });
});

router.post("/submitPuzzle", authorization.authenticateToken, (req, res) => {
    let data = req.body;
    let hasSolvedBefore = data.hasSolvedBefore;
    let userid = parseJwt(req.body.accessToken).userid;


    if (!hasSolvedBefore) {
        db.submitSolution([userid, data.puzzleid], (callback) => {
            if (callback[0]) {
                // this function's result a set of [boolean, level]
                // the boolean is for the success of the update
                // the level is for the level calculated
                db.updateXP([userid, data.puzzleid], (callback) => {
                    if (!callback[0]) {
                        console.log(callback[0]);

                        res.status(400).send("User not found");
                    } else {
                        res.status(200).json(callback[0]);
                    }
                });

                console.log("puzzle submitted");
            } else {
                console.log("solution not saved");
            }
        });
    } else {
        db.submitSolution([userid, data.puzzleid], (callback) => {
            if (callback[0]) {
                console.log("submitted the puzzle");
                res.status(200).send(callback[0]);
            } else {
                console.log("puzzle submission failed");
                res.status(400).send(callback[0]);
            }
        });
    }
});

// check if the puzzle has been solved before
router.post("/solvedBefore", (req, res) => {
    let data = req.body;
    let userid = parseJwt(req.body.accessToken).userid;

    // if the puzzle has been solve before, send false
    // if not, send true
    db.solvedBefore([userid, data.puzzleid], (callback) => {
        if (callback[0] == false) {
            console.log(callback[0]);
            res.status(200).send(callback[0]);
        } else {
            console.log(callback[0]);
            res.status(200).send(callback[0]);
        }
    });
});

router.post("/solvepuzzle", (req, res) => {
    let data = req.body;

    let board = sudokusolver.runSolver(data.puzzledata);

    if (board == null) {
        res.status(500).send(new Error("SOLUTION NOT FOUND"));
    } else {
        res.status(200).json(board);
        console.log("puzzle solver returned a solution");
    }
});

/*
    AI generated functions
*/
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post("/changePfp", authorization.authenticateToken, (req, res) => {
    let data = req.body;

    let values = [data.url, data.userid];

    console.log(values);

    db.addPfp(values, (callback) => {
        if (callback === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            res.status(200).send("Success");
        }
    });
});

router.post("/upload", upload.single("image"), async function (req, res) {
    console.log("Received image upload");

    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const file = req.file;
    const outputFilename = path.parse(file.filename).name + '.jpg';
    const outputPath = path.join("uploads", outputFilename);

    try {
        await sharp(file.path)
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg()
            .toBuffer((err, buffer) => {
                if (err) throw err;
                fs.writeFileSync(outputPath, buffer);

                // Remove the original file
                fs.unlinkSync(file.path);

                const url = "/uploads/" + outputFilename;
                res.status(200).send({ url: url });
            });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing image");
    }
});

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.post("/generateRandomSudoku", (req, res) => {

    const board = sudokusolver.generateRandomSudoku();
    if (board == null) {
        res.status(500).send(new Error("SOLUTION NOT FOUND"));
    } else {
        res.status(200).json(board);
        console.log("puzzle generator returned a solution");
    }

});

module.exports = router;
