// Libraries
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { fullurl } from "../../../Config";
import { Link } from "react-router-dom";

// Styling
import "./PuzzlePage.css";
import "./../../../base.css";
import LoadingIcon from "../../../assets/Loading.svg";
import { ReactComponent as StarOutsideIcon } from "./../../../assets/star.svg";
import { ReactComponent as StarInsideIcon } from "./../../../assets/star-inside.svg";
import { ReactComponent as ShareIcon } from "../../../assets/bxs-share-alt.svg";
import { ReactComponent as SubmitIcon } from "../../../assets/bx-check.svg";
import { ReactComponent as TrashIcon } from "../../../assets/bx-trash.svg";
import { ReactComponent as ExportIcon } from "../../../assets/bx-download.svg";

// Components
import SudokuModal from "../../modals/SudokuModal/SudokuModal";
import EightsModal from "../../modals/EightsModal/EightsModal";
import RatingBar from "./../../modals/RatingBar/RatingBar";
import SuccessModal from "../../modals/SuccessModal/SuccessModal";
import InfoTooltip from "../../InfoTooltip/InfoTooltip";

const svg =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFeElEQVRoQ+2ZgZUUNwyGjwpCKshSAaQClgpyVMBSQUgFDBUkVMCmgkAFDBUAFWSogKSCoI9n3/MJ2ZJnvDkerN7T270dW9IvyZI8d+viO6Nb3xneizPgbz3i5wgPjvBtkXdf+J7wPsnOn1nVnL7w+U74jfA/g+24EneKCAPyF+EnCega2wF/FH41GvxIwAD9NQHl+wgi0n8IPx8FfBTgp2LQNAJhRUYG/myrjq2AOZt/Ce+2GhLcv8i6h8Kc9VW0BTDpS7p59F4WzMlIDOZ7SfvkMJx3KfyTJ1CeUx9I825aC/iFaDo0tP0rz47JIYDsIYAjG/6hsRH5j3sEs3YNYA8s54zIb20tFD4iSX2oUTfoXsAtsPRPotIbUS9IO1kAMPq5RV2gewDj7d8rSonq5Fm+8Tnya9H+LWWVqyIKmHP1tiKNc4SXW5SHEYoSsogatAhTcV8KR4aMg6wjyyz6OclqGhIF/HdhZCkwAnaSDVR0bxjhzLPWq7410DjvThOtPIwAxggrlbw0BiBHAAN76CiLSdFW0Vtrkwt4J4qJriYK1N5BgeGPepAWa9nrtZxZ1uhChpOIctVZXoRrnkTo0gBT29eD3ytEtWA0M68FmJQkuvrsRVLZ2gfYP4Xp0Xk0pIBR/a1McKMl+yzHNve1AB9EoK6ITFB4tnW+rH2AbRW4NXuQSTDIND2RVXW1ANOGiEBJVFAi0iJaDPfhkogsoFp0lIc60rQqWlmLyBi6QEnVfTXAeO6jocU7u2wh+trjkR5p9fpFZHmtpjYj/JhsuQajBhivcu0riVuPjrjl+f+MH73imLes3Ytj9C2LayTZFgI8ySrdeyPpjPC1Rm/Za6W1WVxrnp9Fu+5xkalqdEp/EIE7K43Ubwf5WxdY8xz3AH4gQnGER/930cKevfBrZZg5HNUAb0lLqrh1qzpFWyoxhmw+BeBab8S4ozC1oBw8aCmkpKZIz/8qAGPEJNx6U+EdC557o6WWMTzCkV5aGkE0114eIoNKqcvqxWSIHourt6VZFusqHS1a2RCU0S56QQOWOtAaX3V09/LDpqJlAY62JW0MxpPirTeQ7CEirMNJvXSQDZvaEor1GexNs9Joos30BpN+eSqiz1LAaGVwT1RL+Uf5Q2dS1+BhjZaLCPXm2t7IjFrP3K/Pa9doWbs89BYuABFR6sEXBUShJboMC7llRZ0x5PKAsjkZWiqOztOAy/11F7U8rSOTSNHofwytOdqcspDfusVYExNRIK1bZw2gUyCinh/QgZzWW0wca71dqfbwFmCE4W1dXVvFi0p58JB0PifadAiLeKaLVXNC8+6pVrqg2HoRcAqwGaQFepeiqx3RPHYeYIRSRHSU+Y0ClmmSL61RkquaV4woPvrVUAlGtxnrFRTRRc5SyyIPMPtqYLLX97JGTzlZH94mS6oGKMNwMLVDv6PKy/K0V8sms/eWOiKAOctER79CQQ7FgagAWtPayQw5B2E9OfH7LEy2WNfP0MuCCGAU1XqdgfPzT66naxuL3yf53nPjCs0IUcDYYbUpy+6QpwOAWbIIW5mlt4evkj2AUXIU9m4/YeUB0BEnd834vYAjoClSpPTai0D2A7WDlAZ0jbrAImQNYPbV+nM2DLBkAwZ57UiDoV6QRQdhQNcoOuZe278WMEIwyKqk2kAAzwn4Ip/MuSVxsdgJA3SfPhs4Pz9a3QG2AEYxRh6F73oWDnrOfz9wdG/WXKnfCjgL4pxNwt5bjbW4t7wNuaZzFGCEkpYAJwKjgAOUDOqZ1ppOHQk4K6LQXCbwa1Od1AXkS+Gt1f5kEbY8C/h9Ys57zoTyndaSfs/FbR4NsjTsFBFuptRNPzwDvukInFr/OcKn9vBNy/8EzkQ0TBBWt60AAAAASUVORK5CYII";
import EmptyIcon from "./../../../assets/empty.png";

function PuzzlePage(props) {
    let [searchParams, setSearchParams] = useSearchParams();

    const puzzleid = searchParams.get("puzzleid");
    const type = searchParams.get("type");

    const { checkAccessToken } = props;

    const location = useLocation();
    const [modalState, setModalState] = useState(false);

    // For federation puzzles which need to be loaded through state rather than through DB call using puzzleid
    let puzzleObj = null;
    try {
        puzzleObj = location.state.puzzleObj;
    } catch {}

    const originalPuzzle = useRef(null);

    const [comments, setComments] = useState([]); // Comments of the puzzle
    const [puzzle, setPuzzle] = useState(null); // Puzzle obj
    const puzzleRef = useRef(null); // Puzzle Obj as useRef variable
    const [canRender, setCanRender] = useState(0); // Determines whether to render this component
    const [forceRender, setForceRender] = useState(0);
    const [message, setMessage] = useState("");
    const [showButtons, setShowButtons] = useState(1); // Determines whether to show submit and save button
    const [hasSolvedBefore, setHasSolvedBefore] = useState(false); // Indicates whether user has solved this puzzle before
    const [elevation, setElevation] = useState(0); // The user elevation level

    // Converts puzzle data from array of string to array
    const convertFedPuzzle = (puzzleData) => {
        let newPuzzleData = []
        for (let i = 0; i < puzzleData.length; i++) {
            let row = []
            for (let j = 0; j < puzzleData.length; j++){
                if (puzzleData[i][j] == ""){
                    row.push(0)
                }
                else{
                    row.push(parseInt(puzzleData[i][j]))
                }
            }
            newPuzzleData.push(row);
        }
        return JSON.stringify(newPuzzleData);
    }

    // Converts array of ints to array of char 
    const convertPuzzleToString = (puzzleData) => {
        let newPuzzleData = []
        for (let i = 0; i < puzzleData.length; i++) {
            let row = []
            for (let j = 0; j < puzzleData.length; j++){
                if (puzzleData[i][j] == 0){
                    row.push("")
                }
                else{
                    row.push((puzzleData[i][j]).toString())
                }
            }
            newPuzzleData.push(row);
        }
        return newPuzzleData;
    }

    /**
     * gets puzzle progress if user is logged in
     * @returns : the puzzle data as 2-D array
     */
    const getPuzzleProgress = async () => {
        console.log("Posting...");

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
                    puzzleid: puzzleid,
                },
                url: fullurl + "/puzzleprogress",
            });

            let data = res.data;
            return data;
        } catch (err) {
            // console.log(err);
            return [];
        }
    };

    /**
     * Retrieves the original unmodified puzzle data
     * @returns : the new puzzle data as a 2-D array
     */
    const getFreshPuzzle = async () => {
        console.log("Resetting...");

        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                data: {
                    puzzleid: puzzleid,
                },
                url: fullurl + "/puzzle",
            });

            let data = res.data;
            return data;
        } catch (err) {
            // Page not found
            return null;
        }
    };

    // Formats the time stamp of comments
    // Source : https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
    const timeSince = (time) => {
        switch (typeof time) {
            case "number":
                break;
            case "string":
                time = +new Date(time);
                break;
            case "object":
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, "seconds", 1], // 60
            [120, "1 minute ago", "1 minute from now"], // 60*2
            [3600, "minutes", 60], // 60*60, 60
            [7200, "1 hour ago", "1 hour from now"], // 60*60*2
            [86400, "hours", 3600], // 60*60*24, 60*60
            [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
            [604800, "days", 86400], // 60*60*24*7, 60*60*24
            [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
            [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
            [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
            [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
            [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
            token = "ago",
            list_choice = 1;

        if (seconds == 0) {
            return "Just now";
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = "from now";
            list_choice = 2;
        }
        var i = 0,
            format;
        while ((format = time_formats[i++]))
            if (seconds < format[0]) {
                if (typeof format[2] == "string") return format[list_choice];
                else
                    return (
                        Math.floor(seconds / format[2]) +
                        " " +
                        format[1] +
                        " " +
                        token
                    );
            }
        return time;
    };

    // For handling submitting a comment to current puzzle
    const submitComment = async () => {
        try {
            const comment = document.getElementById("newComment");
            let commentData = comment.value;
            comment.value = "";

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
                    puzzleid: puzzle.puzzleid,
                    comment: commentData,
                },
                url: fullurl + "/addComment",
            });

            getComments();
        } catch (err) {
            console.error(err);
        }
    };

    // Handles deleting a comment from puzzle
    const deleteComment = async (commentid) => {
        console.log("delete: ", commentid);
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
                    commentid: commentid,
                },
                url: fullurl + "/removeComment",
            });

            getComments(); // refresh the comments
        } catch (err) {
            console.error(err);
        }
    };

    // delete-puzzle function for moderators
    const deletePuzzle = async () => {
        // Check that user has sufficient elevation level
        if (
            elevation < 2 &&
            localStorage.getItem("username") != puzzle.username
        ) {
            console.log("this user does not have the authorization!");
            console.log(elevation);
        } else {
            // Update backend
            try {
                let Deletepuzzleid = puzzleid;
                const res = await Axios({
                    method: "POST",
                    withCredentials: true,
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("accessToken"),
                    },
                    data: {
                        puzzleid: Deletepuzzleid,
                    },
                    url: fullurl + "/deletePuzzle",
                });
            } catch (err) {
                console.error(err);
            }
        }
        navigate("/");
    };

    // Retrieves the user elevation level from backend
    const getElevation = async () => {
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
                url: fullurl + "/getElevation",
            });

            let data = res.data;
            let gotElevation = data.accountelevation;
            setElevation(gotElevation);
        } catch (err) {
            console.error(err);
        }
    };

    // Sanitizes comment content
    // https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
    const sanitize = (string) => {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;",
        };
        const reg = /[&<>"'/]/gi;
        return string.replace(reg, (match) => map[match]);
    };

    // Retreives all comments for current puzzle from backend
    const getComments = async () => {
        await getElevation();

        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: {
                    puzzleid: puzzleid,
                },
                url: fullurl + "/getcomments",
            });

            let data = res.data;
            setComments(data);

            return data;
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Resets the puzzle to default
     */
    const reset = async () => {
        setCanRender(0);
        if (type == "fedpuzzles") {
            window.location.reload();
        } else {
            setPuzzle(await getFreshPuzzle());
        }
        setCanRender(1);
    };

    const navigate = useNavigate();

    /**
     * Saves the users progress in solving the puzzle (sends back current puzzle data)
     */
    const savePuzzleProgress = async () => {
        console.log("Saving...");

        // Check that user's access token has not expired
        if (!checkAccessToken()) {
            navigate("/LoggedOut");
            return;
        }

        // Send puzzle data to backend
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
                    puzzle: puzzle,
                },
                url: fullurl + "/savepuzzleprogress",
            });

            let data = res.data;

            if (data.status == 0) {
                setMessage("Unable to save...");
            } else {
                setMessage("Progess Saved!");
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
            if (didConflict.current.current == 0) {
                await savePuzzleProgress();
                setForceRender(0);
            } else {
                console.log("Conflict");
                setForceRender(1);
            }
        } catch (err) {
            console.error(err);
            // Matches original state, allow save (to save a reset)
            console.log("Saving reset");
            await savePuzzleProgress();
            setForceRender(0);
        }
    };

    /**
     * Updates puzzle data upon each input
     * @param {*} data
     */
    const handlePuzzleChange = (data) => {
        let newArr = [];
        data.map((rows) => {
            let row = [];
            rows.map((cell) => {
                row.push(cell.value);
            });
            newArr.push(row);
        });
        let temp = puzzle;
        temp.progress = JSON.stringify(newArr);
        setPuzzle(temp);
        puzzleRef.current = temp;
    };

    // Handles copying the puzzle url to clipboard
    const copyToClipBoard = async (txt) => {
        try {
            await navigator.clipboard.writeText(txt);
            document.getElementById("copy-btn").innerHTML = `
            
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(97, 96, 96, 1);transform: ;msFilter:;"><path d="M5.5 15a3.51 3.51 0 0 0 2.36-.93l6.26 3.58a3.06 3.06 0 0 0-.12.85 3.53 3.53 0 1 0 1.14-2.57l-6.26-3.58a2.74 2.74 0 0 0 .12-.76l6.15-3.52A3.49 3.49 0 1 0 14 5.5a3.35 3.35 0 0 0 .12.85L8.43 9.6A3.5 3.5 0 1 0 5.5 15zm12 2a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm0-13A1.5 1.5 0 1 1 16 5.5 1.5 1.5 0 0 1 17.5 4zm-12 6A1.5 1.5 0 1 1 4 11.5 1.5 1.5 0 0 1 5.5 10z"></path></svg>
            `;
        } catch (err) {}
    };

    // check if the puzzle has been solved before
    const solvedBefore = async () => {
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
                    puzzleid: puzzleid,
                },
                url: fullurl + "/solvedBefore",
            });
            let data = res.data;
            if (data === true) {
                setHasSolvedBefore(true);
            } else if (data === false) {
                setHasSolvedBefore(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // submit the puzzle solution
    const submitPuzzle = async () => {
        console.log("submit puzzle from jsx initialized");
        try {
            // make the Axios request
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
                    puzzleid: puzzleid,
                    hasSolvedBefore: hasSolvedBefore,
                },
                url: fullurl + "/submitPuzzle",
            });
            console.log(res.data);
            // check for errors and handle response
            if (res.data) {
                console.log("start submitting the solution");

                if (hasSolvedBefore) {
                    console.log(
                        "submission is successful but user has solved this before"
                    );
                    //alert('You have solved this puzzle before.');
                } else {
                    console.log(
                        "submission is successful and user has not solved this before"
                    );
                    //alert('Puzzle solved!');
                }
            } else {
                console.log("solution not saved");
                //alert('Error submitting solution.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Result message after clicking submit button
    const [resultMessage, setResultMessage] = useState("");

    /**
     * Checks that a valid number of cells have been filled
     * @param {*} puzzleObject : the puzzle object with the user inputs
     * @returns : true or false indicating whether the puzzle has been filled validly or not
     */
    const checkSolution = (puzzleObjectProgress, puzzleObjectData) => {
        if (puzzle.puzzletype == "sudoku") {
            let puzzleObject = puzzleObjectData;

            let count = 0;
            puzzleObject.map((rows) => {
                rows.map((cell) => {
                    if (cell > 0 || cell.filled) {
                        count++;
                    }
                });
            });

            if (count != 81) {
                return false;
            }
        } else if (puzzle.puzzletype == "eights") {
            let puzzleObject = eval(eval(puzzleObjectProgress));
            let flag = true;
            let count = 1;

            puzzleObject.map((rows) => {
                rows.map((cell) => {
                    if (cell != count) {
                        flag = false;
                    }
                    count++;
                });
            });
            return flag;
        }
        return true;
    };

    // buttons for the ratings
    const [selectedRating, setSelectedRating] = useState(null);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    /**
     * handle the rating buttons and if a user click it, it shows that the buttons has been selected
     * @param {*} rating
     */
    const handleRatingClick = async (rating) => {
        setSelectedRating(rating);
        setButtonsDisabled(true);

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
                    puzzleid: puzzleid,
                    userrating: rating * 2,
                    puzzle: puzzle,
                },
                url: fullurl + "/addRating",
            });

            for (let i = 0; i < rating; i++) {
                const selector = ".rating-button>.btn" + i + ">svg";
                const elem = document.querySelector(selector);

                elem.style.fill = "red";
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Handles hovering over the puzzle rating bar - this supports the effect of stars turning red on hover
    const handleHover = (state, number) => {
        if (state && !buttonsDisabled) {
            for (let i = 0; i <= number; i++) {
                const selector = ".rating-button>.btn" + i + ">svg";

                const star = document.querySelector(selector);
                star.style.fill = "red";
            }
        } else if (!buttonsDisabled) {
            const selector = ".star-inside>svg";
            const allStars = document.querySelectorAll(selector);

            for (let j = 0; j < allStars.length; j++) {
                allStars[j].style.fill = "white";
            }
        }
    };

    // The rating button html elements
    const ratingButtons = [];
    for (let i = 0; i < 5; i++) {
        ratingButtons.push(
            <button
                key={i}
                className="rating-button"
                onClick={() => handleRatingClick(i + 1)}
            >
                <div className="star-outside">
                    <StarOutsideIcon
                        height="20px"
                        width="20px"
                        viewBox="0 0 1920 1920"
                    />
                </div>
                <div
                    className={`star-inside btn${i}`}
                    onMouseEnter={() => handleHover(true, i)}
                    onMouseLeave={() => handleHover(false, i)}
                >
                    <StarInsideIcon
                        height="15px"
                        width="15px"
                        viewBox="0 0 1920 1920"
                    />
                </div>
            </button>
        );
    }

    // the puzzle rating value
    const [puzzleRating, setPuzzleRating] = useState(null);

    // Retrieves the puzzle's rating from the backend
    const getPuzzleRating = async () => {
        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,

                data: {
                    puzzleid: puzzleid,
                },
                url: fullurl + "/getRating",
            });
            let data = res.data;
            await setPuzzleRating(data / 2.0);
        } catch (err) {
            console.error(err);
        }
    };

    // Clears the submit result message
    const clearResultMessage = (msg) => {
        setResultMessage(msg);
    };

    /**
     * Compares two 2-D arrays to check that they are equal - for checking the user input against the solution
     * @param {*} x : user puzzledata
     * @param {*} y : solution puzzle data
     * @returns : true or false indicating the validity of the users solution
     */
    const compare2DArr = (x, y) => {
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < x.length; j++) {
                if (parseInt(x[i][j]) != parseInt(y[i][j])) {
                    return false;
                }
            }
        }
        return true;
    };

    // Handler for submit button - checks that solution is valid and has no conflicts
    const submit = () => {
        if (type == "fedpuzzles") {
            if (puzzle.progress == puzzle.solution) {
                setResultMessage("");
                setModalState(true);
            } else {
                console.log(puzzle)
                setResultMessage("Invalid Solution");
            }
            // checkSolution(puzzle.progress, puzzle.puzzledata)
        } else if ((puzzle.puzzletype == "sudoku" && puzzle.progress == puzzle.solution) || (checkSolution(puzzle.progress, puzzle.puzzledata))) {
            try {
                if (didConflict.current.current == 0) {
                    didConflict.current = 0;
                    setModalState(true);

                    console.log("solution submitted");
                    submitPuzzle();
                } else {
                    setResultMessage("Invalid Solution");
                }
            } catch (err) {
                console.error(err);
                setModalState(true);
                setResultMessage("");

                submitPuzzle();
            }
        } else {
            // if invalid display message indicating so
            setResultMessage("Invalid Solution");
        }
    };

    // For handling the export button
    const exportPuzzle = async () => {
        // Fill group if missing
        if (puzzle.group == null) {
            puzzle.group = 15;
        }

        // Create object
        const toExport = {
            sudoku_id: puzzle.puzzleid,
            author_id: puzzle.username,
            group: puzzle.group,
            puzzle: await convertPuzzleToString(puzzle.puzzledata),
            solution: await convertPuzzleToString(eval(puzzle.solution)),
            difficulty: puzzle.difficulty,
        };

        // Download exported JSON object
        const filename = puzzle.puzzleid + ".json";
        const output = JSON.stringify(toExport, null, 2);

        const blob = new Blob([output], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const returnHome = () => {
        navigate("/");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            submitComment();
        }
    };

    useLayoutEffect(() => {
        // await getComments();
        const setpuzzleprogress = async () => {
            const p = await getPuzzleProgress();
            setPuzzle(p[0]);
            originalPuzzle.current = p[0];
            await solvedBefore();
            await getPuzzleRating();
            await getComments();
            setCanRender(1);
        };

        const setpuzzle = async () => {
            const p = await getFreshPuzzle();
            p.progress = await JSON.stringify(p.puzzledata);

            setPuzzle(p);
            originalPuzzle.current = p;
            await getPuzzleRating();
            setCanRender(1);
        };


        const setFedPuzzle = async () => {
            puzzleObj.puzzledata = puzzleObj.puzzle;
            puzzleObj.puzzlename = puzzleObj.sudoku_id;
            puzzleObj.puzzleid = puzzleObj.sudoku_id;
            puzzleObj.puzzletype = "sudoku";
            puzzleObj.author = puzzleObj.author_id;
            puzzleObj.datepublished = "";
            puzzleObj.titleCSS = "0";
            puzzleObj.progress = JSON.stringify(convertFedPuzzle(puzzleObj.puzzle));
            puzzleObj.solution = (await convertFedPuzzle(puzzleObj.solution));
            await setPuzzle(puzzleObj);
            originalPuzzle.current = puzzleObj;
            setCanRender(1);
        };

        if (type == "fedpuzzles") {
            // If the puzzle is from the federation
            setFedPuzzle();
            setShowButtons(0);
        } 
        // Check that user is logged in
        else if (localStorage.getItem("loginState") == 0 || !checkAccessToken() || localStorage.getItem("fedapi") == 1) {
            setShowButtons(0);
            setpuzzle();
        } else {
            setpuzzleprogress();
        }
    }, []);

    if (puzzle != null && canRender == 1) {
        return (
            <div className="puzzlepage-wrapper">
                <SuccessModal
                    message={`Congratulations! You solved the "${puzzle.puzzlename}" puzzle by ${puzzle.username}`}
                    modalState={modalState}
                    setModalState={setModalState}
                />
                {/* End Row 1*/}
                <div className="row-two">
                    <div className="row-one">
                        <div
                            className="puzzlepage-titlebg"
                            style={{
                                background: puzzle.titleCSS,
                                textShadow:
                                    "-1px -1px 0 #aaa, 1px -1px 0 #aaa, -1px 1px 0 #aaa, 1px 1px 0 #aaa",
                                padding: "7.5px",
                            }}
                        >
                            <h1 className="puzzlepage-title">
                                {puzzle.puzzlename}
                            </h1>
                            <RatingBar rating={puzzleRating} />
                        </div>

                        <h1 className="result-message">{resultMessage}</h1>
                    </div>{" "}
                    <div className="puzzle-modal-wrapper">
                        <div className="puzzle-modal">
                            <div className="author-share">
                                <div className="share-info-btn-bar">
                                    <button
                                        className="copy-btn"
                                        aria-label="Copy unique link to Sudoku"
                                        type="button"
                                        id="copy-btn"
                                        onClick={() =>
                                            copyToClipBoard(
                                                window.location.href
                                            )
                                        }
                                    >
                                        <ShareIcon className="share-icon" />
                                    </button>
                                    <h1 className="author-name">
                                        Puzzle by @
                                        <a
                                            className="author-link"
                                            href={
                                                "/profile" +
                                                (puzzle.username ===
                                                localStorage.getItem("username")
                                                    ? "/?user=" +
                                                      puzzle.username +
                                                      "&type=0"
                                                    : "/?user=" +
                                                      puzzle.username +
                                                      "&type=1")
                                            }
                                        >
                                            {puzzle.username}
                                        </a>
                                    </h1>

                                    {puzzle.puzzletype == "eights" ? (
                                        <InfoTooltip info="Click the squares next te empty spots to slide the tile. Arrange all the tiles to form an image to solve the puzzle." />
                                    ) : (
                                        <InfoTooltip info="Use your arrow keys and number row on your keyboard to input numbers after clicking the sudoku board, or click a cell and then a number in the input row. Make sure each box, row, and column only has one of each digit." />
                                    )}
                                </div>
                            </div>
                            {puzzle.puzzletype == "sudoku" ? (
                                <SudokuModal
                                    puzzleObj={puzzle}
                                    puzzleData={puzzle.puzzledata}
                                    puzzleProgress={puzzle.progress}
                                    name={puzzle.puzzlename}
                                    canRender={canRender}
                                    handlePuzzleChange={handlePuzzleChange}
                                    clearResultMessage={clearResultMessage}
                                    originalPuzzle={originalPuzzle}
                                />
                            ) : (
                                ""
                            )}
                            {puzzle.puzzletype == "eights" ? (
                                <EightsModal
                                    puzzleData={puzzle.puzzledata}
                                    puzzleProgress={puzzle.progress}
                                    name={puzzle.name}
                                    canRender={canRender}
                                    handlePuzzleChange={handlePuzzleChange}
                                    clearResultMessage={clearResultMessage}
                                    originalPuzzle={originalPuzzle}
                                    puzzleImage={fullurl + puzzle.puzzleImage}
                                />
                            ) : (
                                ""
                            )}

                            <div className="btn-container" id="btn-container">
                                <button className="submit-btn" onClick={submit}>
                                    Submit
                                    <SubmitIcon className="submit-icon"></SubmitIcon>
                                </button>

                                <button
                                    aria-label="Click this to reset the board to its original state"
                                    className="reset-btn"
                                    type="button"
                                    onClick={reset}
                                >
                                    Reset
                                    <img
                                        alt="reset-img"
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAahJREFUSEu1VcFNA0EQs/8gKIFUQDqAdEAHwB8kqACogEjwJ1SAqICkAigBKoAI/kaO5k6bZZNbCJnP6XS74xl7xkesObjm/KgGkLQN4Jrk8W+KqgKQ1AdwB6BPsupOU0TnYUlHrhyAO2jiFcAYwD1JPxdGLcAQwNaCLAY4J/lS+t4J4EtB0QjArimK9wMAZwH8AWBQAqkCCBBTNCRpymYRwru7QwBFkGqAZTxLcncGGZMcpGf/C8DdWXjrZKpa4asBJN0AaOgZkTxNK5V0CeAiJqulsQogkp9kNN2mIJL2ATy5E5K96j0IMT8BbGQAXyQ3M8Hf/Z4u41wHkpQfWAIwlyjO+f6UZLuUOYDF2cuFqqTIdvIMYELSdM0iB2jG7YqkRWsjEdlUzfEf1XvpbCm2j7LIiVBemh5JPzsjFs7V73SOqaSGJo9ilTUnizZHzw+KolVzaRAvjSmzkRU7icofAJjzqZ+5HxX3IMysAXFy+81jczm+2xrMtSemmLzYQTLX7sSJPVXLYmJX/bNdh/Cu1AIa1NS9BY3WabUfTucIdRyo8qJVQL4Bgfm2Ge+OFh8AAAAASUVORK5CYII="
                                    />
                                </button>
                                {showButtons == 1 ? (
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
                                {(elevation >= 2 ||
                                    puzzle.username ===
                                        localStorage.getItem("username")) && (
                                    <button
                                        className="delete-puzzle-btn"
                                        type="button"
                                        onClick={deletePuzzle}
                                    >
                                        Delete
                                        <TrashIcon />
                                    </button>
                                )}
                                {puzzle.puzzletype == "sudoku" && (
                                    <button
                                        aria-label="Click this to export the Sudoku as JSON"
                                        className="export-btn"
                                        type="button"
                                        onClick={exportPuzzle}
                                    >
                                        <ExportIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="comments-col">
                            {localStorage.getItem("loginState") == 1 && localStorage.getItem("fedapi") == 0 && (
                                <div className="comments">
                                    <div className="comments-header">
                                        <h2>Comments</h2>
                                        <div className="rating-container">
                                            <h2 className="rating-title">
                                                Rate
                                            </h2>
                                            <div className="rating-buttons">
                                                {ratingButtons}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="new-comment">
                                            <div className="write-comment">
                                                <input
                                                    id="newComment"
                                                    placeholder="Add a comment..."
                                                    onKeyPress={handleKeyPress}
                                                ></input>
                                                <button
                                                    className="send-comment"
                                                    onClick={() =>
                                                        submitComment()
                                                    }
                                                >
                                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABR1JREFUaEO9WYt1FTcQvbMN8DpIXAF0AK4AqCBQgV8qwFQQXEHiCjAVYFcQXEGgA7uBnZyRtNqRNPrsY43O8bH9VivNnc+dKz3CLx0EgHfdUVYE9l83NdJcf59N6emtLx3eNX3DBB+Bxuiu1VtAwku8d+bEXX8yhbbC0/Pb746u3AZwsvNGt//5UummUBKrfQmkmXzM/ALARZj0JxE9WC+MA+jm+j4TmPkVgA8A5Pcybono3GLLDMDJOZNZvzWFCMzzawDHzHBf/GIWEVUADBq9ySa/Zo184lIE8Mx/ALgE8Hv0QjBae8UBMNxkplBpa/uT2tMaZmY+APwaoNTwehbeE5HURBGErJH5LfcnO2+ZM5xxAXKpcrDtde7/AeC35TkDdxNNryzbYgT2YeWKScySHpIqRzAOzkP2uAb4EiCZ/1VNuSMiXdRZI9tKIDW02efsDRdGedfZ4lrqgIi+h0i9AfD5iQD0q1lxuGl4qNFHAJ/kx3G8WpZZouCAL+MjkauXMNbJm/pAz/SEwyOT+D8UsaSGG6FZAcS3PhJNl5ag2gSglgbMwigGh6cvSGFKmvzTy9h+BNJYuP+2UmfI1ZLDS+uGDY+sw/yJgQvlXZESkm4WjdYONHbCeA6HeNzkcJUqdwxcTkS3tQOTpBzJ82S4riyfvVQfnxfzgnmllKgc+YLhIq56VHgXUuXWdIHvvkKJfwG4slKKmU8FUMY/UKHn8Grzce8lVGjleVjr76B3fhA5vi+GDWC6zYtYHFQt4iaHp1plxHBJO/G4ptX3tYLmmf8DrdqIgbMp9IgcrQeQcvC6WUaF8WXGIyhw+EQPWrRpMaLTjoGD8pb3fkWzMHNy8rCEnO4IKYCZv4ISLR6uQhyXP5JuPklbSTOe2VCZq/uq3nfsNrMXZGFMROIjcxQptKI3NK2vg+va6ShQ61KgTj1GQb9ub+d+xO9YqB8Bm4WcYhS+XY5yuoMuJsjRTpqRMIjTLsFwKchQoBp84QjD++uZhHl+AdC/yt1RSlshMIs4SALhec3F1vs3AYyIr4pgkyuVoNqBKvMoR0gEbSWqz161CKxWulCKVwWI0Oge4y0RCejqCM6rSum8t5QRMLpPOIgcQc7L8aBhpbhZOd7cqqbXaHoA9Fy7D3QkJzMLiCMDz8eUYFSj5y1ZsVBqT8jlzGtGIPJ6A0zwlLCS6KLe+E5EZ717WNlu7p4F0q18dZWdqGdQfL5ydiN5/GxhLGG4Dg3PcqQ0DjO2N8eyIJirqDrKkrxrDiB/YOCGADllRRpWKZTQOIAopYdpdMCINQJZ218fpErLjA/jBuT6iZPUIYX6SlQZuCkCFrBWBLpJtS4okZDT2vWQlK4DKG/pOqQknbt/5TuOZLnA1XdGjr2KTfqNrJZIWm866VEFkNl9H7q1aCRhr+f5DhWcZ0mtZC+dkEKF6hyJwBVNdNQ0GmhYekrZ5RWSnpRu9IFe8nhXdCIg8vtNee5d3RgOThIRAfMsc/AjEYV0Ku2xO/HGLy0bAL6IUZb0tlwTDj8iCkV7BbnCV0STgKuORgpl21QCkgMIhx5hFHcN0hz1Nf1NNE3f8gvduN7pRZyalAG4Z+DdRPTtyb97DpkyWMT1aCgA0pDscI+VUy9exfNqDbQJtIiAcHezUO31cl3ZI7MhLTTuqqUb8DwfaKp/g9gzS4Mzd+98AzaYQkb32GJZZqUXvw1n1ZAYt4YmgK3BNVNkPJgdklSeMtb89RHYXKrtF/4H2VRVWK8duvkAAAAASUVORK5CYII=" />
                                                </button>
                                            </div>
                                        </div>
                                        <div id="comment-holder">
                                            {comments.length != 0 ? (
                                                <>
                                                    {comments.map((comment) => (
                                                        <div
                                                            className="comment"
                                                            key={
                                                                comment.commentid
                                                            }
                                                        >
                                                            <div className="comment-username-date">
                                                                <div className="pfpuser">
                                                                    <Link
                                                                        to={
                                                                            "/Profile/?user=" +
                                                                            comment.username
                                                                        }
                                                                        state={{
                                                                            type: 1,
                                                                        }}
                                                                    >
                                                                        <img
                                                                            className="comment-pfp"
                                                                            src={
                                                                                comment.avatar ===
                                                                                ""
                                                                                    ? svg
                                                                                    : fullurl +
                                                                                      comment.avatar
                                                                            }
                                                                            alt="?"
                                                                        />
                                                                    </Link>
                                                                    <p className="comment-username">
                                                                        {
                                                                            comment.username
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <p className="comment-date">
                                                                    {timeSince(
                                                                        comment.dateposted
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="comment-data">
                                                                    {sanitize(
                                                                        comment.commentdata
                                                                    )}
                                                                </p>
                                                                {(comment.userid ===
                                                                    localStorage.getItem(
                                                                        "userid"
                                                                    ) ||
                                                                    elevation >=
                                                                        2) && (
                                                                    <button
                                                                        className="trash-btn"
                                                                        id={
                                                                            "delete-comment:" +
                                                                            comment.commentid
                                                                        }
                                                                        onClick={() =>
                                                                            deleteComment(
                                                                                comment.commentid
                                                                            )
                                                                        }
                                                                    >
                                                                        <TrashIcon className="trash-icon" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="no-comments-msg">
                                                    <h1 className="no-comments-msg-txt">
                                                        No comments yet
                                                    </h1>
                                                    <img
                                                        src={EmptyIcon}
                                                        className="empty-icon"
                                                    />
                                                    <h1 className="no-comments-msg-txt">
                                                        Be the first to comment
                                                    </h1>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* End comments container */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>{" "}
                {/* End Row 2 */}
            </div>
        );
    } else if (puzzle == null && canRender) {
        return (
            <div>
                <h1 className="puzzlepage-title">Puzzle not found </h1>
                <button className="return-home-btn" onClick={returnHome}>
                    Return to home page
                </button>
            </div>
        );
    }
}

export default PuzzlePage;
