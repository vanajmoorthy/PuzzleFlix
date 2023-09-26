// Styling
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

// Styling
import "../../../modals/SudokuModal/SudokuModal.css";
import "../../../../base.css";

function SolutionModal(props) {
    const { handleSolutionChange, handleSolutionSubmit, puzzleData } = props;

    const [puzzle, setPuzzle] = useState(puzzleData);

    const addValue = useRef(0);
    const squareIndex = useRef();
    const [activeIndex, setActiveIndex] = useState();
    const [invalidIndex, setInvalidIndex] = useState();
    const [globalConflict, setGlobalConflict] = useState(0);

    // Handles user clicking on a cell during solution filling
    const handleClick = (index) => {
        squareIndex.current = index;
        setActiveIndex(index);
    };

    // handles user setting a value for a particular selected puzzle cell
    const setEditingValue = (value) => {
        // Check that user did not input zero
        if (value != 0) {
            addValue.current = value;
        } else {
            addValue.current = "";
        }

        let copy = [...puzzle];

        // Generate new puzzle data to reflect the user change
        copy.map((rows, i) => {
            rows.map((cell, j) => {
                if (
                    cell.index === squareIndex.current &&
                    cell.filled == false
                ) {
                    if (checkConflict(value, i, j)) {
                        setInvalidIndex(`${i}${j}`);
                        cell.value = addValue.current;
                        cell.filledBy = "solution";
                        setGlobalConflict(1);
                    } else {
                        setInvalidIndex();
                        cell.value = addValue.current;
                        cell.filledBy = "solution";
                        setGlobalConflict(0);
                    }
                }
            });
        });

        // update the puzzle with new data
        handleSolutionChange(copy);
        setPuzzle(copy);
    };

    // Checks for conflicts in the solution input
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

    // Handles user using keyboard inputs
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

    return (
        <div className="sudoku">
            <div onKeyDown={(e) => handleKeyPresses(e)} tabIndex="0">
                {puzzle.map((items, index) => {
                    return (
                        <div key={index} className="row">
                            {items.map((cell, sIndex) => {
                                return (
                                    <div
                                        className={
                                            invalidIndex == `${index}${sIndex}`
                                                ? "square invalid-square"
                                                : "square"
                                        }
                                        key={sIndex}
                                    >
                                        <button
                                            onChange={() => {
                                                handleSolutionChange(puzzle);
                                            }}
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
                                            {cell.value == 0 ? "" : cell.value}
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

            {globalConflict ? (
                <p className="clue-error">
                    Please ensure there are no conflicting cells
                </p>
            ) : (
                ""
            )}

            <button
                className="save-btn"
                onClick={() => !globalConflict && handleSolutionSubmit()}
            >
                Save Solution
            </button>
        </div>
    );
}

export default SolutionModal;
