// Libraries
import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { fullurl } from "./../../../Config";

// Styling
import "./ContentBelt.css";

// Components
import PaginationDropDown from "../PaginationDropDown/PaginationDropDown";
import PuzzleThumbnail from "../../Thumbnail/Thumbnail";

// Icons & Images
import { ReactComponent as RightArrow } from "./../../../assets/right-arrow.svg";
import { ReactComponent as LeftArrow } from "./../../../assets/left-arrow.svg";

function ContentBelt(props) {
    const { name, type, theme } = props;

    const formattedName = name.split(" ").join("");

    const [puzzles, setPuzzles] = useState([]);
    const [sortValue, setSortValue] = useState(0);
    const pageIndex = useRef(0);
    const [total, setTotal] = useState(0);

    // Gets the next page of 10 puzzles (called when requesting next page in content-belt)
    const getNext = () => {
        animateThumbnails('next');
        pageIndex.current++;
        sort(sortValue);
    };

    // Gets the previous page of 10 puzzles
    const getPrev = () => {
        animateThumbnails('prev');
        pageIndex.current--;
        sort(sortValue);
    };

    // Animate thumbnails for visual effect
    const animateThumbnails = (direction) => {
        const thumbnails = document.querySelectorAll(`#${formattedName} > .thumbnail-link`);
        thumbnails.forEach(thumbnail => thumbnail.classList.add(direction));
        setTimeout(() => thumbnails.forEach(thumbnail => thumbnail.classList.remove(direction)), 200);
    };

    // Gets the first 10 puzzles with particular sort
    const sort = async (sortVal) => {
        let mode = determineSortMode(sortVal);
        let puzzletype = type === "eights" ? "eights" : "sudoku";

        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                url: `${fullurl}/paginatedpuzzle`,
                data: {
                    userid: localStorage.getItem("userid"),
                    accessToken: localStorage.getItem("accessToken"),
                    type: type,
                    count: 10,
                    index: pageIndex.current * 10,
                    mode: mode,
                    puzzletype: puzzletype,
                },
            });
            let data = res.data;
            setPuzzles(data[0]);
            setTotal(data[1]);
        } catch (err) {
            console.error(err);
        }
    };

    // Determine sort mode based on value
    const determineSortMode = (sortVal) => {
        switch (sortVal) {
            case 1: return "sortDateDesc";
            case 2: return "sortDateAsc";
            case 3: return "orderByDifficultyAsc";
            case 4: return "orderByDifficultyDesc";
            case 5: return "orderByNameAsc";
            case 6: return "orderByNameDesc";
            default: return "orderByDifficultyAsc";
        }
    };

    // useEffect for loading the puzzles of the content belt
    useEffect(() => {
        sort(1);  // Default sorting when the component mounts
    }, []);

    if (puzzles.length > 0) {
        return (
            <div className="scroll" id={type.toLowerCase()}>
                <div className="contentbelt-header">
                    <h1 className="contentbelt-label">{name}</h1>
                    <PaginationDropDown
                        theme={theme}
                        sortValue={sortValue}
                        setSortValue={setSortValue}
                        sort={sort}
                        pageIndex={pageIndex}
                    />
                </div>
                <div className="content-belt" id={formattedName}>
                    {pageIndex.current > 0 && (
                        <button aria-label="Get previous 10 puzzles" onClick={getPrev} className="arrow-btn">
                            <LeftArrow className="arrow-btn-symbol" />
                        </button>
                    )}
                    {puzzles.map((puzzle, index) => (
                        <PuzzleThumbnail
                            type={type}
                            key={index}
                            puzzle={puzzle}
                            puzzledata={puzzle.puzzledata}
                            name={puzzle.puzzlename}
                            puzzleid={puzzle.puzzleid}
                        />
                    ))}
                    {pageIndex.current < Math.floor(total / 10) && (
                        <button aria-label="Get next 10 puzzles" onClick={getNext} className="arrow-btn">
                            <RightArrow className="arrow-btn-symbol" />
                        </button>
                    )}
                </div>
            </div>
        );
    }
    return null; // Return null if no puzzles
