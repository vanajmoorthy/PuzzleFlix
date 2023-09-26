// Libraries
import React from "react";
import Axios from "axios";
import { useState } from "react";
import { useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

// Config
import { port, fullurl } from "../../../Config";

//custom components
import ContentBelt from "../../modals/ContentBelt/ContentBelt";

//styling
import "./Home.css";

// Assets
import LoadingIcon from "./../../../assets/Loading.svg";

function Home(props) {
    const { checkAccessToken, setLoginState, theme } = props;

    const [canRender, setCanRender] = useState(1);

    const access_token = localStorage.getItem("accessToken");

    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    //logout functionality
    const logout = () => {
        setLoginState(0);
        localStorage.clear();
        navigate("/LoggedOut");
    };

    // Checks whether user is logged in and access token has not expired
    useLayoutEffect(() => {
        // If the user logged in through fedapi login
        const fedapi = searchParams.get("fedapi");
        if (fedapi == 1){
            localStorage.setItem("fedapi", 1);
            localStorage.setItem("userid", searchParams.get("userid")) 
            localStorage.setItem("username", searchParams.get("username")) 
            localStorage.setItem("email", searchParams.get("email")) 
            localStorage.setItem("accessToken", searchParams.get("access_token"))
            localStorage.setItem("refreshToken", searchParams.get("access_token"))
            localStorage.setItem("group", searchParams.get("group")) 
            localStorage.setItem("loginState",1)
            localStorage.setItem("elevation",0)
            localStorage.setItem("xp", 0)
            localStorage.setItem("firstname", searchParams.get("userid")) 
            localStorage.setItem("lastname", "") 
            localStorage.setItem("surname", "") 
            localStorage.setItem("accessTokenExpiry", searchParams.get("expiry"))
            setCanRender(1);

        } else if (!checkAccessToken() && localStorage.getItem("loginState") == 1) {
            logout();
        } else if (!checkAccessToken()) {
            setLoginState(0);
            localStorage.clear();
            navigate("/");
        } else {
            setCanRender(1);
        }
    }, []);

    if (canRender == 1) {
        return (
            <div>
                {localStorage.getItem("loginState") == 1 && (
                    <ContentBelt
                        theme={theme}
                        name={"Continue Solving"}
                        type={"progresspuzzles"}
                    />
                )}

                {localStorage.getItem("loginState") == 1 && (
                    <>
                        <ContentBelt name={"Solve Again"} type={"solveagain"} />
                        <ContentBelt
                            name={"Your Puzzles"}
                            type={"yourpuzzles"}
                        />
                    </>
                )}

                <ContentBelt name={"All Sudoku Puzzles"} type={"puzzles"} />

                <ContentBelt name={"All Eights Puzzles"} type={"eights"} />

                <ContentBelt name={"Federation Puzzles"} type={"fedpuzzles"} />
            </div>
        );
    } else {
        return (
            <div className="loading-wrapper">
                <img className="loading-icon" src={LoadingIcon} />;
            </div>
        );
    }
}

export default Home;
