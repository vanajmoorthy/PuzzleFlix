// Libraries
import React from "react";
import { useState } from "react";
import { useRef } from "react";

// Assets
import { ReactComponent as UndoIcon } from "../../../assets/bx-undo.svg";
import { ReactComponent as RedoIcon } from "../../../assets/bx-redo.svg";

// Styling
import "./SudokuModal.css";
import "../../../base.css";

function SudokuModal(props) {
    const {
        puzzleData,
        puzzleProgress,
        puzzleObj,
        name,
        handlePuzzleChange,
        clearResultMessage,
        originalPuzzle,
    } = props;

    // Renders the sudoku puzzle based on imported puzzle data
    const generatePuzzle = (puzzleArray, puzzleProgress) => {
        let progress = eval(eval(puzzleProgress));

        let puzzle = [];
        progress.map((rows, i) => {
            let row = [];
            rows.map((cell, j) => {
                if (cell != 0) {
                    row.push({
                        value: cell,
                        filled: true,
                        index: `${i}${j}`,
                        conflicts: false,
                    });
                } else {
                    row.push({
                        value: 0,
                        filled: false,
                        index: `${i}${j}`,
                        conflicts: false,
                    });
                }
            });
            puzzle.push(row);
        });

        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle.length; j++) {
                let currToCheck = puzzle[i][j];
                for (let p = 0; p < puzzle[i].length; p++) {
                    if (currToCheck.value != 0) {
                        if (
                            currToCheck.value === puzzle[i][p].value &&
                            currToCheck.index !== puzzle[i][p].index
                        ) {
                            currToCheck.conflicts = true;
                        }
                        if (
                            currToCheck.value === puzzle[p][j].value &&
                            currToCheck.index !== puzzle[p][j].index
                        ) {
                            currToCheck.conflicts = true;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle[i].length; j++) {
                if (
                    puzzle[i][j].filled == true &&
                    puzzle[i][j].value !==
                        originalPuzzle.current.puzzledata[i][j]
                ) {
                    puzzle[i][j].filled = false;
                }
            }
        }

        return puzzle;
    };

    const [puzzle, setPuzzle] = useState(
        generatePuzzle(puzzleData, puzzleProgress)
    );

    const addValue = useRef(0);
    const squareIndex = useRef();
    const [activeIndex, setActiveIndex] = useState();
    const [invalidIndex, setInvalidIndex] = useState();
    const [invalidMoves, setInvalidMoves] = useState([]);

    const [moveHistory, setMoveHistory] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);

    const handleClick = (index) => {
        squareIndex.current = index;
        setActiveIndex(index);

        // setAddValue(null);
    };

    // Handles user inputting a value in a cell
    const setEditingValue = async (value) => {
        if (value != 0) {
            addValue.current = value;
        } else {
            addValue.current = "";
        }

        console.log(addValue.current);

        let copy = [...puzzle];

        copy.map((rows, i) => {
            rows.map((cell, j) => {
                if (
                    cell.index === squareIndex.current &&
                    cell.filled == false
                ) {
                    let idx = cell.index;

                    if (moveHistory.length < 1) {
                        setMoveHistory((oldArray) => [
                            ...oldArray,
                            { [idx]: value },
                        ]);
                        setMoveIndex(moveIndex + 1);
                    } else {
                        let wasFound = false;
                        for (let move of moveHistory) {
                            if (
                                Object.keys(move) == idx &&
                                Object.values(move) == value
                            ) {
                                wasFound = true;
                                break;
                            } else {
                                wasFound = false;
                            }
                        }

                        if (!wasFound) {
                            setMoveHistory((oldArray) => [
                                ...oldArray,
                                { [idx]: value },
                            ]);
                            setMoveIndex(moveIndex + 1);
                        }
                    }

                    if (checkConflict(value, i, j)) {
                        cell.conflicts = true;
                        cell.value = addValue.current;
                    } else {
                        cell.conflicts = false;
                        cell.value = addValue.current;
                    }

                    if (cell.conflicts) {
                        cell.value = addValue.current;
                        setInvalidIndex(`${i}${j}`);
                    } else {
                        cell.value = addValue.current;
                        setInvalidIndex(``);
                    }
                }
            });
        });

        clearResultMessage("");
        await handlePuzzleChange(copy);
        await setPuzzle(copy);
    };

    // Handles user using keyboard inputs
    const handleKeyPresses = (event) => {
        console.log(event.keyCode);

        let keyCode = event.which || event.keyCode;

        if (keyCode == "38") {
            let currIndex = squareIndex.current;

            if (currIndex > 8) {
                let newIndex = parseInt(squareIndex.current) - 10;
                squareIndex.current = newIndex;
                setActiveIndex(newIndex);
            }
        } else if (keyCode == "40") {
            let currIndex = squareIndex.current;

            if (currIndex < 80) {
                let newIndex = parseInt(squareIndex.current) + 10;
                squareIndex.current = newIndex;
                setActiveIndex(newIndex);
            }
        } else if (keyCode == "37") {
            let currIndex = squareIndex.current;
            let currStringIndex = currIndex.toString();
            console.log(currStringIndex);
            if (currStringIndex.length < 2) {
                if (currStringIndex > 0) {
                    let newIndex = parseInt(squareIndex.current) - 1;
                    squareIndex.current = newIndex;
                    setActiveIndex(newIndex);
                }
            } else if (currStringIndex[1] > 0) {
                let newIndex = parseInt(squareIndex.current) - 1;
                squareIndex.current = newIndex;
                setActiveIndex(newIndex);
            }
        } else if (keyCode == "39") {
            let currIndex = squareIndex.current;
            let currStringIndex = currIndex.toString();

            if (currStringIndex.length < 2) {
                if (currStringIndex < 8) {
                    let newIndex = parseInt(squareIndex.current) + 1;
                    squareIndex.current = newIndex;
                    setActiveIndex(newIndex);
                }
            } else if (currStringIndex[1] < 8) {
                let newIndex = parseInt(squareIndex.current) + 1;
                squareIndex.current = newIndex;
                setActiveIndex(newIndex);
            }
        } else {
            if (keyCode == "49") {
                document.querySelectorAll(".active")[0].click();
                setEditingValue(1);
            } else if (keyCode == "50") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(2);
            } else if (keyCode == "51") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(3);
            } else if (keyCode == "52") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(4);
            } else if (keyCode == "53") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(5);
            } else if (keyCode == "54") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(6);
            } else if (keyCode == "55") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(7);
            } else if (keyCode == "56") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(8);
            } else if (keyCode == "57") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(9);
            } else if (keyCode == "48") {
                document.querySelectorAll(".active")[0].click();

                setEditingValue(0);
            }
        }
    };

    // Handles user clicking on undo button
    const undo = () => {
        puzzle.map((rows) => {
            rows.map((cell) => {
                if (cell.index == Object.keys(moveHistory[moveIndex - 1])) {
                    if (
                        moveHistory.length > 2 &&
                        moveIndex > 1 &&
                        cell.index == Object.keys(moveHistory[moveIndex - 2])
                    ) {
                        cell.value = Object.values(moveHistory[moveIndex - 2]);
                        setMoveIndex(moveIndex - 1);
                    } else {
                        cell.value = "";
                        setMoveIndex(moveIndex - 1);
                    }
                }
            });
        });
    };

    // Handles user clicking on redo button
    const redo = () => {
        puzzle.map((rows) => {
            rows.map((cell) => {
                if (cell.index == Object.keys(moveHistory[moveIndex])) {
                    cell.value = Object.values(moveHistory[moveIndex]);
                    setMoveIndex(moveIndex + 1);
                }
            });
        });
    };

    // Checks for conflicts in the current user puzzle inputs
    const checkConflict = (value, i, j) => {
        // If it's a 0, it can't conflict
        if (value == 0) {
            return false;
        }

        // Set didConflict boolean to false
        let didConflict = false;

        // Get ith row of puzzle
        let row = puzzle[i];

        // If any one cell in the row has the same value as the cell, and if they don't have the same index
        // The cells conflict
        if (row.some((cell, index) => cell.value == value && index != j)) {
            didConflict = true;
        }

        // Get all columns
        let column = [];
        for (let i = 0; i < puzzle.length; i++) {
            column.push(puzzle[i][j]);
        }

        // Same thing for column
        if (column.some((cell, index) => cell.value == value && index != i)) {
            didConflict = true;
        }

        // Iterate through the 2D array and take 3x3 windows and save it as an array
        let boxArray = [];

        let zoneR = Math.floor(i / 3) * 3;
        let zoneC = Math.floor(j / 3) * 3;

        for (let p = zoneR; p < zoneR + 3; p++) {
            for (let q = zoneC; q < zoneC + 3; q++) {
                boxArray.push(puzzle[p][q]);
            }
        }

        // Same thing for the box
        if (
            boxArray.some(
                (cell, index) => cell.value == value && cell.index[1] != j
            )
        ) {
            didConflict = true;
        }

        return didConflict;
    };

    return (
        <div className="sudoku">
            <div
                className="grid-wrapper"
                onKeyDown={(e) => handleKeyPresses(e)}
                tabIndex="0"
            >
                {puzzle.map((items, index) => {
                    return (
                        <div key={index} className="row">
                            {items.map((cell, sIndex) => {
                                return (
                                    <div
                                        key={index + "" + sIndex}
                                        className={
                                            cell.conflicts == true &&
                                            cell.filled == false
                                                ? "square invalid-square"
                                                : "square"
                                        }
                                    >
                                        <button
                                            aria-label="Enter digit in this Sudoku cell"
                                            onClick={() =>
                                                handleClick(`${index}${sIndex}`)
                                            }
                                            key={`${index}${sIndex}`}
                                            tabIndex={
                                                `${index}${sIndex}` ==
                                                activeIndex
                                                    ? 1
                                                    : 0
                                            }
                                            className={
                                                `${index}${sIndex}` ==
                                                activeIndex
                                                    ? "active"
                                                    : "cell"
                                            }
                                            name="cell"
                                            id="cell"
                                        >
                                            {cell.value == 0 ? "" : cell.value}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="history-buttons">
                <div className="undo" onClick={undo}>
                    <UndoIcon className="history-button"></UndoIcon>
                    {/* <p>Undo</p> */}
                </div>
                <div className="date">
                    <h2 className="date-label">Date Published</h2>
                    <h2 className="f-date">
                        {`${
                            puzzleObj.datepublished.split(" ")[0].split("-")[2]
                        }/${
                            puzzleObj.datepublished.split(" ")[0].split("-")[1]
                        }/${
                            puzzleObj.datepublished.split(" ")[0].split("-")[0]
                        }`}
                    </h2>
                </div>
                <div className="redo" onClick={redo}>
                    <RedoIcon className="history-button"></RedoIcon>
                    {/* <p>Redo</p> */}
                </div>
            </div>

            <div className="input-buttons">
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(0)}
                ></button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(1)}
                >
                    1
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(2)}
                >
                    2
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(3)}
                >
                    3
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(4)}
                >
                    4
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(5)}
                >
                    5
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(6)}
                >
                    6
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(7)}
                >
                    7
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(8)}
                >
                    8
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(9)}
                >
                    9
                </button>
            </div>

            <div className="input-buttons-mobile">
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(1)}
                >
                    1
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(2)}
                >
                    2
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(3)}
                >
                    3
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(4)}
                >
                    4
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(5)}
                >
                    5
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(6)}
                >
                    6
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(7)}
                >
                    7
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(8)}
                >
                    8
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(9)}
                >
                    9
                </button>
                <button
                    aria-label="Click this button to input this digit on the Sudoku board"
                    className="input-button"
                    onClick={() => setEditingValue(0)}
                ></button>
            </div>
        </div>
    );
}

export default SudokuModal;
