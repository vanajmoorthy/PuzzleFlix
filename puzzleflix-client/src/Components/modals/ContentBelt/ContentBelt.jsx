// Libraries
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import Axios from "axios";
import { port, fullurl } from "./../../../Config";

// Styling
import "./ContentBelt.css";

// Components
import PaginationDropDown from "../PaginationDropDown/PaginationDropDown";
import PuzzleThumbnail from "../../Thumbnail/Thumbnail";

// Icons & Images
import { ReactComponent as RightArrow } from "./../../../assets/right-arrow.svg";
import { ReactComponent as LeftArrow } from "./../../../assets/left-arrow.svg";

function ContentBelt(props) {
    const { name, getPuzzle, type, theme } = props;
    const {user} = type=="userspuzzles" ? props : ""

    const formattedName = name.split(" ").join("");

    const [puzzles, setPuzzles] = useState([]);

    const [sortValue, setSortValue] = useState(0);

    const pageIndex = useRef(0);

    const [total, setTotal] = useState(0);

    // Gets the next page of 10 puzzles (called when requesting next page in content-belt)
    const getNext = () => {
        const thumbnails = document.querySelectorAll(
            `#${formattedName} > .thumbnail-link`
        );
        for (let thumbnail of thumbnails) {
            thumbnail.classList.add("next");
        }
        setTimeout(() => {
            for (let thumbnail of thumbnails) {
                thumbnail.classList.remove("next");
            }
            console.log("GET NEXT");
            pageIndex.current++;

            if (type == "fedpuzzles") {
                getFedPuzzles(sortValue);
            } else {
                sort(sortValue);
            }
        }, 200);
    };

    // Gets the previous page of 10 puzzles
    const getPrev = () => {
        const thumbnails = document.querySelectorAll(
            `#${formattedName} > .thumbnail-link`
        );
        for (let thumbnail of thumbnails) {
            thumbnail.classList.add("prev");
        }

        setTimeout(() => {
            for (let thumbnail of thumbnails) {
                thumbnail.classList.remove("prev");
            }
            console.log("GET PREV");
            pageIndex.current--;

            if (type == "fedpuzzles") {
                getFedPuzzles(sortValue);
            } else {
                sort(sortValue);
            }
        }, 200);
    };

    // Gets the first 10 puzzles with particular sort
    const sort = async (sortVal) => {
        let puzzletype = type == "eights" ? "eights" : "sudoku";

        console.log("SORT");
        let mode = "orderByDifficultyAsc";
        if (sortVal == 1) {
            mode = "sortDateDesc";
        } else if (sortVal == 2) {
            mode = "sortDateAsc";
        } else if (sortVal == 2) {
            mode = "orderByDifficultyAsc";
        } else if (sortVal == 3) {
            mode = "orderByDifficultyDesc";
        } else if (sortVal == 4) {
            mode = "orderByNameAsc";
        } else if (sortVal == 5) {
            mode = "orderByNameDesc";
        }

        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                url: fullurl + "/paginatedpuzzle",
                data: {
                    userid: localStorage.getItem("userid"),
                    accessToken: localStorage.getItem("accessToken"),
                    type: type,
                    count: 10,
                    index: pageIndex.current * 10,
                    mode: mode,
                    puzzletype: puzzletype,
                    user: user,
                },
            });
            let data = res.data;
            setPuzzles(data[0]);
            setTotal(data[1]);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Retrieves paginated federation puzzles
     * @param {*} sortVal : the ordering type
     */
    const getFedPuzzles = async (sortVal) => {
        console.log("FEDPUZZLES");

        let mode = "orderByDifficultyAsc";
        if (sortVal == 1) {
            mode = "orderByDifficultyAsc";
        } else if (sortVal == 2) {
            mode = "orderByDifficultyDesc";
        } else if (sortVal == 3) {
            mode = "orderByNameAsc";
        } else if (sortVal == 4) {
            mode = "orderByNameDesc";
        }

        try {
            const res = await Axios({
                method: "GET",
                withCredentials: false,
                url: fullurl + "/fedapi/fedpuzzles",
                params: {
                    type: type,
                    count: 10,
                    index: pageIndex.current * 10,
                    mode: mode,
                },
            });

            let data = res.data;
            await setPuzzles(data[0]);
            await setTotal(data[1]);
        } catch (err) {
            // console.error(err);
            console.log("Failed to retrieve fed puzzles");
        }
    };

    /**
     * useEffect for loading the puzzles of the content belt
     */
    useEffect(() => {
        if (type == "fedpuzzles") {
            getFedPuzzles(1);
        } else {
            sort(1);
        }
    }, []);

    if (puzzles.filter((e) => e.puzzleid != "queens").length > 0) {
        return (
            <div className="scroll" id={type.toLowerCase()}>
                <div className="contentbelt-header">
                    <h1 className="contentbelt-label">{name}</h1>
                    <PaginationDropDown
                        theme={theme}
                        sortValue={sortValue}
                        setSortValue={setSortValue}
                        sort={type == "fedpuzzles" ? getFedPuzzles : sort}
                        pageIndex={pageIndex}
                    />
                </div>
                <div className="content-belt" id={formattedName}>
                    {pageIndex.current >= 1 ? (
                        <>
                            <button
                                aria-label="Get next 10 puzzles"
                                className="arrow-btn"
                                onClick={() => getPrev()}
                            >
                                <LeftArrow className="arrow-btn-symbol" />
                            </button>
                        </>
                    ) : (
                        ""
                    )}

                    {puzzles.map((puzzle, index) => {
                        return (
                            <PuzzleThumbnail
                                type={type}
                                key={index}
                                puzzle={puzzle}
                                puzzledata={
                                    type == "fedpuzzles"
                                        ? puzzle.puzzle
                                        : puzzle.puzzledata
                                }
                                name={puzzle.puzzlename}
                                puzzleid={puzzle.puzzleid}
                            />
                        );
                    })}

                    {pageIndex.current < Math.floor(total / 10) ? (
                        <>
                            <button
                                aria-label="Get next 10 puzzles"
                                onClick={() => getNext()}
                                className="arrow-btn"
                            >
                                <RightArrow className="arrow-btn-symbol" />
                            </button>
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        );
    }
}

export default ContentBelt;
