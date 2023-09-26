// Libraries
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Assets
import View from "../../../assets/view.svg";
import ViewWhite from "../../../assets/view-white.svg";
import Hide from "../../../assets/hide.svg";
import HideWhite from "../../../assets/hide-white.svg";

//Styling
import "../LoginModal/LoginModal.css";

function SignupModal(props) {
    const {
        setEmail,
        setFirstName,
        setSurname,
        setUsername,
        setPassword,
        setPasswordConfirm,
        validateSignup,
        theme,
    } = props;

    const {
        firstname,
        surname,
        username,
        password,
        passwordConfirm,
        errorMessage,
    } = props;

    const [isPasswordVisible, setIsPasswordVisible] = useState(1);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(1);

    const [errors, setErrors] = useState([]);

    // handles clicing on show password button
    const showPassword = () => {
        setIsPasswordVisible((curr) => !curr);
    };

    // handles clicking on show password button in confirm password input
    const showConfirmPassword = () => {
        setIsConfirmPasswordVisible((curr) => !curr);
    };

    // Checks that the user's credentials are valid
    const areDetailsValid = () => {
        let errorsArray = [];

        let firstnameError =
            "First name can only contain uppercase and lowercase characters.";

        if (!firstname.match(/^[A-Za-z]+$/) && firstname != "") {
            if (!errorsArray.includes(firstnameError)) {
                errorsArray.push(firstnameError);
                setErrors(errorsArray);
                return false;
            }
        }

        if (firstname.match(/^[A-Za-z]+$/)) {
            errorsArray.splice(errorsArray.indexOf(firstnameError), 1);
            setErrors(errorsArray);
        }

        let surnameError =
            "Last name can only contain uppercase and lowercase characters.";
        if (!surname.match(/^[A-Za-z]+$/) && surname != "") {
            if (!errorsArray.includes(surnameError)) {
                errorsArray.push(surnameError);
                setErrors(errorsArray);
                return false;
            }
        }

        if (surname.match(/^[A-Za-z]+$/)) {
            errorsArray.splice(errorsArray.indexOf(surnameError), 1);
            setErrors(errorsArray);
        }

        let usernameError =
            "Username should be 5-20 characters long, can only contain characters, numbers, underscores or periods, and must start with a character or number.";
        if (
            !username.match(
                /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
            ) &&
            username != ""
        ) {
            if (!errorsArray.includes(usernameError)) {
                errorsArray.push(usernameError);
                setErrors(errorsArray);
                return false;
            }
        }

        let passwordStrengthError =
            "Password must have minimum eight characters, maximun 32 characters and at least one number and one special character.";
        if (
            !password.match(
                /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/
            )
        ) {
            if (!errorsArray.includes(passwordStrengthError)) {
                errorsArray.push(passwordStrengthError);
                setErrors(errorsArray);
                console.log(errorsArray);
            }
        } else if (
            password.match(
                /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/
            )
        ) {
            errorsArray.splice(passwordStrengthError, 1);
            setErrors(errorsArray);
            console.log("valid" + errorsArray);
        }

        let passwordError = "Passwords much match.";
        if (password !== passwordConfirm) {
            if (!errorsArray.includes(passwordError)) {
                errorsArray.push(passwordError);
                setErrors(errorsArray);
                return false;
            }
        }

        if (
            password === passwordConfirm &&
            password != "" &&
            passwordConfirm != "" &&
            password.match(
                /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/
            )
        ) {
            errorsArray.splice(errorsArray.indexOf(passwordConfirm), 1);
            setErrors(errorsArray);
        }

        if (errorsArray.length > 0) {
            setErrors(errorsArray);
            console.log("Not Valid");
        } else {
            if (firstname !== "") {
                console.log(errorsArray);
                console.log("Valid");

                validateSignup();
                return true;
            }
        }
    };

    // Handles user pressing enter key to sign up
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            console.log("enter");
            areDetailsValid();
        }
    };

    return (
        <div className="loginmodal-outer-wrapper">
            <div className="loginmodal-inner-wrapper">
                <div className="login-form">
                    <h1 className="title">Welcome to PuzzleFlix!</h1>
                    <h2 className="byline">
                        Please enter your details to sign up.
                    </h2>

                    <ul className="errors">
                        {errors.map((error) => (
                            <li key="error">{error}</li>
                        ))}
                    </ul>

                    <h3 className="error-msg">{errorMessage}</h3>
                    <div className="login-element-row">
                        <input
                            className="text-input row"
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="text-input row"
                            type="text"
                            name="surname"
                            placeholder="Last Name"
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>

                    <div className="login-element">
                        <input
                            className="text-input"
                            type="email"
                            onKeyPress={handleKeyPress}
                            name="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login-element">
                        <input
                            className="text-input"
                            onKeyPress={handleKeyPress}
                            type="text"
                            name="username"
                            placeholder="Username"
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
                                onKeyPress={handleKeyPress}
                                type="text"
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

                    <div className="login-element relative">
                        {isConfirmPasswordVisible ? (
                            <input
                                className="text-input"
                                type="password"
                                name="password-confirm"
                                placeholder="Confirm Password"
                                onKeyPress={handleKeyPress}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                            />
                        ) : (
                            <input
                                className="text-input"
                                type="text"
                                onKeyPress={handleKeyPress}
                                name="password-confirm"
                                placeholder="Confirm Password"
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                            />
                        )}

                        {theme === "light" ? (
                            <button
                                onClick={() => showConfirmPassword()}
                                className="pass-show"
                            >
                                {isConfirmPasswordVisible ? (
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
                                onClick={() => showConfirmPassword()}
                                className="pass-show"
                            >
                                {isConfirmPasswordVisible ? (
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

                    <div className="login-element loginmodal-login-wrapper">
                        <input
                            type="button"
                            value="Sign up"
                            className="login-btn"
                            onKeyPress={handleKeyPress}
                            onClick={() => areDetailsValid()}
                        />
                    </div>

                    <div className="login-element registration">
                        Already have an account?
                        <Link to="/Login" className="link-hover">
                            {" "}
                            Log in here.
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupModal;
