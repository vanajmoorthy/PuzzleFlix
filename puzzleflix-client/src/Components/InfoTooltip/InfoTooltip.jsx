import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

//Styling
import "./InfoTooltip.css";
import { ReactComponent as InfoIcon } from "../../assets/bx-info-circle.svg";

function InfoTooltip(props) {
    const { info } = props;
    const [message, setMessage] = useState("");

    const toggleInfo = () => {
        if (message == "") {
            setMessage(info);
        } else {
            setMessage("");
        }
    };

    return (
        <div>
            <InfoIcon
                className="info-icon"
                onMouseEnter={toggleInfo}
                onClick={toggleInfo}
                onMouseLeave={toggleInfo}
            />
            <div className={message == "" ? "hide-message" : "message"}>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default InfoTooltip;
