import React from "react";
import "./EightsModal.css";
import "../../../base.css";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { ReactComponent as UndoIcon } from "../../../assets/bx-undo.svg";
import { ReactComponent as RedoIcon } from "../../../assets/bx-redo.svg";

const imageSize = 300;

const offsets = [
    "0 0",
    (2 * imageSize) / 3 + "px 0",
    imageSize / 3 + "px 0",
    "0 " + (2 * imageSize) / 3 + "px",
    (2 * imageSize) / 3 + "px " + (2 * imageSize) / 3 + "px",
    imageSize / 3 + "px " + (2 * imageSize) / 3 + "px",
    "0 " + imageSize / 3 + "px",
    (2 * imageSize) / 3 + "px " + imageSize / 3 + "px",
    imageSize / 3 + "px " + imageSize / 3 + "px",
    "",
];

function EightsModal(props) {
    const {
        puzzleData,
        name,
        handlePuzzleChange,
        clearResultMessage,
        originalPuzzle,
        puzzleImage,
    } = props;

    console.log("Puzzle", puzzleImage);

    const generatePuzzle = (puzzleArray) => {
        let puzzle = [];
        puzzleArray.map((rows, i) => {
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

    const [puzzle, setPuzzle] = useState(generatePuzzle(puzzleData));

    const addValue = useRef(0);
    const squareIndex = useRef();
    const [activeIndex, setActiveIndex] = useState();
    const [invalidIndex, setInvalidIndex] = useState();
    const [invalidMoves, setInvalidMoves] = useState([]);

    const [moveHistory, setMoveHistory] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);

    const [mode, setMode] = useState(0);

    const [showNumber, setShow] = useState(true);

    const handleClick = (index) => {
        // First
        if (mode == 0) {
            setMode(1);
            squareIndex.current = index;
            setActiveIndex(index);
        }
        // Swap with
        else {
            let newValue = puzzle[index[0]][index[1]].value;
            let currentX = index[0];
            let currentY = index[1];
            let prevX = squareIndex.current[0];
            let prevY = squareIndex.current[1];

            // Check valid location
            if (newValue == 9) {
                let copy = [...puzzle];
                let temp = copy[prevX][prevY].value;

                if (
                    (prevX == currentX && prevY - 1 == currentY) ||
                    (prevX == currentX && prevY == currentY - 1) ||
                    (prevX == currentX - 1 && prevY == currentY) ||
                    (prevX - 1 == currentX && prevY == currentY)
                ) {
                    const piece = document.getElementById(temp);
                    piece.style.transition = "0.4s ease all";
                    piece.style.transform = `translate(${
                        ((currentY - prevY) * imageSize) / 3
                    }px, ${((currentX - prevX) * imageSize) / 3}px)`;

                    const offset = piece.style.backgroundPosition;
                    const img = piece.style.backgroundImage;

                    const newPiece = document.getElementById(9);
                    newPiece.style.backgroundPosition = offset;

                    piece.addEventListener(
                        "transitionend",
                        () => {
                            copy[prevX][prevY].value = 9;

                            copy[prevX][prevY].value = newValue;
                            copy[currentX][currentY].value = temp;

                            piece.style.backgroundImage = "none";
                            piece.innerHTML = "";
                            newPiece.style.backgroundImage = img;
                            newPiece.innerHTML = temp;

                            handlePuzzleChange(copy);
                            setPuzzle(copy);

                            piece.style.removeProperty("transform");
                            piece.style.removeProperty("transition");

                            try {
                                piece.removeEventListener(
                                    "transitionend",
                                    arguments.callee
                                );
                            } catch (err) {
                                // Silence warning in console log
                            }
                        },
                        { once: true }
                    );
                }

                setActiveIndex(null);
                setMode(0);
            } else {
                squareIndex.current = index;
                setActiveIndex(index);
            }
        }

        // setAddValue(null);
    };

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

    return (
        <div className="eights">
            <div className="eights-border" tabIndex="0">
                {puzzle.map((items, index) => {
                    return (
                        <div key={index} className="eights-row">
                            {items.map((cell, sIndex) => {
                                return (
                                    <div
                                        key={index + "" + sIndex}
                                        className={
                                            cell.conflicts == true &&
                                            cell.filled == false
                                                ? "eights-square invalid-square"
                                                : "eights-square"
                                        }
                                    >
                                        <button
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
                                                    ? "eights-active"
                                                    : "eights-cell"
                                            }
                                            name="cell"
                                            id={cell.value}
                                            style={{
                                                backgroundSize: "300px 300px",
                                                width: `${imageSize / 3}px`,
                                                height: `${imageSize / 3}px`,
                                                backgroundImage:
                                                    cell.value == 9
                                                        ? "none"
                                                        : `url(${puzzleImage})`,
                                                backgroundPosition:
                                                    cell.value == 9
                                                        ? ""
                                                        : offsets[
                                                              cell.value - 1
                                                          ],
                                            }}
                                        >
                                            {cell.value == 9 || !showNumber
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
        </div>
    );
}

export default EightsModal;
