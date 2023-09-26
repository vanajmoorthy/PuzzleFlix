import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Axios from "axios";

// Styling
import "../../../modals/SudokuModal/SudokuModal.css";
import "../../../../base.css";

import { hosturl, fullurl } from "./../../../../Config";

function CreateModal(props) {
    const { handleSudokuSubmit } = props;

    // Default puzzle state
    const puzzleData = [
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

    // Render the puzzle display based on puzzle data
    const generatePuzzle = (puzzleArray) => {
        let puzzle = [];
        puzzleArray.map((rows, i) => {
            let row = [];
            rows.map((cell, j) => {
                if (cell != 0) {
                    row.push({
                        value: cell,
                        filled: true,
                        filledBy: "puzzle",
                        index: `${i}${j}`,
                    });
                } else {
                    row.push({ value: 0, filled: false, index: `${i}${j}` });
                }
            });
            puzzle.push(row);
        });

        return puzzle;
    };

    const [puzzle, setPuzzle] = useState(generatePuzzle(puzzleData));

    const addValue = useRef(0);
    const squareIndex = useRef();
    const [activeIndex, setActiveIndex] = useState();
    const [invalidIndex, setInvalidIndex] = useState();
    const [globalConflict, setGlobalConflict] = useState(0);

    // Handles clicking on a sudoku tile
    const handleClick = (index) => {
        squareIndex.current = index;
        setActiveIndex(index);

        // setAddValue(null);
    };

    const clear = () => {
        setPuzzle(generatePuzzle(puzzleData));
    };

    // Handles selecting a number to place in a sudoku tile
    const setEditingValue = (value) => {
        if (value != 0) {
            addValue.current = value;
        } else {
            addValue.current = 0;
        }

        let copy = [...puzzle];

        copy.map((rows, i) => {
            rows.map((cell, j) => {
                if (
                    cell.index === squareIndex.current &&
                    cell.filled == false
                ) {
                    if (checkConflict(value, i, j)) {
                        setInvalidIndex(`${i}${j}`);
                        cell.value = addValue.current;
                        cell.filledBy = "puzzle";
                        setGlobalConflict(1);
                    } else {
                        setInvalidIndex();
                        cell.value = addValue.current;
                        cell.filledBy = "puzzle";
                        setGlobalConflict(0);
                    }
                }
            });
        });
        setPuzzle(copy);
    };

    // Checks for conflicts in the user inputs
    const checkConflict = (value, i, j) => {
        if (value == 0) {
            return false;
        }

        let didConflict = false;

        let row = puzzle[i];

        if (row.some((cell, index) => cell.value == value && index != j)) {
            didConflict = true;
        }

        let column = [];

        for (let i = 0; i < puzzle.length; i++) {
            column.push(puzzle[i][j]);
        }

        if (column.some((cell, index) => cell.value == value && index != i)) {
            didConflict = true;
        }

        let boxArray = [];

        let zoneR = Math.floor(i / 3) * 3;
        let zoneC = Math.floor(j / 3) * 3;

        for (let p = zoneR; p < zoneR + 3; p++) {
            for (let q = zoneC; q < zoneC + 3; q++) {
                boxArray.push(puzzle[p][q]);
            }
        }

        if (boxArray.some((cell, index) => cell.value == value && index != i)) {
            didConflict = true;
        }

        return didConflict;
    };

    // Handles user keyboard inputs
    const handleKeyPresses = (event) => {
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

    const generateRandomPuzzle = async () => {
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
                url: fullurl + "/generateRandomSudoku",
            });

            setPuzzle(generatePuzzle(res.data));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="sudoku">
            <div onKeyDown={(e) => handleKeyPresses(e)} tabIndex="0">
                {puzzle.map((items, index) => {
                    return (
                        <div key={index} className="row">
                            {items.map((cell, sIndex) => {
                                return (
                                    <div
                                        key={sIndex}
                                        className={
                                            invalidIndex == `${index}${sIndex}`
                                                ? "square invalid-square"
                                                : "square"
                                        }
                                    >
                                        <button
                                            onClick={() =>
                                                handleClick(`${index}${sIndex}`)
                                            }
                                            key={`${index}${sIndex}`}
                                            className={
                                                `${index}${sIndex}` ==
                                                activeIndex
                                                    ? "active"
                                                    : "cell"
                                            }
                                            name="cell"
                                            id="cell"
                                        >
                                            {cell.value == 0 ||
                                            cell.filledBy == "solution"
                                                ? ""
                                                : cell.value}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="input-buttons">
                <button
                    className="input-button"
                    onClick={() => setEditingValue(0)}
                ></button>

                <button
                    className="input-button"
                    onClick={() => setEditingValue(1)}
                >
                    {" "}
                    1{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(2)}
                >
                    {" "}
                    2{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(3)}
                >
                    {" "}
                    3{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(4)}
                >
                    {" "}
                    4{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(5)}
                >
                    {" "}
                    5{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(6)}
                >
                    {" "}
                    6{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(7)}
                >
                    {" "}
                    7{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(8)}
                >
                    {" "}
                    8{" "}
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(9)}
                >
                    {" "}
                    9{" "}
                </button>
            </div>
            <div className="input-buttons-mobile">
                <button
                    className="input-button"
                    onClick={() => setEditingValue(1)}
                >
                    1
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(2)}
                >
                    2
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(3)}
                >
                    3
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(4)}
                >
                    4
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(5)}
                >
                    5
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(6)}
                >
                    6
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(7)}
                >
                    7
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(8)}
                >
                    8
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(9)}
                >
                    9
                </button>
                <button
                    className="input-button"
                    onClick={() => setEditingValue(0)}
                ></button>
            </div>

            {globalConflict ? (
                <p className="clue-error">
                    Please ensure there are no conflicting cells
                </p>
            ) : (
                ""
            )}

            <div className="create-btns-holder">
                <div className="generate-clear-btns-holder">
                    <button
                        className="save-btn"
                        onClick={() => generateRandomPuzzle()}
                    >
                        Generate Puzzle
                    </button>
                    <button className="save-btn" onClick={() => clear()}>
                        Clear Puzzle
                    </button>
                </div>
                <button
                    className="save-btn"
                    onClick={() =>
                        !globalConflict && handleSudokuSubmit(puzzle)
                    }
                >
                    Save Puzzle
                </button>
            </div>
        </div>
    );
}

export default CreateModal;
