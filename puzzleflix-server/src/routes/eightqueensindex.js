var express = require("express");
var router = express.Router();

//custom functions
const cors = require("cors");
const db = require("../database");
const bodyParser = require("body-parser");
const pool = require("../queries.js");
const jwtTokens = require("../middleware/token");
const authorization = require("../middleware/authorization");
const eightQueensPuzzle = require("../GameFunctions/eightqueenpuzzle");

// Middleware
const { origins, axiosConfig } = require("./config");

const environment = process.env.APP_ENVIRONMENT;

//------------------------Middleware-------------------------
// Middleware

console.log(origins);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

if (environment == "LOCAL") {
    router.use(
        cors({
            origin: origins, // <-- location of the react app were connecting to
            credentials: true,
        })
    );
} else if (environment == "PRODUCTION") {
    router.use(cors());
} else {
    console.log("Incorrect environemnt: Options are LOCAL and PRODUCTION");
}

//-----------------------------------------------------------

router.get("/getBoard", async (req, res) => {
    console.log("GETBOARD")
    db.resumeOrNewQueens(req.query.uid, function (callback) {
        console.log(callback[1]);
        res.json(callback[1].progress);
    });
});

/*request body format:
puzzle(with userid, puzzleid, puzzledata), xPos, yPos
*/
router.post("/move", authorization.authenticateToken, async (req, res) => {
    const { puzzle, xPos, yPos } = req.body;
    //get user progerss from db, (puzzleid should be fixed)
    db.resumeOrNew([req.user.userid, puzzleid], (callback) => {
        if (callback[1] === null) {
            res.status(500).send(new Error("FAILURE"));
        } else {
            //check whether it is valid to place the queen,
            //if so, update the puzzle board connected with the user, and respond true
            //otherwise respond false
            db.formatFedPuzzleJson(callback[1].puzzledata, (callback) => {
                if (callback === null) {
                    res.status(500).send(
                        new Error("Puzzle Cannot Be Parsed To JSON")
                    );
                } else {
                    board = callback;

                    if (board[xPos][yPos].localeCompare(0) == 0) {
                        let puzzledata = eightQueensPuzzle.placeQueen(
                            board,
                            xPos,
                            yPos
                        );

                        if (puzzledata === null) {
                            res.status(500).send([false, "Invalid Move"]);
                        } else {
                            values = [
                                puzzle.userid,
                                puzzle.puzzleid,
                                JSON.stringify(puzzle.puzzledata),
                                0,
                                0,
                                "",
                                "",
                                "",
                                "",
                                0,
                            ];

                            db.addUserPuzzleProgress(values, (callback) => {
                                if (callback === true) {
                                    eightQueensPuzzle.checkWin(
                                        board,
                                        (callback) => {
                                            if (callback) {
                                                res.status(200).send("Win");
                                            }
                                        }
                                    );

                                    res.status(200).send("Valid Move");
                                } else {
                                    res.status(500).send(new Error("FAILURE"));
                                }
                            });
                        }
                    } else if (board[xPos][yPos].localeCompare("Q") == 0) {
                        let puzzledata = eightQueensPuzzle.removeQueen(
                            board,
                            xPos,
                            yPos
                        );

                        if (puzzledata === null) {
                            res.status(500).send([false, "Invalid Move"]);
                        } else {
                            values = [
                                puzzle.userid,
                                puzzle.puzzleid,
                                JSON.stringify(puzzle.puzzledata),
                                0,
                                0,
                                "",
                                "",
                                "",
                                "",
                                0,
                            ];

                            db.addUserPuzzleProgress(values, (callback) => {
                                if (callback === true) {
                                    res.status(200).send("Success");
                                } else {
                                    res.status(500).send(new Error("FAILURE"));
                                }
                            });
                        }
                    } else {
                        res.status(500).send([false, "Cannot Place Here"]);
                    }
                }
            });
        }
    });
});

module.exports = router;
