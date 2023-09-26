import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { port, fullurl } from "./../../../Config";

import "./SearchDropDown.css";
import "../../../base.css";
import "../../../dark.css";

function ResultBanner(props) {
    const { userObj } = props;

    // Refreshes page after 50ms
    const refreshPage = () => {
        setTimeout(() => {
            window.location.reload(false);
        }, 50);
    };

    return (
        <div className="result-banner">
            <Link
                className="result-banner-link"
                to={"/Profile/?user=" + userObj.username + "&type==1"}
                onClick={refreshPage}
            >
                <img
                    className="profile-icon"
                    src={fullurl + userObj.avatar}
                    alt=""
                />

                <h1 className="result-banner-username">{userObj.username}</h1>
            </Link>
        </div>
    );
}

export default ResultBanner;
