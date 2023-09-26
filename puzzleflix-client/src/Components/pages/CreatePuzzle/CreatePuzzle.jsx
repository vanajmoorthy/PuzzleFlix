// Library
import React from "react";
import { useEffect, useLayoutEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// Config
import { hosturl, fullurl } from "./../../../Config";

//Styling
import "../../../base.css";
import "./CreatePuzzle.css";

//Components
import CreateModal from "./CreateModal/CreateModal";
import SolutionModal from "./SolutionModal/SolutionModal";
import CreateModalEights from "./CreateModalEights/CreateModalEights";

// Title banner color labels
const colors = [
    "white",
    "blue",
    "red",
    "green",
    "yellow",
    "dblue",
    "dgreen",
    "turq",
    "pink",
    "purple",
    "black",
];

// Title banner color unlock values
const colorsUnlock = {
    white: 0,
    blue: 3,
    red: 3,
    green: 3,
    yellow: 3,
    dblue: 5,
    black: 10,
    dgreen: 6,
    turq: 7,
    pink: 8,
    purple: 9,
    gold: 20,
    rainbow: 25,
};
const secondaryUnlockLvl = 5;
const customGradientUnlockLvl = 15;
const colorsCode = {
    white: "#ffffff",
    blue: "#00ffff",
    red: "#ff0000",
    green: "#00ff00",
    yellow: "#ffff00",
    dblue: "#3d57f4",
    dgreen: "#aaa",
    black: "#000000",
    turq: "#30D5C8",
    pink: "#ffc0cb",
    purple: "#9F2B68",
};

// Color gradient presets
const styles = [
    "linear-gradient(90deg, $primary 0%, $secondary 100%)",
    "linear-gradient(90deg, $secondary 0%, $primary 100%)",
    "linear-gradient(0deg, $primary 0%, $secondary 100%)",
    "linear-gradient(0deg, $secondary 0%, $primary 100%)",
    "radial-gradient($primary, $secondary)",
    "conic-gradient(from 45deg, $primary 0%, $secondary 100%)",
    "conic-gradient(from 45deg, $secondary 0%, $primary 100%)",
    "repeating-linear-gradient(90deg, $primary, $secondary 8px, $primary 8px)",
    "repeating-radial-gradient($primary, $secondary 10%, $primary 20%)",
    "repeating-radial-gradient(at bottom, $primary, $secondary 10%, $primary 20%)",
    "repeating-radial-gradient(at top, $primary, $secondary 10%, $primary 20%)",
    "repeating-radial-gradient(at left, $primary, $secondary 10%, $primary 20%)",
    "repeating-radial-gradient(at right, $primary, $secondary 10%, $primary 20%)",
];

const rainbowGradient =
    "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
const goldGradient =
    "linear-gradient(90deg, #BF953F 0%, #FBF5B7 50%, #AA771C 100%)";

let selectedPrimary = "white";
let selectedSecondary = "null";
let selectedCSS = "rgb(255,255,255)"; // USE THIS WHEN SAVING PUZZLE
let selectedStyle = 0;

// Default sudoku data
const sudokuBase = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Default eights data
const eightsBase = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

// Default eights puzzle image
const puzzleImageDefault = "/uploads/base.jpg";

const unlockMsg = "Unlocks at level: ";
const lockedHTML = "";
const lockedColor = "#aaa";

function CreatePuzzlePage(props) {
    const { checkAccessToken } = props;

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(0);
    const [canRender, setCanRender] = useState(0);
    const navigate = useNavigate();

    // Retrieves user level from back end
    const getLevel = async () => {
        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: {
                    userid: localStorage.getItem("userid"),
                    accessToken: localStorage.getItem("accessToken"),
                },
                url: fullurl + "/getLevel",
            });

            let data = res.data;
            let resxp = data.xp;

            setXp(resxp);

            const level = Math.floor((-17 + Math.sqrt(224 * resxp + 289)) / 14);
            setLevel(level);

            if (level < 1) {
                navigate("/");
            }

            return;
        } catch (err) {
            console.error(err);
        }
    };

    // Logout functionality
    const logout = (flag) => {
        set_login_state(0);
        localStorage.clear();
        if (flag) {
            navigate("/LoggedOut");
        } else {
            navigate("/");
        }
    };

    // Unlock colours
    useEffect(() => {
        // Check that user is logged in an access token has not expired
        if (!checkAccessToken() && localStorage.getItem("loginState") == 1) {
            logout(1);
        } else if (!checkAccessToken()) {
            logout(0);
        }

        //const unlock
        const unlock = async () => {
            //console.log("unlocking!");
            await getLevel();
            await getElevation();
        };
        unlock();
    }, []);

    // handles user changing the puzzle type they want to create
    function puzzleTypeChange(type) {
        if (type == "sudoku") {
            setCreatedPuzzle(sudokuBase);
            setSolutionPuzzle(sudokuBase);
        } else if (type == "eights") {
            setCreatedPuzzle(eightsBase);
            setSolutionPuzzle(eightsBase);
        }
        setPtype(type);
    }

    // Handles the user changing the puzzle title banner color
    const colorChange = async (color, type) => {
        const title = document.querySelectorAll(".text-input")[0];
        const primaryButtons = document.querySelectorAll(".primary-colors");
        const gold = document.getElementById("gold");
        const rainbow = document.getElementById("rainbow");
        const secondaryButtons = document.querySelectorAll(".secondary-colors");
        const styleButtons = document.querySelectorAll(".styles-buttons");
        const nullSecButton = document.querySelectorAll(
            ".secondary-colors-null"
        )[0];
        const customCSS = document.getElementById("customCSS");

        let newTitleBG = "";

        // If the color the user wants to change is the primary color
        if (type == "primary") {
            if (colorsUnlock[color] <= level) {
                selectedPrimary = color;
                nullSecButton.style.background = colorsCode[selectedPrimary];
            }
        } else if (type == "secondary") {
            // if the selected color to change is the seconday color
            if (
                secondaryUnlockLvl <= level &&
                colorsUnlock[color] <= level &&
                selectedPrimary != "special"
            ) {
                selectedSecondary = color;
            } else {
                return;
            }
        } else if (type == "style") {
            // If the aspect to change is the pattern/gradient of title banner
            // Sample to see if allowed
            if (
                customGradientUnlockLvl <= level &&
                selectedPrimary != "special"
            ) {
                selectedStyle = color;
            } else {
                return;
            }
        } else if (type == null) {
            // If the type is not specified
            selectedPrimary = "white";
            selectedSecondary = "null";
            newTitleBG = "rgb(255,255,255)";
            nullSecButton.style.background = colorsCode[selectedPrimary];
        } else {
            selectedSecondary = "null";
        }
        // Gold button
        if (type == "gold") {
            if (colorsUnlock["gold"] <= level) {
                newTitleBG = goldGradient;
                nullSecButton.style.background = lockedColor;

                secondaryButtons.forEach((button) => {
                    button.style.background = lockedColor;
                });

                styleButtons.forEach((button) => {
                    button.style.background = lockedColor;
                });

                selectedPrimary = "special";
            } else {
                return;
            }
        // Rainbow button
        } else if (type == "rainbow") {
            if (colorsUnlock["rainbow"] <= level) {
                newTitleBG = rainbowGradient;
                nullSecButton.style.background = lockedColor;

                secondaryButtons.forEach((button) => {
                    button.style.background = lockedColor;
                });

                styleButtons.forEach((button) => {
                    button.style.background = lockedColor;
                });

                selectedPrimary = "special";
            } else {
                return;
            }
        // Custom (moderator only option)
        } else if (type == "custom") {
            newTitleBG = color;
        } else {
            // Update secondary buttons
            secondaryButtons.forEach((button) => {
                let buttonID = button.id;

                if (buttonID == "null") {
                    button.style.background = colorsCode[selectedPrimary];
                } else if (
                    secondaryUnlockLvl <= level &&
                    colorsUnlock[buttonID] <= level
                ) {
                    button.style.background = styles[selectedStyle]
                        .replaceAll("$primary", colorsCode[selectedPrimary])
                        .replaceAll("$secondary", colorsCode[buttonID]);
                } else {
                    button.title =
                        unlockMsg +
                        Math.max(colorsUnlock[buttonID], secondaryUnlockLvl);
                    button.innerHTML = lockedHTML;
                }
            });

            // If the user level is high enough to use the gradient
            if (customGradientUnlockLvl <= level) {
                let sec = selectedSecondary;

                if (sec == "null") {
                    if (selectedPrimary != "black") sec = "black";
                    else sec = "white";
                }

                styleButtons.forEach((button, index) => {
                    button.style.background = styles[index]
                        .replaceAll("$primary", colorsCode[selectedPrimary])
                        .replaceAll("$secondary", colorsCode[sec]);
                });
            } else {
                styleButtons.forEach((button, index) => {
                    button.title = unlockMsg + customGradientUnlockLvl;
                    button.innerHTML = lockedHTML;
                });
            }

            if (selectedSecondary == "null") {
                newTitleBG = colorsCode[selectedPrimary];
            } else {
                newTitleBG = styles[selectedStyle]
                    .replaceAll("$primary", colorsCode[selectedPrimary])
                    .replaceAll("$secondary", colorsCode[selectedSecondary]);
            }
        }

        // Set custom box if exists
        if (type != "custom") {
            if (customCSS) {
                customCSS.value = newTitleBG;
            } else {
                // Do nothing
            }
        }

        // Set title
        title.style.background = newTitleBG;
        selectedCSS = newTitleBG;
    };

    const [puzzleName, setPuzzleName] = useState();

    // Generates the puzzle modal based on current puzzle data
    const generatePuzzle = (puzzleArray) => {
        let puzzle = [];
        puzzleArray.map((rows, i) => {
            let row = [];
            rows.map((cell, j) => {
                if (cell != 0) {
                    row.push({ value: cell, filled: true, index: `${i}${j}` });
                } else {
                    row.push({ value: 0, filled: false, index: `${i}${j}` });
                }
            });
            puzzle.push(row);
        });

        return puzzle;
    }; // End generate puzzle

    let p = sudokuBase;
    const [createdPuzzle, setCreatedPuzzle] = useState(generatePuzzle(p));
    const [solutionPuzzle, setSolutionPuzzle] = useState(generatePuzzle(p));
    const [hasEnoughClues, setHasEnoughClues] = useState(1);
    const [canSolutionRender, setCanSolutionRender] = useState(1);
    const [isPuzzleNameValid, setIsPuzzleNameValid] = useState(0);
    const [isPuzzleStateValid, setIsPuzzleStateValid] = useState(0);
    const [elevation, setElevation] = useState(0); // The user elevation level

    const [ptype, setPtype] = useState("sudoku");
    const [puzzleImage, setImage] = useState(puzzleImageDefault);

    const handleSudokuSubmit = async (inputPuzzle) => {
        let clueCount = 0;

        let newPuzzle = [];

        // Check that a sufficient number of cells were filled for puzzle
        inputPuzzle.map((rows, index) => {
            rows.map((cell, sIndex) => {
                if (cell.value != 0) {
                    clueCount++;
                }
            });
        });

        if (clueCount < 17) {
            //CHANGE BACK
            setHasEnoughClues(0);
            console.log("Not enough clues");
            return;
        } else {
            console.log("Enough clues");

            setHasEnoughClues(1);
            setCanSolutionRender((curr) => !curr);
            setCreatedPuzzle(inputPuzzle);
        }

        let difficulty = 0;

        if (clueCount == 17) difficulty = 3;
        else if (clueCount > 17 && clueCount < 19) difficulty = 2;
        else difficulty = 1;

        // If named
        if (puzzleName) {
            setIsPuzzleNameValid(0);

            setErrorMessage("");
            let formattedPuzzle = [];

            // Set puzzle input
            inputPuzzle.map((rows, index) => {
                let row = [];
                rows.map((cell, index) => {
                    row.push(cell.value);
                });
                formattedPuzzle.push(row);
            });

            // Send add puzzle request
            try {
                const res = await Axios({
                    method: "POST",
                    withCredentials: true,
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("accessToken"),
                    },
                    data: {
                        userid: localStorage.getItem("userid"),
                        accessToken: localStorage.getItem("accessToken"),
                        puzzlename: puzzleName,
                        puzzledata: formattedPuzzle,
                        difficulty: difficulty,
                        solution: [],
                        puzzletype: "sudoku",
                        bgCSS: selectedCSS,
                        puzzleImage: "",
                    },
                    url: fullurl + "/addPuzzle",
                });

                if (res.data[0]) {
                    // redirect to new puzzle
                    navigate("/Puzzle/?puzzleid=" + res.data[1]);
                } else {
                    setErrorMessage(res.data[1]);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            setIsPuzzleNameValid(1);
        }
    };

    // For handling a change in the user input solution
    const handleSolutionChange = (inputPuzzle) => {
        setSolutionPuzzle(inputPuzzle);
    };

    const [errorMessage, setErrorMessage] = useState("");

    // Checks that the solution filled by the user is valid
    const checkSolution = (puzzleObj) => {
        // Count number of filled cells
        let count = 0;
        puzzleObj.map((rows) => {
            rows.map((cell) => {
                if (cell.value != 0) {
                    count++;
                }
            });
        });

        // Check that all cells were filled
        if (count != 81) {
            return false;
        }
        return true;
    };

    // separates the puzzle and puzzle solution data
    const separate = (puzzleObj) => {
        let solution = [];
        let puzzle = [];
        puzzleObj.map((rows) => {
            let solutionRow = [];
            let puzzleRow = [];
            rows.map((cell) => {
                solutionRow.push(cell.value);

                if (cell.filledBy == "puzzle") {
                    puzzleRow.push(cell.value);
                } else {
                    puzzleRow.push(0);
                }
            });
            solution.push(solutionRow);
            puzzle.push(puzzleRow);
        });
        return [solution, puzzle];
    };

    // Retrieves the user elevation level from backend
    const getElevation = async () => {
        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: {
                    userid: localStorage.getItem("userid"),
                },
                url: fullurl + "/getElevation",
            });

            let data = res.data;
            let gotElevation = data.accountelevation;
            setElevation(gotElevation);

            setCanRender(1);
            return;
        } catch (err) {
            console.error(err);
        }
    };

    // Sends user created eights puzzle to backend
    const handleEightsSolutionSubmit = async () => {
        // Check puzzle validity
        if (puzzleName) {
            setIsPuzzleNameValid(0);
            let arr = separate(solutionPuzzle)[0];

            // Check if invalid (they have not shuffled or it is the same as the solution)
            let invalid = true;

            arr.forEach((row, rowIndex) => {
                row.forEach((elem, colIndex) => {
                    if (
                        arr[rowIndex][colIndex] !== undefined &&
                        arr[rowIndex][colIndex] !==
                            eightsBase[rowIndex][colIndex]
                    ) {
                        invalid = false;
                    }
                });
            });

            if (!invalid) {
                setIsPuzzleStateValid(0);

                // Send to back end
                try {
                    const res = await Axios({
                        method: "POST",
                        withCredentials: true,
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("accessToken"),
                        },
                        data: {
                            userid: localStorage.getItem("userid"),
                            accessToken: localStorage.getItem("accessToken"),
                            puzzlename: puzzleName,
                            puzzledata: arr,
                            difficulty: 1,
                            solution: eightsBase,
                            puzzletype: "eights",
                            bgCSS: selectedCSS,
                            puzzleImage: puzzleImage,
                        },
                        url: fullurl + "/addPuzzle",
                    });
                    // redirect to new puzzle
                    navigate("/Puzzle/?puzzleid=" + res.data[1]);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setIsPuzzleStateValid(1);
            }
        } else {
            setIsPuzzleNameValid(1);
        }
    };

    // For testing level system for unlocking title banner options
    let levelup = () => {
        setLevel(level + 1);
        colorChange(null, null);
    };

    // check that user is logged in
    if (localStorage.getItem("loginState") == 1 && canRender == 1) {
        return (
            <div className="createpuzzle-wrapper">
                {/* <button onClick={levelup}>level up</button> */}
                <div className="max-width">
                    <h1 className="title">Create Your Own Puzzle</h1>

                    <div className="createpuzzle-element">
                        <input
                            type="text"
                            className="text-input"
                            name="puzzle-title"
                            placeholder="Puzzle Title..."
                            style={{ borderStyle: "solid" }}
                            onChange={(e) => setPuzzleName(e.target.value)}
                        />
                    </div>
                    <br />
                    <div>
                        <label className="colorTag">Primary Colour:</label>
                        <ul style={{ marginTop: "2px" }}>
                            {colors.map((color, index) =>
                                colorsUnlock[color] <= level ? (
                                    <button
                                        id={color}
                                        className="primary-colors"
                                        style={{
                                            backgroundColor: colorsCode[color],
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        key={index}
                                        onClick={() =>
                                            colorChange(color, "primary")
                                        }
                                        title=""
                                    />
                                ) : (
                                    <button
                                        id={color}
                                        className="primary-colors"
                                        style={{
                                            backgroundColor: lockedColor,
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        key={index}
                                        onClick={() =>
                                            colorChange(color, "primary")
                                        }
                                        title={unlockMsg + colorsUnlock[color]}
                                    />
                                )
                            )}
                            {colorsUnlock["gold"] <= level ? (
                                <button
                                    id={"gold"}
                                    className="gold"
                                    style={{
                                        background: goldGradient,
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    onClick={() => colorChange("null", "gold")}
                                    title={""}
                                />
                            ) : (
                                <button
                                    id={"gold"}
                                    className="gold"
                                    style={{
                                        backgroundColor: lockedColor,
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    onClick={() => colorChange("null", "gold")}
                                    title={unlockMsg + colorsUnlock["gold"]}
                                />
                            )}
                            {colorsUnlock["rainbow"] <= level ? (
                                <button
                                    id={"rainbow"}
                                    className="rainbow"
                                    style={{
                                        background: rainbowGradient,
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    onClick={() =>
                                        colorChange("null", "rainbow")
                                    }
                                    title={""}
                                />
                            ) : (
                                <button
                                    id={"rainbow"}
                                    className="rainbow"
                                    style={{
                                        backgroundColor: lockedColor,
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    onClick={() =>
                                        colorChange("null", "rainbow")
                                    }
                                    title={unlockMsg + colorsUnlock["rainbow"]}
                                />
                            )}
                        </ul>
                    </div>
                    <br />
                    <div>
                        <label className="colorTag">Secondary Colour:</label>
                        <ul style={{ marginTop: "2px" }}>
                            <button
                                id={"null"}
                                className="secondary-colors-null"
                                style={{
                                    background: "#fff",
                                    width: "40px",
                                    height: "40px",
                                }}
                                onClick={() => colorChange("null", "secondary")}
                            />
                            {colors.map((color, index) =>
                                colorsUnlock[color] <= level &&
                                secondaryUnlockLvl <= level ? (
                                    <button
                                        id={color}
                                        className="secondary-colors"
                                        style={{
                                            background: styles[selectedStyle]
                                                .replaceAll(
                                                    "$primary",
                                                    colorsCode[selectedPrimary]
                                                )
                                                .replaceAll(
                                                    "$secondary",
                                                    colorsCode[color]
                                                ),
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        key={index}
                                        onClick={() =>
                                            colorChange(color, "secondary")
                                        }
                                        title={""}
                                    />
                                ) : (
                                    <button
                                        id={color}
                                        className="secondary-colors"
                                        style={{
                                            backgroundColor: lockedColor,
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        key={index}
                                        onClick={() =>
                                            colorChange(color, "secondary")
                                        }
                                        title={
                                            unlockMsg +
                                            Math.max(
                                                colorsUnlock[color],
                                                secondaryUnlockLvl
                                            )
                                        }
                                    />
                                )
                            )}
                        </ul>
                    </div>
                    <br />
                    <div>
                        <label className="colorTag">Style:</label>
                        <ul style={{ marginTop: "2px" }}>
                            {styles.map((style, index) =>
                                customGradientUnlockLvl <= level ? (
                                    <button
                                        id={"style:" + index}
                                        className="styles-buttons"
                                        style={{
                                            background: styles[index]
                                                .replaceAll(
                                                    "$primary",
                                                    colorsCode["white"]
                                                )
                                                .replaceAll(
                                                    "$secondary",
                                                    colorsCode["black"]
                                                ),
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        key={style.id}
                                        onClick={() =>
                                            colorChange(index, "style")
                                        }
                                        title=""
                                    ></button>
                                ) : (
                                    <button
                                        id={"style:" + index}
                                        className="styles-buttons"
                                        style={{
                                            background: lockedColor,
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        key={style.id}
                                        onClick={() =>
                                            colorChange(index, "style")
                                        }
                                        title={
                                            unlockMsg + customGradientUnlockLvl
                                        }
                                    />
                                )
                            )}
                        </ul>
                    </div>
                    <br />
                    {elevation >= 2 && (
                        <div>
                            <label className="colorTag">Custom CSS:</label>

                            <input
                                type="text"
                                className="text-input"
                                id="customCSS"
                                name="puzzle-title"
                                placeholder="rgb(255, 255, 255)"
                                style={{
                                    marginTop: "2px",
                                    borderStyle: "solid",
                                }}
                                onChange={(e) =>
                                    colorChange(e.target.value, "custom")
                                }
                            />
                        </div>
                    )}
                    <div>
                        <label className="colorTag">Puzzle type:</label>
                        <ul style={{ marginTop: "2px" }}>
                            <button
                                id="sudoku"
                                className="type-button"
                                onClick={() => puzzleTypeChange("sudoku")}
                            >
                                <p>Sudoku</p>
                            </button>
                            <button
                                id="eights"
                                className="type-button"
                                onClick={() => puzzleTypeChange("eights")}
                            >
                                <p>Eights</p>
                            </button>
                        </ul>
                    </div>
                    <br />
                </div>

                {<p className="clue-error">{errorMessage}</p>}
                {isPuzzleNameValid == 1 ? (
                    <p className="clue-error">
                        {" "}
                        Please enter a name before submitting!
                    </p>
                ) : (
                    ""
                )}
                {isPuzzleStateValid == 1 ? (
                    <p className="clue-error">
                        {" "}
                        Please make sure that you shuffle the puzzle!
                    </p>
                ) : (
                    ""
                )}

                {/* puzzle itself */}
                {ptype == "sudoku" ? (
                    <div className="createpuzzle-element">
                        <div>
                            <h1>Puzzle</h1>

                            {hasEnoughClues == 0 ? (
                                <p className="clue-error">
                                    Please fill out at least 17 clues
                                </p>
                            ) : (
                                ""
                            )}
                            <CreateModal
                                handleSudokuSubmit={handleSudokuSubmit}
                            />
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {ptype == "eights" ? (
                    <div className="createpuzzle-element">
                        <div>
                            <h1>Scramble your puzzle!</h1>
                            <CreateModalEights
                                handleSolutionChange={handleSolutionChange}
                                handleEightsSubmit={handleEightsSolutionSubmit}
                                setPuzzleImage={setImage}
                                puzzleImage={puzzleImage}
                            />
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    } else {
        if (localStorage.getItem("loginState") != 1) {
            navigate("/Login");
        }
    }
}

export default CreatePuzzlePage;
