// Libraries
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Axios from "axios";

// Config
import { hosturl, fullurl } from "./../../../../Config";

// Styling
import "../../../modals/EightsModal/EightsModal.css";
import "../../../../base.css";

// Assets
const puzzleImageDefault = "/uploads/base.jpg";

// Eights image formatting presets
const imageSize = 360;
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

function CreateModalEights(props) {
    const {
        handleSolutionChange,
        handleEightsSubmit,
        setPuzzleImage,
        puzzleImage,
    } = props;
    const [mode, setMode] = useState(0);
    const [canMove, setCanMove] = useState(true);

    // Default puzzle state
    const puzzleData = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];

    // Renders the puzzle display based on puzzle data
    const generatePuzzle = (puzzleArray) => {
        let puzzle = [];
        puzzleArray.map((rows, i) => {
            let row = [];
            rows.map((cell, j) => {
                row.push({
                    value: cell,
                    filled: true,
                    filledBy: "puzzle",
                    index: `${i}${j}`,
                });
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

    const [singleMode, setSingleMode] = useState(true);
    const [showNumber, setShow] = useState(false);

    // Handles clicking on an eights tile
    const handleClick = (index) => {
        if (!canMove) {
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
            setCanMove(false);
            let newValue = puzzle[index[0]][index[1]].value;
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
                    piece.style.transform = `translate(${((currentY - prevY) * imageSize) / 3
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

                            //handlePuzzleChange(copy);
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

                    //handlePuzzleChange(copy);
                    setPuzzle(copy);
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
        handleSolutionChange(puzzle);
    }; // End handle click

    // Handles user setting an image for the puzzle
    // Source : https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
    const setImageUrl = (url) => {
        var image = new Image();
        image.onload = () => {
            if (image.width > 0) {
                setPuzzleImage(url);
            }
        };
        image.onerror = () => {
            setPuzzleImage(puzzleImageDefault);
        };
        image.src = fullurl + url;
    };

    // Handles user changing the puzzle image
    const fileChangeSelf = async () => {
        var file = document.getElementById("input_img");
        var form = new FormData();
        form.append("image", file.files[0]);

        try {
            console.log("sending");
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: form,
                url: fullurl + "/upload",
            }).then((response) => {
                console.log(response);

                setImageUrl(response.data.url);
            });

        } catch (err) {
            console.error(err);
        }
    };

    // handles user clicking on image upload button
    const uploadButton = () => {
        document.getElementById("input_img").click();
        console.log(document.getElementById("input_img"));
    };

    return (
        <div className="eights">
            <div className="eights-border">
                {puzzle.map((items, index) => {
                    return (
                        <div className="eights-row">
                            {items.map((cell, sIndex) => {
                                return (
                                    <div
                                        className={
                                            invalidIndex == `${index}${sIndex}`
                                                ? "eights-square eights-invalid-square"
                                                : "eights-square"
                                        }
                                    >
                                        <button
                                            style={{
                                                backgroundSize: "360px 360px",
                                                width: `${imageSize / 3}px`,
                                                height: `${imageSize / 3}px`,
                                                backgroundImage:
                                                    cell.value == 9
                                                        ? "none"
                                                        : `url(${fullurl +
                                                        puzzleImage
                                                        })`,
                                                backgroundPosition:
                                                    cell.value == 9
                                                        ? ""
                                                        : offsets[
                                                        cell.value - 1
                                                        ],
                                            }}
                                            onClick={() =>
                                                handleClick(`${index}${sIndex}`)
                                            }
                                            key={`${index}${sIndex}`}
                                            className={
                                                `${index}${sIndex}` ==
                                                    activeIndex
                                                    ? "eights-active"
                                                    : "eights-cell"
                                            }
                                            name="cell"
                                            id={cell.value}
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
            <label>
                <input
                    type="checkbox"
                    onClick={(e) => setSingleMode(e.target.checked)}
                    defaultChecked
                />
                Single Click Mode
            </label>
            <label>
                <input
                    type="checkbox"
                    onClick={(e) => setShow(e.target.checked)}
                />
                Show Numbers
            </label>

            <label class="eights-upload" for="input_img">
                Upload a custom image:
            </label>
            <button class="upload-button" onClick={(e) => uploadButton(e)}>
                Upload from file
            </button>
            <input
                type="file"
                id="input_img"
                style={{ display: "none" }}
                onChange={(e) => fileChangeSelf(e)}
                accept="image/*"
            ></input>

            <button
                className="save-btn"
                onClick={() => handleEightsSubmit(puzzle)}
            >
                Submit Puzzle
            </button>
        </div>
    );
}

export default CreateModalEights;
