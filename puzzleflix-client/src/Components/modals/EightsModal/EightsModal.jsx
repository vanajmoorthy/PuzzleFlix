// Libraries
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

// Styling
import "./EightsModal.css";
import "../../../base.css";

// Icons
import ViewIcon from "./../../../assets/view.png";

const imageSize = 360;

// Eights image formatting presets
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
        puzzleProgress,
    } = props;

    const [canMove, setCanMove] = useState(true);

    // Formats and prepares the puzzle data for display
    const generatePuzzle = (puzzleArrayString) => {
        let puzzle = [];

        let puzzleArray = eval(JSON.parse(puzzleArrayString));

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

    const [puzzle, setPuzzle] = useState(generatePuzzle(puzzleProgress));
    const squareIndex = useRef();
    const [activeIndex, setActiveIndex] = useState();
    const [mode, setMode] = useState(0);

    const [showNumber, setShow] = useState(false);
    const [singleMode, setSingleMode] = useState(true);

    const [isHovered, setIsHovered] = useState(false);
    const [isHoveredButton, setIsHoveredButton] = useState(false);

    useEffect(() => {});

    // Handles user click input for playing the puzzle
    const handleClick = (index) => {
        if (!canMove || isHovered || isHoveredButton) {
            setIsHoveredButton(false);
            setIsHovered(false);
            return;
        }

        // First
        if (mode == 0 && !singleMode) {
            setMode(1);
            squareIndex.current = index;
            setActiveIndex(index);
        }
        // Swap with
        else {
            let newValue = puzzle[index[0]][index[1]].value;

            setCanMove(false);

            let currentX, currentY;
            let prevX, prevY;

            if (singleMode) {
                // Search for blank spot
                for (let i = 0; i < puzzle.length; i++) {
                    for (let j = 0; j < puzzle[i].length; j++) {
                        if (puzzle[i][j].value === 9) {
                            currentX = i;
                            currentY = j;
                            prevX = index[0];
                            prevY = index[1];
                            newValue = 9;
                            break;
                        }
                    }
                }
            } else {
                currentX = index[0];
                currentY = index[1];
                prevX = squareIndex.current[0];
                prevY = squareIndex.current[1];
            }

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
                            if (showNumber) {
                                newPiece.innerHTML = temp;
                            }

                            handlePuzzleChange(copy);
                            setPuzzle(copy);

                            piece.style.removeProperty("transform");
                            piece.style.removeProperty("transition");

                            setCanMove(true);
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
                } else {
                    setCanMove(true);
                }

                setActiveIndex(null);
                setMode(0);
            } else {
                squareIndex.current = index;
                setActiveIndex(index);
                setCanMove(true);
            }
        }

        // setAddValue(null);
    };

    // Handles hovering over the show-puzzle button
    function handleHover(bool) {
        // 3 button
        // 1 mouse hover
        // 0 mouse not hover

        // If button override
        if (isHoveredButton) {
            if (bool == 3) {
                setIsHovered(false), setIsHoveredButton(false);
            }
        } else {
            if (bool == 3) {
                setIsHovered(true), setIsHoveredButton(true);
            } else setIsHovered(bool);
        }
    }

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
                                                backgroundSize: "360px 360px",
                                                width: `${imageSize / 3}px`,
                                                height: `${imageSize / 3}px`,
                                                backgroundImage:
                                                    cell.value == 9 &&
                                                    !isHovered
                                                        ? "none"
                                                        : `url(${puzzleImage})`,
                                                backgroundPosition: isHovered
                                                    ? offsets[
                                                          index * 3 + sIndex
                                                      ]
                                                    : cell.value == 9
                                                    ? ""
                                                    : offsets[cell.value - 1],
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
            <br />
            <div className="eights-btns">
                <button
                    className="show-puzzle"
                    onMouseEnter={(e) => handleHover(1)}
                    onMouseLeave={(e) => handleHover(0)}
                    onClick={(e) => handleHover(3)}
                >
                    <h3> View Full Image</h3>
                    {/* <img src={ViewIcon} /> */}
                </button>
                <div className="eights-toggles">
                    <input
                        type="checkbox"
                        className="big-checkbox"
                        onClick={(e) => setSingleMode(e.target.checked)}
                        defaultChecked
                    />
                    {" Single Click Mode"}
                </div>
                <div className="eights-toggles">
                    <input
                        type="checkbox"
                        className="big-checkbox"
                        onClick={(e) => setShow(e.target.checked)}
                    />
                    {" Show Numbers"}
                </div>
            </div>
        </div>
    );
}

export default EightsModal;
