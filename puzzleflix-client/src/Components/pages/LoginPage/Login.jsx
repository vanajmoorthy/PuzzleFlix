import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// Config 
import { port, fullurl } from "../../../Config";

//styling
import "./Login.css";

// Components 
import LoginModal from "../../modals/LoginModal/LoginModal";

// Assets 
import LoadingIcon from "./../../../assets/Loading.svg";

function LoginPage(props) {
    const { get_login_state, setLoginState, setLocalStorageUser, theme } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group, setGroup] = useState(15);

    const [invalidLogin, setLoginValidity] = useState(0); //if true, print error message in modal
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(0);

    // Map of all fed URLs  for redirecting 
    const clientMap = {
        10: "https://cs3099user10.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        11: "https://cs3099user11.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        12: "https://cs3099user12.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        13: "https://cs3099user13.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        14: "https://cs3099user14.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        16: "https://cs3099user16.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        17: "https://cs3099user17.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        18: "https://cs3099user18.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
        19: "https://cs3099user19.host.cs.st-andrews.ac.uk/fedapi/auth/authorise",
    };

    // Our own redirect URI
    const redirectURI =
        "https://cs3099user15.host.cs.st-andrews.ac.uk/fedapi/auth/redirect/:" +
        group;
    const params =
        "/?response_type=code&redirect_uri=" + redirectURI + "&client_id=15";

    // Handler for login button 
    const validateLogin = () => {
        // If not fed login
        if (group == 15) {
            // Check that credentials are valid 
            if (username == "" || password == "" || group == "") {
                setLoginValidity(1);
                setErrorMessage("Please fill out all fields!");
            } else {
                validateLoginDefault();
            }
        } else { // if fed login  
            validateLoginFed();
        }
    };

    // Redirect fed users 
    const validateLoginFed = () => {
        setIsLoading(1);
        console.log("Posting...");

        console.log(clientMap[group] + params);

        window.location.replace(clientMap[group] + params);
    };

    // Handler for local login 
    const validateLoginDefault = async () => {
        console.log("Posting");
        setIsLoading(1);

        // Send user credentials to backend 
        try {
            const res = await Axios({
                method: "POST",
                data: {
                    username: username,
                    password: password,
                },
                withCredentials: true,
                url: fullurl + "/login",
            });
            let data = res.data;

            let accessToken = data.accessToken;
            let refreshToken = data.refreshToken;
            let accessTokenExpiry = new Date(data.accessExpiryDate);
            let refreshTokenExpiry = new Date(data.refreshExpiryDate);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accessTokenExpiry", accessTokenExpiry.getTime());
            localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry.getTime());
            localStorage.setItem("fedapi", 0);

            setLoginValidity(0);
            setLoginState(1);
            setLocalStorageUser(data.user);
            setErrorMessage("");
            
            setIsLoading(0);
            navigate("/");

        } catch (err) {
            setErrorMessage(err.response.data);
            setLoginValidity(0);
            setIsLoading(0);
        }
    };

    if (isLoading == 0) {
        return (
            <div className="loginpage-wrapper">
                <LoginModal
                    setUsername={setUsername}
                    setPassword={setPassword}
                    setGroup={setGroup}
                    validateLogin={validateLogin}
                    invalidLogin={invalidLogin}
                    errorMessage={errorMessage}
                    group={group}
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

export default LoginPage;
