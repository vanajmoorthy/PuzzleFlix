// Libraries 
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import Axios from "axios";
import { port, fullurl } from "./../../../Config";

// Assets 
import SearchSvg from "./../../../assets/search.svg";
import SearchWhiteSvg from "./../../../assets/search-white.svg";

// Components 
import ResultBanner from './ResultBanner';

function SearchDropDown(props) {
    const { theme } = props;

    const [results, setResults] = useState([]);

    // handles each keypress in the search bar text-area 
    // sends each keystroke to the backend to retrieve all possible users which match the current input 
    const handleSearchChange = async (text) => {
        if (text == "") {
            setResults([]);
        }
        else {
            try {
                const res = await Axios({
                    method: "POST",
                    withCredentials: true,
                    url: fullurl + "/searchUsers",
                    data: {
                        username: text
                    }
                });
                let data = res.data;
                setResults(data);
            } catch (err) {
                console.log("No Results");
            }
        }
    };

    if (true) {
        return (
            <div className='search-wrapper'>
                <div className="search">
                    <form>
                        <input type="text" placeholder="Search Users" onChange={(e) => handleSearchChange(e.target.value)} />
                    </form>
                    {theme == "light" ?

                        <img src={SearchSvg} alt="" /> :
                        <img src={SearchWhiteSvg} alt="" />
                    }
                </div>
                <div className='search-dropdown'>
                    {results.map((userObj, index) => {
                        // console.log(userObj)
                        return (<ResultBanner userObj={userObj} key={index} />);
                    })}
                </div>
            </div>
        );
    }
}

export default SearchDropDown;