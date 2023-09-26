import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react'

// Config 
import { fullurl } from "../../Config";

// Styling
import "./Thumbnail.css"
import "./../../base.css"


function Thumbnail(props) {
    const { name, puzzleid, puzzledata, puzzle, type } = props;
    const [isHovered, setIsHovered] = useState(false);

    let imageSize;
    let offsets;


    // Handler for hovering over thumbnail
    function handleHover(bool) {
        setIsHovered(bool);
    }


    // thumbnail sizing presets 
    if (window.innerWidth <= 500) {
        imageSize = 150;
        offsets = [("0 0"),
        (2 * imageSize / 3) + "px 0",
        (imageSize / 3) + "px 0",
        "0 " + (2 * imageSize / 3) + "px",
        (2 * imageSize / 3) + "px " + (2 * imageSize / 3) + "px",
        (imageSize / 3) + "px " + (2 * imageSize / 3) + "px",
        "0 " + (imageSize / 3) + "px",
        (2 * imageSize / 3) + "px " + (imageSize / 3) + "px",
        (imageSize / 3) + "px " + (imageSize / 3) + "px",
        ("")];
    
    } else {
         imageSize = 200;

         offsets = [("0 0"),
        (2 * imageSize / 3) + "px 0",
        (imageSize / 3) + "px 0",
        "0 " + (2 * imageSize / 3) + "px",
        (2 * imageSize / 3) + "px " + (2 * imageSize / 3) + "px",
        (imageSize / 3) + "px " + (2 * imageSize / 3) + "px",
        "0 " + (imageSize / 3) + "px",
        (2 * imageSize / 3) + "px " + (imageSize / 3) + "px",
        (imageSize / 3) + "px " + (imageSize / 3) + "px",
        ("")];
        
    }

   

    // Sudoku format
    if (puzzle.puzzletype == "sudoku" || type == "fedpuzzles") {
        return (
            <Link className="thumbnail-link" to={"/Puzzle/?" + "puzzleid=" + puzzleid + "&type=" + type} state={{ puzzleObj: puzzle }}>
                <div className='thumbnail-wrapper' style={{
                    borderImage: (puzzle.titleCSS != null) && (puzzle.titleCSS.toLowerCase().startsWith("rgb"))
                        ? "linear-gradient(90deg, " + puzzle.titleCSS + " 0%, " + puzzle.titleCSS + ' 100%) 1'
                        : puzzle.titleCSS + " 1",
                }}>
                    {type != "fedpuzzles" && <p className='thumbnailpuzzle-name' >{name != null ? name : "ID : " + puzzle.sudoku_id}</p>}
                    {type == "fedpuzzles" && <p className='thumbnailpuzzle-name'> A puzzle from group {puzzle.group}</p>}

                    <div className='puzzle-thumbnail' >

                        {puzzledata.map((rows, index) => {
                            return (
                                <div key={index} className='t-row'>
                                    {rows.map((cell, sIndex) => {
                                        return <div key={index + " " + sIndex} className='t-cell'>
                                            {cell == 0 ? "" : cell}
                                        </div>
                                    })}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </Link>
        )
    }

    // Eights format
    else if (puzzle.puzzletype == "eights") {
        // Display eights as the solution and not the puzzle
        const puzzlesolution = eval(puzzle.solution); // Remove this from front end except for eights so people cant see the solution
        const puzzleImage = fullurl + puzzle.puzzleImage
        

        return (
            <Link onMouseEnter={e => handleHover(1)} onMouseLeave={e => handleHover(0)} className="thumbnail-link" to={"/Puzzle/?" + "puzzleid=" + puzzleid + "&type=" + type} state={{ puzzleObj: puzzle }}>
                <div className='thumbnail-wrapper' style={{
                    borderImage: (puzzle.titleCSS != null) && (puzzle.titleCSS.toLowerCase().startsWith("rgb") || puzzle.titleCSS.toLowerCase().startsWith("#"))
                        ? "linear-gradient(90deg, " + puzzle.titleCSS + " 0%, " + puzzle.titleCSS + ' 100%) 1'
                        : puzzle.titleCSS + " 1",
                }}>
                    <p className='thumbnailpuzzle-name' >{name != null ? name : "ID : " + puzzle.sudoku_id}</p>
                    {type == "fedpuzzles" && <p className='thumbnailpuzzle-name'> Group : {puzzle.group}</p>}

                    <div className='puzzle-thumbnail' >

                        {isHovered ? puzzledata.map((rows, index) => {
                            return (
                                <div key={index} className='t-row'>
                                    {rows.map((cell, sIndex) => {
                                        return <div key={index + " " + sIndex} className='t-cell image-thumb' style={{
                                            backgroundImage: cell == 9 ? "none" : `url(${puzzleImage})`,
                                            backgroundPosition: cell == 9 ? "" : offsets[cell - 1],
                                            backgroundColor: cell == 9 ? "transparent" : "",
                                        }}>
                                        </div>
                                    })}
                                </div>
                            );
                        }) : puzzlesolution.map((rows, index) => {
                            return (
                                <div key={index} className='t-row'>
                                    {rows.map((cell, sIndex) => {
                                        return <div key={index + " " + sIndex} className='t-cell image-thumb' style={{
                                            backgroundImage: `url(${puzzleImage})`,
                                            backgroundPosition: offsets[cell - 1],
                                        }}>
                                        </div>
                                    })}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </Link>
        )
    }

    // Queens does not have a thumbnail

}

export default Thumbnail;