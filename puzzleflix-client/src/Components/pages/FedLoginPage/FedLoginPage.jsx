// Libraries 
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Axios from "axios";

// Config 
import { fullurl } from "./../../../Config";

// Styling 
import "./FedLoginPage.css";

// Assets 
import LoadingIcon from "./../../../assets/Loading.svg";

// Components 
import FedLoginModal from "../../modals/FedLoginModal/FedLoginModal";

function FedLoginPage(props) {
    const { theme } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group, setGroup] = useState(1);

    const [invalidLogin, setLoginValidity] = useState(0); //if true, print error message in modal
    const [errorMessage, setErrorMessage] = useState("");

    const [redirect_uri, setRedirect_uri] = useState(""); // For redirecting to fed site 
    const [client_id, setClient_id] = useState("");
    const [state, setState] = useState("");

    const [isLoading, setIsLoading] = useState(0); // for controlling whether to display loading screen

    const [searchParams, setSearchParams] = useSearchParams();

    const sendCode = async (code) => {
        // window.location.replace(redirect_uri + "/?code=" + code + "&state=" + state)
        window.location.href =
            redirect_uri + "/?code=" + code + "&state=" + state;
    };

    // Check local backend to validate user credentials 
    const pingback = async (info) => {
        try {
            const res = await Axios({
                method: "POST",
                data: {
                    userid: info.user.userid,
                    redirect_uri: redirect_uri,
                    client_id: client_id,
                },
                withCredentials: true,
                url: fullurl + "/fedapi/auth/fedlogin/successful",
            });
            let data = res.data;
            let code = data.code;
            sendCode(code);
        } catch (err) {
            console.error(err);
        }
    };

    // Validates the formatting of the user credentials 
    const validateLogin = async () => {
        if (username == "" || password == "" || group == "") {
            setLoginValidity(1);
            setErrorMessage("Please fill out all fields!");
        } else {
            console.log("Posting");
            setIsLoading(1);

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
                setIsLoading(0);

                pingback(data);
            } catch (err) {
                setErrorMessage(err.response.data);
                setLoginValidity(0);
                setIsLoading(0);
            }
        }
    };

    // Retrieves appropriate values from URL  
    useEffect(() => {
        setRedirect_uri(searchParams.get("redirect_uri"));
        setClient_id(searchParams.get("client_id"));
        setState(searchParams.get("state"));
        console.log(redirect_uri + " " + client_id);
    });

    if (isLoading == 0) {
        return (
            <div className="fedloginpage-wrapper">
                <FedLoginModal
                    setUsername={setUsername}
                    setPassword={setPassword}
                    setGroup={setGroup}
                    validateLogin={validateLogin}
                    invalidLogin={invalidLogin}
                    errorMessage={errorMessage}
                    theme={theme}
                />
            </div>
        );
    } else {
        return (
            <div className="loading-wrapper">
                <img className="loading-icon" src={LoadingIcon} />
                <h1 className="loading-message">
                    Authenticating Your Credentials...
                </h1>
            </div>
        );
    }
}

export default FedLoginPage;
