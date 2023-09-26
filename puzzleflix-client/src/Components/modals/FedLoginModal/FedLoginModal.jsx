// Libraries
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

//Styling
import "../../../base.css";

// Assets
import View from "../../../assets/view.svg";
import ViewWhite from "../../../assets/view-white.svg";
import Hide from "../../../assets/hide.svg";
import HideWhite from "../../../assets/hide-white.svg";

function FedLoginModal(props) {
    const {
        setUsername,
        setPassword,
        setGroup,
        validateLogin,
        invalidLogin,
        errorMessage,
        theme,
    } = props;

    const [isloading, setLoading] = useState(0);

    const [isPasswordVisible, setIsPasswordVisible] = useState(1);

    const [loginBtnValue, setLoginBtnValue] = useState("Login");

    // Handles the user clicking on login button
    const onLogin = () => {
        setLoginBtnValue("Loading...");
        validateLogin();
    };

    // Handles clicking on the show password button
    const showPassword = () => {
        setIsPasswordVisible((curr) => !curr);
    };

    // Handles the user hitting enter button on keyboard rather than clicking login button
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            console.log("enter");
            onLogin();
        }
    };

    return (
        <div className="loginmodal-outer-wrapper">
            <div className="loginmodal-inner-wrapper">
                <h1 className="title">Authorize With PuzzleFlix!</h1>
                <h2 className="byline">
                    Please enter your credentials to verify.
                </h2>

                <h3 className="error-msg">{errorMessage}</h3>

                <div className="login-element">
                    <input
                        className="text-input"
                        onKeyPress={handleKeyPress}
                        type="text"
                        name="username"
                        placeholder="Enter username..."
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="login-element relative">
                    {isPasswordVisible ? (
                        <input
                            className="text-input"
                            type="password"
                            name="password"
                            placeholder="Enter password..."
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    ) : (
                        <input
                            className="text-input"
                            type="text"
                            onKeyPress={handleKeyPress}
                            name="password"
                            placeholder="Enter password..."
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}

                    {theme === "light" ? (
                        <button
                            onClick={() => showPassword()}
                            className="pass-show"
                        >
                            {isPasswordVisible ? (
                                <img
                                    className="pass-show-btn"
                                    src={HideWhite}
                                    alt=""
                                />
                            ) : (
                                <img
                                    className="pass-show-btn"
                                    src={ViewWhite}
                                    alt=""
                                />
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => showPassword()}
                            className="pass-show"
                        >
                            {isPasswordVisible ? (
                                <img
                                    className="pass-show-btn"
                                    src={Hide}
                                    alt=""
                                />
                            ) : (
                                <img
                                    className="pass-show-btn"
                                    src={View}
                                    alt=""
                                />
                            )}
                        </button>
                    )}
                </div>

                <div className="login-element loginmodal-login-wrapper">
                    <input
                        type="submit"
                        value={loginBtnValue}
                        className="login-btn"
                        onKeyPress={handleKeyPress}
                        onClick={onLogin}
                    />
                </div>

                <div className="registration">
                    Don't have an account?
                    <Link to="/Signup" className="link-hover">
                        {" "}
                        Sign up for free!
                    </Link>
                </div>
                <a className="link-hover" href="">
                    Reset Password
                </a>
            </div>
        </div>
    );
}

export default FedLoginModal;
