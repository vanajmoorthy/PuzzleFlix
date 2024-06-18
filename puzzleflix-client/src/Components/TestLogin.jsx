import React from 'react';
import LoginModal from "./modals/LoginModal/LoginModal";
import { useState } from "react";
import { useEffect } from 'react';
import { redirect, useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import Axios from "axios";


import FedLoginModal from "./modals/FedLoginModal/FedLoginModal";




function TestLogin(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group, setGroup] = useState(1);

    const redirect_uri = "http://localhost:24600/fedapi/authorise";

    const validateLogin = async () => {
        try {
            const res = await Axios({
                method: "GET",
                params: {
                    client_id: 14,
                    redirect_uri: redirect_uri,
                    response_type: "code"
                },
                withCredentials: true,
                url: "https://puzzleflix.vanaj.io/fedapi/auth/authorise"
            });
            // console.log(res.data.url)
            const url = redirect_uri + "/?redirect_uri=" + redirect_uri + "&client_id=" + 14 + "";
            window.location.replace(url);
            // console.log(res)
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div>
            <FedLoginModal setUsername={setUsername}
                setPassword={setPassword}
                setGroup={setGroup}
                validateLogin={validateLogin}
            />
        </div>
    );
}

export default TestLogin;