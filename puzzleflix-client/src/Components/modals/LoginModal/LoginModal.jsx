// Libraries
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

//Styling
import "../../../base.css";
import "./LoginModal.css";

// Assets
import View from "../../../assets/view.svg";
import Hide from "../../../assets/hide.svg";
import ViewWhite from "../../../assets/view-white.svg";
import HideWhite from "../../../assets/hide-white.svg";

function LoginModal(props) {
    const {
        setUsername,
        setPassword,
        setGroup,
        group,
        validateLogin,
        invalidLogin,
        errorMessage,
        theme,
    } = props;

    const [isloading, setLoading] = useState(0);

    const [isPasswordVisible, setIsPasswordVisible] = useState(1);

    // Handles user clicking on show password button
    const showPassword = () => {
        setIsPasswordVisible((curr) => !curr);
    };

    // Handles user clicking enter button keyboard to login
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            validateLogin();
        }
    };

    return (
        <div className="loginmodal-outer-wrapper">
            <div className="loginmodal-inner-wrapper">
                <h1 className="title">Welcome back to PuzzleFlix!</h1>
                <h2 className="byline">
                    Please enter your credentials to log in.
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
                    ) : (
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
                    )}
                </div>

                <div className="login-element">
                    <select
                        className="group-select"
                        type="select"
                        name="group"
                        onChange={(e) => setGroup(e.target.value)}
                        value={group}
                    >
                        <option value={15} defaultValue>
                            {" "}
                            Group 15{" "}
                        </option>
                        <option value={10}> Group 10 </option>
                        <option value={11}> Group 11 </option>
                        <option value={12}> Group 12 </option>
                        <option value={13}> Group 13 </option>
                        <option value={14}> Group 14 </option>
                        <option value={16}> Group 16 </option>
                        <option value={17}> Group 17 </option>
                        <option value={18}> Group 18 </option>
                        <option value={19}> Group 19 </option>
                    </select>
                </div>

                <div className="login-element loginmodal-login-wrapper">
                    <input
                        type="submit"
                        value="Login"
                        className="login-btn"
                        onKeyPress={handleKeyPress}
                        onClick={validateLogin}
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

export default LoginModal;
