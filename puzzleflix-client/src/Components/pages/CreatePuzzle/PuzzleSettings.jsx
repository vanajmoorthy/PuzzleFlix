// Libraries
import React from "react";
import LoginModal from "../../modals/LoginModal/LoginModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

//Styling
import "../../../base.css";
import "./CreatePuzzle.css";

//custom components and objects
import CreateModal from "./CreateModal/CreateModal";
import SolutionModal from "./SolutionModal/SolutionModal";
import { useEffect } from "react";
import { hosturl, fullurl } from "./../../../Config";

function CreatePuzzlePage(props) {
    const [puzzleName, setPuzzleName] = useState();

    //Renders and prepares puzzle data for display in modal
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
    };

    // Default puzzle state
    const p = [
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
    const [createdPuzzle, setCreatedPuzzle] = useState(generatePuzzle(p));
    const [solutionPuzzle, setSolutionPuzzle] = useState(generatePuzzle(p));
    const [hasEnoughClues, setHasEnoughClues] = useState(1);
    const [canSolutionRender, setCanSolutionRender] = useState(1);
    const [isPuzzleNameValid, setIsPuzzleNameValid] = useState(0);

    // Checks the validity of puzzle on submit
    const handleSudokuSubmit = (inputPuzzle) => {
        let clueCount = 0;

        let newPuzzle = [];

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
        } else {
            console.log("Enough clues");

            setHasEnoughClues(1);
            setCanSolutionRender((curr) => !curr);
            setCreatedPuzzle(inputPuzzle);

            for (let i = 0; i < inputPuzzle.length; i++) {
                let row = [];
                for (let j = 0; j < inputPuzzle[i].length; j++) {
                    if (inputPuzzle[i][j].filledBy == "puzzle") {
                        row.push(inputPuzzle[i][j]);
                    } else {
                        row.push(solutionPuzzle[i][j]);
                    }
                }

                newPuzzle.push(row);
            }

            setSolutionPuzzle(newPuzzle);
        }
    };

    // Handles the user making a change in the solution modal
    const handleSolutionChange = (inputPuzzle) => {
        setSolutionPuzzle(inputPuzzle);
    };

    const [errorMessage, setErrorMessage] = useState("");

    // Checks that the solution is valid
    const checkSolution = (puzzleObj) => {
        // cound number of filled cells
        let count = 0;
        puzzleObj.map((rows) => {
            rows.map((cell) => {
                if (cell.value != 0) {
                    count++;
                }
            });
        });

        // Check that all cells are filled
        if (count != 81) {
            return false;
        }
        return true;
    };

    // Separates the puzzle data from solution data into two separate arrays
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

    // Sends puzzle data to back end
    const handleSolutionSubmit = async () => {
        if (puzzleName) {
            setIsPuzzleNameValid(0);

            if (!checkSolution(solutionPuzzle)) {
                setErrorMessage("Please fill out all solution cells!");
            } else {
                setErrorMessage("");
                const arr = separate(solutionPuzzle);

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
                            puzzledata: arr[1],
                            solution: arr[0],
                            puzzletype: "sudoku",
                        },
                        url: fullurl + "/addPuzzle",
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            setIsPuzzleNameValid(1);
        }
    };

    return (
        <div className="createpuzzle-wrapper">
            <div className="max-width">
                <h1 className="title">Create Your Own Puzzle</h1>

                <div className="createpuzzle-element">
                    <input
                        type="text"
                        className="text-input"
                        name="puzzle-title"
                        placeholder="Puzzle Title..."
                        onChange={(e) => setPuzzleName(e.target.value)}
                    />
                </div>
                <div>
                    <p>
                        PERHAPS CHANGE THE PAGE TO CHOOSE TITLE AND COLOUR AFTER
                        FINISHING THE PUZZLE?
                    </p>
                    <label for="primaryColour">Primary Colour </label>
                    <input
                        type="color"
                        id="primaryColour"
                        onChange={(e) => setPuzzleName(e.target.value)}
                    />
                    <label for="primaryColour"> Secondary Colour </label>
                    <input
                        type="color"
                        id="primaryColour"
                        onChange={(e) => setPuzzleName(e.target.value)}
                    />
                </div>
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

            {/* puzzle itself */}
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
                    <CreateModal handleSudokuSubmit={handleSudokuSubmit} />
                </div>

                <div>
                    <h1>Solution</h1>
                    <SolutionModal
                        handleSolutionChange={handleSolutionChange}
                        handleSolutionSubmit={handleSolutionSubmit}
                        key={canSolutionRender}
                        puzzleData={solutionPuzzle}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreatePuzzlePage;
