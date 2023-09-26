// Libaries
import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { fullurl } from "../../../Config";

// Components
import SuccessModal from "../SuccessModal/SuccessModal";

//Styling
import "../../../base.css";
import "./EightQueensModal.css";

// Icons
import { ReactComponent as SubmitIcon } from "../../../assets/bx-check.svg";
import { ReactComponent as Queen } from "../../../assets/queen.svg";

function EightQueensModal(props) {
    const {
        puzzleData,
        numberOfQueens,
        loginState,
        checkAccessToken,
        formatPuzzle,
    } = props;

    const queenCounter = useRef();
    const [puzzle, setPuzzle] = useState([]);
    const [forceRender, setForceRender] = useState(true);
    const [canRender, setCanRender] = useState(false);
    const activeIndex = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const [modalState, setModalState] = useState(false);

    const [hasSolved, setHasSolved] = useState(false);

    // Retrieve puzzle data
    useLayoutEffect(() => {
        setPuzzle(puzzleData);
        queenCounter.current = numberOfQueens;
        setCanRender(true);
    }, []);

    // Takes an array and returns an array of all the indexes of value passed in
    const getAllIndexes = (arr, val) => {
        var indexes = [],
            i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    };

    const getColumn = (arr, n) => arr.map((x) => x[n]);

    const getDiagonalsOfMatrix = (matrix) => {
        const diagonals = [];
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        // get diagonals starting from top-left corner
        for (let i = 0; i < numRows; i++) {
            const diagonal = [];
            let row = i;
            let col = 0;
            while (row >= 0 && col < numCols) {
                diagonal.push(matrix[row][col]);
                row--;
                col++;
            }
            if (diagonal.length > 0) {
                diagonals.push(diagonal);
            }
        }

        // get diagonals starting from bottom-left corner
        for (let i = 1; i < numCols; i++) {
            const diagonal = [];
            let row = numRows - 1;
            let col = i;
            while (row >= 0 && col < numCols) {
                diagonal.push(matrix[row][col]);
                row--;
                col++;
            }
            if (diagonal.length > 0) {
                diagonals.push(diagonal);
            }
        }

        // get diagonals starting from top-right corner
        for (let i = 0; i < numRows; i++) {
            const diagonal = [];
            let row = i;
            let col = numCols - 1;
            while (row >= 0 && col >= 0) {
                diagonal.push(matrix[row][col]);
                row--;
                col--;
            }
            if (diagonal.length > 0) {
                diagonals.push(diagonal);
            }
        }

        // get diagonals starting from top-right corner, excluding the main diagonal
        for (let i = numCols - 2; i >= 0; i--) {
            const diagonal = [];
            let row = numRows - 1;
            let col = i;
            while (row >= 0 && col >= 0) {
                diagonal.push(matrix[row][col]);
                row--;
                col--;
            }
            if (diagonal.length > 0) {
                diagonals.push(diagonal);
            }
        }

        // get diagonals starting from bottom-right corner
        for (let i = 0; i < numCols; i++) {
            const diagonal = [];
            let row = numRows - 1;
            let col = i;
            while (row >= 0 && col < numCols) {
                diagonal.push(matrix[row][col]);
                row--;
                col++;
            }
            if (diagonal.length > 0) {
                diagonals.push(diagonal);
            }
        }

        // get diagonals starting from bottom-right corner, excluding the main diagonal
        for (let i = numRows - 2; i >= 0; i--) {
            const diagonal = [];
            let row = i;
            let col = 0;
            while (row >= 0 && col < numCols) {
                diagonal.push(matrix[row][col]);
                row--;
                col++;
            }
            if (diagonal.length > 0) {
                diagonals.push(diagonal);
            }
        }

        return diagonals;
    };

    // Checks whether there are conflicts with the user inputs
    const hasConflicts = () => {
        let didConflict = false;

        let integerPuzzle = [];

        puzzle.map((rows, index) => {
            let row = [];
            rows.map((element, index) => {
                row.push(element.value);
            });

            integerPuzzle.push(row);
        });

        integerPuzzle.map((rows, index) => {
            if (getAllIndexes(rows, 1).length > 1) {
                didConflict = true;
            }
        });

        for (let i = 0; i < integerPuzzle.length; i++) {
            let column = getColumn(integerPuzzle, i);
            if (getAllIndexes(column, 1).length > 1) {
                didConflict = true;
            }
        }

        let diagonalsArray = [];
        // console.log(getDiagonalsOfMatrix(integerPuzzle));

        for (let diagonal of getDiagonalsOfMatrix(integerPuzzle)) {
            if (getAllIndexes(diagonal, 1).length > 1) {
                didConflict = true;
            }
        }
        return didConflict;
    };

    // Submits the puzzle by checking its validity and updating the backend
    const submit = () => {
        if (queenCounter.current < 8) {
            setErrorMessage("Board must have 8 queens to be solved.");
            return;
        }
        if (hasConflicts()) {
            setErrorMessage(
                "No queen must be able to kill another for the board to be solved."
            );
            return;
        }
        setModalState(true);
        setHasSolved(true);
    };

    const reformatPuzzle = () => {
        let integerPuzzle = [];

        puzzle.map((rows, index) => {
            let row = [];
            rows.map((element, index) => {
                row.push(element.value);
            });

            integerPuzzle.push(row);
        });

        let finalPuzzle = {
            progress: integerPuzzle,
            puzzleid: "queens",
        };

        return finalPuzzle;
    };

    // Resets the puzzle to its default state
    const reset = async () => {
        console.log("Saving...");

        if (!checkAccessToken()) {
            navigate("/LoggedOut");
            return;
        }

        const puzzleToSave = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];

        const puzzleObj = {
            progress: puzzleToSave,
            puzzleid: "queens",
        };

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
                    puzzle: puzzleObj,
                },
                url: fullurl + "/savepuzzleprogress",
            });

            let data = res.data;

            console.log(data);
            if (data.status == 0) {
                setErrorMessage("Unable to save...");
            } else {
                setErrorMessage("Puzzle Reset");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (err) {
            console.error(err);
        }
        setHasSolved(false);
    };

    // Saves the current user's progress in the puzzle by sending the current puzzle data to backend
    const savePuzzleProgress = async () => {
        console.log("Saving...");

        if (!checkAccessToken()) {
            navigate("/LoggedOut");
            return;
        }

        let puzzleToSave = reformatPuzzle();
        console.log(puzzle);
        console.log(puzzleToSave);
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
                    puzzle: puzzleToSave,
                },
                url: fullurl + "/savepuzzleprogress",
            });

            let data = res.data;
            if (data.status == 0) {
                setErrorMessage("Unable to save...");
            } else {
                setErrorMessage("Progess Saved!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Caller function of savePuzzleProgress - checks for conflicts before sending progress to backend
     */
    const save = async () => {
        // console.log(didConflict.current)
        try {
            await savePuzzleProgress();
        } catch (err) {
            console.log("Saving reset");
            await savePuzzleProgress();
        }
    };

    // Handles clicks user makes throughout game play
    const handleClick = (index) => {
        setErrorMessage("");
        activeIndex.current = index;

        let index1 = index.split("")[0];
        let index2 = index.split("")[1];

        let cell = puzzle[index1][index2];

        if (cell.value == 1) {
            cell.value = 0;
            queenCounter.current = queenCounter.current - 1;
            setForceRender(!forceRender);
        } else if (queenCounter.current < 8) {
            cell.value = 1;
            queenCounter.current = queenCounter.current + 1;
            setForceRender(!forceRender);
        }

        setForceRender(!forceRender);
    };

    if (canRender) {
        return (
            <section>
                <SuccessModal
                    message="Congratulations! You solved the Eight Queens puzzle."
                    modalState={modalState}
                    setModalState={setModalState}
                />

                <div className="eight-queen-holder">
                    <p className="queen-counter">
                        Number of Queens left: {8 - queenCounter.current}
                    </p>

                    <p className="error-message">
                        {errorMessage != "" ? errorMessage : ""}
                    </p>

                    <div className="eight-queen-board">
                        {puzzle.map((row, index) => {
                            return (
                                <div key={index} className="eight-queen-row">
                                    {row.map((element, rIndex) => {
                                        return (
                                            <div
                                                onClick={() => {
                                                    handleClick(
                                                        `${index}${rIndex}`
                                                    );
                                                }}
                                                key={index + rIndex}
                                                className={
                                                    (index + rIndex) % 2 == 0
                                                        ? "eight-queen-element dark-square"
                                                        : "eight-queen-element light-square"
                                                }
                                            >
                                                <div
                                                    className={
                                                        `${index}${rIndex}` ==
                                                        activeIndex.current
                                                            ? "active-eight"
                                                            : ""
                                                    }
                                                >
                                                    <div className="queen-holder">
                                                        {element.value == 1 ? (
                                                            <Queen className="queen" />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    <div className="btn-holder">
                        {loginState == 1 ? (
                            <>
                                <button
                                    className="save-btn"
                                    type="button"
                                    onClick={save}
                                >
                                    Save
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAOxJREFUSEvtld0RwiAQhHc70AosQS3BDixFK9CSLMESYgdagXawDpmQIQhJDid5UZ4S4Pi4vR+IiQcnPh/zAiTtAZwAbAyeVQB2JF8pm44Hku4AVobD/dYsJAbIWZCs5yXV/34k5pcArgDWAJKQrwAOKGnRBzEBYukCjzoQktvW69DIS5KTKAdo5HSQZyhx/d0HsAY7vuAPAEYUnqubI8lLmNY+hoMSjSy8ymeNOQYpgzFZZ/GgU9lxVuXS+g9olSqRqLRdh+G5kWzfk7hVuAfn3LRfa6dw+x8ADr4uPuqg5MQhm3nf5KHblKy/AexG1Bl4payLAAAAAElFTkSuQmCC" />
                                </button>
                            </>
                        ) : (
                            ""
                        )}
                        <button className="submit-btn" onClick={submit}>
                            Submit
                            <SubmitIcon className="submit-icon"></SubmitIcon>
                        </button>

                        {hasSolved ? (
                            <button
                                aria-label="Click this to reset the board to its original state"
                                className="reset-btn"
                                type="button"
                                onClick={reset}
                            >
                                Solve again
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAahJREFUSEu1VcFNA0EQs/8gKIFUQDqAdEAHwB8kqACogEjwJ1SAqICkAigBKoAI/kaO5k6bZZNbCJnP6XS74xl7xkesObjm/KgGkLQN4Jrk8W+KqgKQ1AdwB6BPsupOU0TnYUlHrhyAO2jiFcAYwD1JPxdGLcAQwNaCLAY4J/lS+t4J4EtB0QjArimK9wMAZwH8AWBQAqkCCBBTNCRpymYRwru7QwBFkGqAZTxLcncGGZMcpGf/C8DdWXjrZKpa4asBJN0AaOgZkTxNK5V0CeAiJqulsQogkp9kNN2mIJL2ATy5E5K96j0IMT8BbGQAXyQ3M8Hf/Z4u41wHkpQfWAIwlyjO+f6UZLuUOYDF2cuFqqTIdvIMYELSdM0iB2jG7YqkRWsjEdlUzfEf1XvpbCm2j7LIiVBemh5JPzsjFs7V73SOqaSGJo9ilTUnizZHzw+KolVzaRAvjSmzkRU7icofAJjzqZ+5HxX3IMysAXFy+81jczm+2xrMtSemmLzYQTLX7sSJPVXLYmJX/bNdh/Cu1AIa1NS9BY3WabUfTucIdRyo8qJVQL4Bgfm2Ge+OFh8AAAAASUVORK5CYII=" />
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default EightQueensModal;
