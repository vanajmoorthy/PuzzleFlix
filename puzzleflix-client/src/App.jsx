import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
//config
import { port, fullurl } from "./Config";

//Custom Components
import Nav from "./Components/Nav/Nav";
import LoginPage from "./Components/pages/LoginPage/Login";
import SignupPage from "./Components/pages/SignupPage/Signup";
import HomePage from "./Components/pages/HomePage/Home";
import ProfilePage from "./Components/pages/ProfilePage/Profile";
import CreatePuzzlePage from "./Components/pages/CreatePuzzle/CreatePuzzle";
import PuzzlePage from "./Components/pages/PuzzlePage/PuzzlePage";
import LoggedOutPage from "./Components/pages/LoggedOutPage/LoggedOutPage";
import FedLoginPage from "./Components/pages/FedLoginPage/FedLoginPage";
import EightQueen from "./Components/pages/EightQueen/EightQueen";
import NotFound from "./Components/pages/NotFound/NotFound";

import TestLogin from "./Components/TestLogin";

//Styling
import "./base.css";
import "./dark.css";

function App() {
    const [theme, setTheme] = useState("");

    useLayoutEffect(() => {
        // setThemeInStorage("light");
        let theme = localStorage.getItem("theme");
        if (theme) {
            setTheme(theme);
            return;
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    }, []);

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
        } else {
            setTheme("light");
            localStorage.setItem("theme", "light");
        }
    };

    const handleToggle = () => {
        toggleTheme();
    };

    //1 for logged in, 0 if not logged in
    const [loginState, setLoginState] = useState(0);

    //sets the login state in local storage
    const set_login_state = (val) => {
        setLoginState(val);
        localStorage.setItem("loginState", val);
    };

    //gets the login state from local storage
    const get_login_state = () => {
        const login_state = localStorage.getItem("loginState");
        if (login_state == null || login_state == 0) {
            return 0;
        }
        return 1;
    };

    //for detecting the expiry of access token
    const checkAccessToken = () => {
        const now = new Date();
        const currentTime = now.getTime();

        const expiryDateStr = localStorage.getItem("accessTokenExpiry");

        if (expiryDateStr == null || expiryDateStr == "") {
            return false;
        }

        const expiryDate = Date.parse(expiryDateStr);

        if (expiryDate < currentTime) {
            return false;
        }
        return true;
    };

    //set user data in cookies
    const setLocalStorageUser = (user) => {
        localStorage.setItem("username", user.username);
        localStorage.setItem("firstname", user.fname);
        localStorage.setItem("surname", user.sname);
        localStorage.setItem("elevation", user.accountelevation);
        localStorage.setItem("group", user.groupcreated);
        localStorage.setItem("email", user.email);
        localStorage.setItem("userid", user.userid);
        localStorage.setItem("xp", user.xp);
        localStorage.setItem("avatar", user.avatar);
    };

    //retrieve puzzles from other groups
    const retrieveForeignPuzzles = async () => {
        try {
        } catch (err) { }
    };

    //check from cookies if we are logged in
    useEffect(() => {
        const login_state = get_login_state();

        if (login_state == null || login_state == 0) {
            setLoginState(0);
        } else {
            setLoginState(1);
        }
        // document.getElementsByName(html).className = theme;
        document.body.className = theme;
    }, [theme]);

    return (
        <div className={`App ${theme}`}>
            <BrowserRouter>
                <Nav
                    handleToggle={handleToggle}
                    setLoginState={set_login_state}
                    get_login_state={get_login_state}
                    theme={theme}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                checkAccessToken={checkAccessToken}
                                get_login_state={get_login_state}
                                setLoginState={set_login_state}
                            />
                        }
                    />
                    <Route
                        path="/Login"
                        element={
                            <LoginPage
                                checkAccessToken={checkAccessToken}
                                setLocalStorageUser={setLocalStorageUser}
                                get_login_state={get_login_state}
                                setLoginState={set_login_state}
                                theme={theme}
                            />
                        }
                    />
                    <Route
                        path="/Signup"
                        element={
                            <SignupPage
                                checkAccessToken={checkAccessToken}
                                setLocalStorageUser={setLocalStorageUser}
                                get_login_state={get_login_state}
                                setLoginState={set_login_state}
                                theme={theme}
                            />
                        }
                    />
                    <Route
                        path="/Profile"
                        element={
                            <ProfilePage
                                checkAccessToken={checkAccessToken}
                                get_login_state={get_login_state}
                                setLoginState={set_login_state}
                                set_login_state={set_login_state}
                                setLocalStorageUser={setLocalStorageUser}
                            />
                        }
                    />
                    <Route
                        path="/CreatePuzzle"
                        element={
                            <CreatePuzzlePage
                                checkAccessToken={checkAccessToken}
                                loginState={loginState}
                                setLoginState={set_login_state}
                            />
                        }
                    />
                    <Route
                        path="/Puzzle"
                        element={
                            <PuzzlePage checkAccessToken={checkAccessToken} />
                        }
                    />
                    <Route
                        path="/LoggedOut"
                        element={
                            <LoggedOutPage setLoginState={set_login_state} />
                        }
                    />
                    <Route
                        path="/EightQueen"
                        theme={theme}
                        element={
                            <EightQueen
                                loginState={loginState}
                                checkAccessToken={checkAccessToken}
                            />
                        }
                    />
                    <Route
                        path="/FedLogin"
                        theme={theme}
                        element={<FedLoginPage />}
                    />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/TestLogin" element={<TestLogin />} />
                </Routes>
                <footer style={{ display: "flex", flexDirection: "column", borderTop: "2px solid var(--button-red)", margin: "0rem 1rem", padding: "1rem 0rem" }}>
                    <p style={{ color: "var(--black)", fontWeight: 500 }}>Developed by Vanaj Moorthy, Jimmy Zhang, Paul Revell, Anthony Zhu, and Ray Li at the University of St Andrews</p>
                    <p style={{ color: "var(--black)", marginTop: "1rem", fontWeight: 500 }}>Find source <a style={{ color: "var(--link-blue)" }} href="https://github.com/vanajmoorthy/PuzzleFlix/tree/main">here</a></p>
                </footer>
            </BrowserRouter>
        </div>
    );
}

export default App;
