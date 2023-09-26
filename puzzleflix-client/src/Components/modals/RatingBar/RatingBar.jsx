// Libraries 
import React from "react";
import { useState } from "react";
import {useEffect, useLayoutEffect} from 'react';

// Styling
import "./RatingBar.css";

// Assets  
import {ReactComponent as StarOutsideIcon} from "./../../../assets/star.svg"
import {ReactComponent as StarInsideIcon} from "./../../../assets/star-inside.svg"

function RatingBar(props) {
    const {rating} = props;

    const [stars, setStars] = useState([]);

    // For generating the current rating of the puzzle 
    useLayoutEffect(() => {
        let starObjects = []

        let i = 1;
        while (i <= Math.floor(rating)){
            starObjects.push(
                <div className="star-pair-main" key={'star' + i}>
                    <div className="star-outside-main">
                        <StarOutsideIcon height="20px" width="20px" viewBox="0 0 1920 1920" />
                    </div>
                    <div className={`star-inside-main star-main${i}`}>
                        <StarInsideIcon height="17px" width="20px" viewBox="0 0 1920 1920" fill="red"/>
                    </div>
                </div>
            )
            i++
        }
        let percent = (rating % 1) * 100;

        if (percent != 0){
            const fillStyle = {width:`${percent}%`}

            starObjects.push(
                <div className="star-pair-main" key={'star' + i}>
                        <div className="star-outside-main">
                            <StarOutsideIcon height="20px" width="20px" viewBox="0 0 1920 1920"/>
                        </div>
                        <div className={`star-inside-main star-main${i}`}>
                            <StarInsideIcon  height="17px" width="20px" viewBox={`0 0 ${1920 * (percent/100)} 1920`} fill="red" style={fillStyle}/> 
                        </div>
                    </div>
            )
            i++;
        }

        while (i <= 5){
            starObjects.push(
                <div className="star-pair-main" key={'star' + i}>
                        <div className="star-outside-main">
                            <StarOutsideIcon height="20px" width="20px" viewBox="0 0 1920 1920" />
                        </div>
                        <div className={`star-inside-main star-main${i+1}`}>
                            <StarInsideIcon height="17px" width="20px" viewBox="0 0 1920 1920" fill="transparent"/>
                        </div>
                </div>
            )
            i++;
        }
        setStars(starObjects);
    }, [])

    return (
        <div className="rating-bar-main">
            <div className="rating-bar-main-inner">
                {stars}
            </div>
        </div>
    )
}
export default RatingBar;