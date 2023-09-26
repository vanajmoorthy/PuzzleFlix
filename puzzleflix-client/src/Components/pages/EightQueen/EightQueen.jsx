// Libraries 
import React, { useEffect } from "react";
import Axios from "axios";
import { useState } from "react";
import { useLayoutEffect } from "react";

// config 
import { port, fullurl } from "../../../Config";

// Components 
import EightQueensModal from "../../modals/EightQueensModal/EightQueensModal";

//styling

function EightQueen(props) {
    const { loginState, checkAccessToken } = props;
    const [data, setData] = useState([]);
    const [numberOfQueens, setNumberOfQueens] = useState(0);
    const [canRender, setCanRender] = useState(false);

    // Formats the puzzle data 
    const formatPuzzle = (puzzleArray) => {
        let array = [];
        let queenCounter = 0;

        for (let i = 0; i < puzzleArray.length; i++) {
            let rowArray = [];

            for (let j = 0; j < puzzleArray.length; j++) {
                if (puzzleArray[i][j] == 1) {
                    queenCounter++;
                }
                rowArray.push({ value: puzzleArray[i][j], index: `${i}${j}` });
            }
            array.push(rowArray);
        }
        setNumberOfQueens(queenCounter);
        return array;
    };

    // Retrieves user progress from backend if there is any
    useLayoutEffect(() => {
        const getEightQueenBoard = async () => {
            let responseData;


            try {
                const res = await Axios({
                    method: "GET",
                    withCredentials: false,
                    params: {
                        uid: localStorage.getItem("userid"),
                        accessToken : localStorage.getItem("accessToken"),
                    },
                    url: fullurl + "/eightqueens/getBoard",
                });

                responseData = await res.data;

                console.log(res)
            } catch (err) {
                console.error(err);
            }

            console.log(responseData)
            let puzzle = [];
            if (responseData == "" || responseData == null) {
                for (let i = 0; i < 8; i++) {
                    let row = [];
                    for (let j = 0; j < 8; j++) {
                        row.push(0);
                    }
                    puzzle.push(row);
                }
            } else {
                puzzle = JSON.parse(responseData);
            }
            setData(formatPuzzle(puzzle));
            setCanRender(true);
        };
        getEightQueenBoard();
    }, []);

    if (canRender) {
        return (
            <div>
                <EightQueensModal
                    puzzleData={data}
                    numberOfQueens={numberOfQueens}
                    loginState={loginState}
                    checkAccessToken={checkAccessToken}
                />
            </div>
        );
    }
}

export default EightQueen;
