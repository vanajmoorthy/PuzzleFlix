var express = require("express");
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v1: uuidv1 } = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const Axios = require("axios").Axios;
const atob = require("atob");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

//custom functions
const db = require("./../database");
const pool = require("../queries.js");
const jwtTokens = require("./../middleware/token");
const authorization = require("./../middleware/authorization");
const { ifError } = require("assert");

const { origins, axiosConfig } = require("./config");
const { access } = require("fs");

require("dotenv").config();

//------------------------ MIDDLEWARE -------------------------


const environment = process.env.APP_ENVIRONMENT;

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

//------------------------------------------------------------------

//client secrets includes all client that have fingerprints as secrets registered at this server
const clientSecrets = {
    10: "S10HtokACcUN9HuPOalGI5nri60JBAdTMOFV9mMmfHTb2ak7Jsh+yxSv17LSKn/c1Gu+9tRMHyPue3U3xA8utrKx07c0W7kwR0iL",
    11: "QyAJqaHxyYEHZe+EkJrvRkdfQWHXv0ZL24roymia7v696TiP9Fo2tkKnTYK92UEel5Q1aTV5MDQbppdLCerlyT+aIA8BqfzGgefQ",
    12: "7u7TYHoI+xKmT8cc4cYB3wR3Qze/dfehhiaZQoVp3t7NKEar8osLBJyZBSA53I+LLRPaInb0sCtPAoVo+GFb5yz5Y4oUcdmVoGiV",
    13: "rtcrug6pcBvlgLNEKZdvscenOXHKM9CaSeD++QYYG9+0AJX3ueHrPACaK129WnCGKnvGQHLtIUirqMvFfvnVAJI+HwemPT5eVKyz",
    14: "3kpvcwwx/3+mP0ruu5jLqr8iMgmHvXh50mVGCgxmdzdbP0VfuJL9vAvkEL9naJWjfPQUagWkd2eTHLKkiScejt6mBzl4mS+gob9n",
    15: "iDEDTcauD5wt8l8YUwVbhBt9kbpFwPC+gCdVMe4GFck+fbY+YOZ0Y5zItBkYghoeuxpcTZGUvv8mEZY/Zc4e2cDeq+h1x+5QrSwS",
    16: "GMOeXsWPz8eGloWop6AvRs43n4+3RijXAQSaqNXlwPrIdPT5vo+vZc9eR19dKayRZc4Ollt/HkFQccJKmsOVFdsnxatK8BLkoYXD",
    17: "7GKgMxKlxhofMgAPd4QEMbu4qxSrr8tHZynJe4M9OxkOR4tpfLkr9o159L8PcB0q1xDSIi2z/hs42uVT17KE9gDEPYXBuPYCgaT7",
    18: "hCm/JHFoaV1ilvhWN5JJCDQo8ntzWhLWot4MCZKO1xGzWp1lHKs9lWDV8oHjhmqbRf60BzNk1EGQoJJg2lSPoLqL8tdEEWRKGX4k",
    19: "9IG53gw1t2MolUyQtfJ6qZeDhUEVXzGJvCLmHOx45S2XTiQwSTzEQFYKi/+Tt9X50knt/57x16s3VdlCytQpB8TduQ9fAHjBT+3c",
};
//client IDs includes all client ids that are valid to get requests for "/fedapi/"
const clientIDsMap = new Map();
clientIDsMap.set("10", "https://cs3099user10.host.cs.st-andrews.ac.uk");
clientIDsMap.set("11", "https://cs3099user11.host.cs.st-andrews.ac.uk");
clientIDsMap.set("12", "https://cs3099user12.host.cs.st-andrews.ac.uk");
clientIDsMap.set("13", "https://cs3099user13.host.cs.st-andrews.ac.uk");
clientIDsMap.set("14", "https://cs3099user14.host.cs.st-andrews.ac.uk");
clientIDsMap.set("15", "https://cs3099user15.host.cs.st-andrews.ac.uk");
clientIDsMap.set("16", "https://cs3099user16.host.cs.st-andrews.ac.uk");
clientIDsMap.set("17", "https://cs3099user17.host.cs.st-andrews.ac.uk");
clientIDsMap.set("18", "https://cs3099user18.host.cs.st-andrews.ac.uk");
clientIDsMap.set("19", "https://cs3099user19.host.cs.st-andrews.ac.uk");

//test login post handler
router.post("/testlogin", (req, res) => {
    console.log(req.body);
    const { group } = req.body;

    res.redirect("");
});

//Return information about the federation api
router.get("/", (req, res) => {
    res.status(200).json({
        group: "15",
        greeting: "Welcome to our federated backend!",
    });
}); //end get

//Request authorisation to users's Authorisation Server
router.get("/auth/authorise", async (req, res) => {
    try {
        const { response_type, redirect_uri, client_id, state } = req.query;
        console.log(response_type, redirect_uri, client_id, state);

        if (client_id >= 10 && client_id <= 19) {
            if (response_type.localeCompare("code") == 0) {
                res.redirect(
                    "/FedLogin/?redirect_uri=" +
                    redirect_uri +
                    "&client_id=" +
                    client_id +
                    "&state=" +
                    state
                );
            }
        } else {
            res.send("Invalid Client ID");
        }
    } catch (err) {
        res.status(500).send(new Error("Failure"));
    }
}); //end get

router.post("/auth/fedlogin/successful", async (req, res) => {
    const { redirect_uri, client_id, userid } = req.body;

    let tokens = jwtTokens.jwtTokens({ userid });

    const accessCode = tokens.accessToken;

    res.status(200).json({
        code: accessCode,
    });
});

//decodes token
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

router.get("/auth/redirect/:server_id", async (req, res) => {
    console.log("AUTH/REDIRECT");
    try {
        let { code } = req.params;
        let { server_id } = req.params;

        if (code == null || code == "" || code == "undefined") {
            code = req.query.code;
        }
        if (code == null || code == "" || code == "undefined") {
            code = req.body.code;
        }

        server_id = server_id.slice(-2);

        console.log(code);

        try {
            const res1 = await axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                params: {
                    client_id: 15,
                    client_secret:
                        "iDEDTcauD5wt8l8YUwVbhBt9kbpFwPC+gCdVMe4GFck+fbY+YOZ0Y5zItBkYghoeuxpcTZGUvv8mEZY/Zc4e2cDeq+h1x+5QrSwS",
                    grant_type: "authorization_code",
                    code: code,
                },
                data: {
                    client_id: 15,
                    client_secret:
                        "iDEDTcauD5wt8l8YUwVbhBt9kbpFwPC+gCdVMe4GFck+fbY+YOZ0Y5zItBkYghoeuxpcTZGUvv8mEZY/Zc4e2cDeq+h1x+5QrSwS",
                    grant_type: "authorization_code",
                    code: code,
                },
                url: clientIDsMap.get(server_id) + "/fedapi/auth/token",
            });

            console.log("AXIOS POST /auth/token");

            let access_token = res1.data.access_token;

            let expiry = parseJwt(access_token).iat + 1000000;

            if (
                access_token == "" ||
                access_token == null ||
                access_token == undefined
            ) {
                access_token = res1.params["access_token"];
            }
            console.log(access_token);
            try {
                const res2 = await axios({
                    method: "GET",
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + access_token,
                    },
                    url: clientIDsMap.get(server_id) + "/fedapi/user",
                });
                const user = res2.data;
                console.log(user);
                console.log("AXIOS GET /fedapi/user");

                res.redirect(
                    302,
                    "https://puzzleflix.vanaj.io/?fedapi=1&username=" +
                    user.username +
                    "&userid=" +
                    user.id +
                    "&email=" +
                    user.email +
                    "&group=" +
                    user.group +
                    "&access_token=" +
                    access_token +
                    "&expiry=" + expiry
                );
            } catch (err) {
                res.status(500).send(new Error("Failure"));
            }
        } catch (err) {
            console.error(err.response);
        }
    } catch (err) {
        console.error(err.response);
    }
}); //end get



router.post("/auth/token", async (req, res) => {
    console.log("/AUTH/TOKEN");
    try {
        const { client_id, client_secret, grant_type, code } = req.body;

        console.log(client_secret);

        //verify the client id and client secret matches at our record
        if (
            client_id >= 10 &&
            client_id <= 19 &&
            clientSecrets[client_id].localeCompare(client_secret) == 0 &&
            grant_type.localeCompare("authorization_code") == 0
        ) {
            let userid = parseJwt(code).userid.userid;

            db.getUsersID([userid], async (err, result) => {
                if (err) {
                    console.log("Error");
                } else {
                    result = eval(JSON.parse(JSON.stringify(result)));

                    let tokens = jwtTokens.jwtTokens(
                        result[0].userid,
                        result[0].username,
                        result[0].email
                    );
                    res.cookie("refresh_token", tokens.refreshToken, {
                        httpOnly: true,
                    });
                    res.status(200).json({
                        access_token: tokens.refreshToken,
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).send(new Error("Failure"));
    }
}); //end post

router.get("/user", authorization.authenticateToken, async (req, res) => {
    try {
        console.log("user");
        const authHeader = req.headers["authorization"]; //Bearer TOKEN
        const token = authHeader && authHeader.split(" ")[1]; //Bearer index 0, TOKEN index 1

        let userObj = parseJwt(token);

        delete userObj.iat;
        delete userObj.exp;
        userObj.group = 15;

        // Convert UID

        const user = {
            username: userObj.username,
            id: userObj.userid,
            email: userObj.email,
            group: 15,
        };

        console.log(user);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(new Error("Failure"));
    }
}); //end get

router.get("/sudoku", async (req, res) => {
    const { difficulty } = req.query;

    if (difficulty == 0 || difficulty == 1 || difficulty == 2) {
        db.getPuzzleDifficulty([difficulty], (result) => {
            db.formatFedPuzzleJson(result, (result2) => {
                res.status(200).json(result2);
                console.log(result2);
            });
        });
    }
}); //end get

/**
 * Sorts Fed Puzzles by ID
 * @param puzzles : the array of puzzle objects
 * @param mode    : 1 for ascending, -1 for descending order
 */
const sortJsonID = (puzzles, mode) => {
    puzzles.sort((a, b) => {
        let idA = a.sudoku_id;
        let idB = b.sudoku_id;

        if (idA < idB) {
            return mode * -1;
        }
        if (idA > idB) {
            return mode * 1;
        }
        return 0;
    });
    return puzzles;
};

/**
 * Sorts fed puzzles by difficulty
 * @param puzzles : the array of puzzle objects
 * @param mode    : 1 for ascending, -1 for descending order
 */
const sortJsonDiff = (puzzles, mode) => {
    puzzles.sort((a, b) => {
        let diffA = a.difficulty;
        let diffB = b.difficulty;

        if (diffA < diffB) {
            return mode * -1;
        }
        if (diffA > diffB) {
            return mode * 1;
        }
        return 0;
    });
    return puzzles;
};

router.get("/fedpuzzles", async (req, res) => {

    const { count, index, mode } = req.query;

    let puzzles = [];

    const groups = ["10", "11", "12", "13", "14", "16", "17", "18", "19"];

    for (group of groups) {
        try {
            const res = await axios({
                timeout: 60,
                method: "GET",
                withCredentials: true,
                params: {
                    // difficulty: 0,
                },
                url: clientIDsMap.get(group) + "/fedapi/sudoku",
            });
            puzzles.push(...res.data);
        } catch (err) {
            // console.error(err);
            // console.log("BAD", group);
        }
    }

    console.log("TEST ONE");

    // Sort array of puzzles
    if (mode == "orderByDifficultyAsc") {
        puzzles = sortJsonDiff(puzzles, 1);
    } else if (mode == "orderByDifficultyDesc") {
        puzzles = sortJsonDiff(puzzles, -1);
    } else if (mode == "orderByNameAsc") {
        puzzles = sortJsonID(puzzles, 1);
    } else {
        puzzles = sortJsonID(puzzles, -1);
    }

    res.status(200).json([
        puzzles.slice(parseInt(index), parseInt(index) + parseInt(count)),
        puzzles.length,
    ]);
});

module.exports = router;
