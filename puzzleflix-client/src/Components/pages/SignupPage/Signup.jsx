// Libraries 
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// Config 
import { fullurl, port } from "./../../../Config";

//Styling
import "./Signup.css";

// Assets 
import LoadingIcon from "./../../../assets/Loading.svg";

// Components 
import SignupModal from "../../modals/SignupModal/SignupModal";

function SignupPage(props) {
    const { get_login_state, setLoginState, setLocalStorageUser, theme } =
        props;

    const [email, setEmail] = useState("");
    const [firstname, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [invalidSignup, setSignupValidity] = useState(0); //if true, print error message in modal
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(0);


    // Validates the format of the signup credentials and sends them to the backend 
    const validateSignup = async () => {
        console.log("Posting");

        if (
            email == "" ||
            firstname == "" ||
            surname == "" ||
            username == "" ||
            password == ""
        ) {
            setSignupValidity(1);
            setErrorMessage("Please fill in all fields!");
        }


        // Send data to back end for authentication
        try {
            const res = await Axios({
                method: "POST",
                data: {
                    email: email,
                    firstname: firstname,
                    surname: surname,
                    username: username,
                    password: password,
                },
                withCredentials: true,
                url: fullurl + "/signup",
            });
            let data = res.data;

            let accessToken = data.accessToken;
            let refreshToken = data.refreshToken;
            let accessTokenExpiry = new Date(data.accessExpiryDate);
            let refreshTokenExpiry = new Date(data.refreshExpiryDate);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem(
                "accessTokenExpiry",
                accessTokenExpiry.getTime()
            );
            localStorage.setItem(
                "refreshTokenExpiry",
                refreshTokenExpiry.getTime()
            );

            setLoginState(1);
            setSignupValidity(0);
            setLocalStorageUser(data.user);
            setErrorMessage("");
            setIsLoading(0);
            navigate("/");
        } catch (err) {
            setErrorMessage(err.response.data);
            setSignupValidity(0);
            setIsLoading(0);
        }
    };

    if (isLoading == 0) {
        return (
            <div className="signup-wrapper">
                <SignupModal
                    setEmail={setEmail}
                    setFirstName={setFirstName}
                    setSurname={setSurname}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    setPasswordConfirm={setPasswordConfirm}
                    validateSignup={validateSignup}
                    username={username}
                    firstname={firstname}
                    surname={surname}
                    password={password}
                    passwordConfirm={passwordConfirm}
                    invalidSignup={invalidSignup}
                    errorMessage={errorMessage}
                    theme={theme}
                />
            </div>
        );
    } else {
        return (
            <div className="loading-wrapper">
                <img className="loading-icon" src={LoadingIcon} />
                <h1 className="loading-message">Logging you in...</h1>
            </div>
        );
    }
}

export default SignupPage;
