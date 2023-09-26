// Libraries 
import React from "react";
import { useState, useLayoutEffect, useEffect } from "react";

// Styling 
import "../../../base.css";
import "./SuccessModal.css";

// Assets 
import { ReactComponent as CloseIcon } from "../../../assets/bx-x.svg";

// Components 
import Confetti from "react-confetti";

function SuccessModal(props) {
    const { message, modalState, setModalState, setHasSolved } = props;

    useLayoutEffect(() => {
        
    });

    if (modalState) {
        return (
            <div className="success-modal-holder">
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    initialVelocityY={20}
                    gravity={0.2}
                />
                <div className="success-modal">
                    <div className="close-btn-holder">
                        <button
                            className="close-btn"
                            onClick={() => {
                                setModalState(false);
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="success-message-holder">
                        <h2 className="success-message">{message}</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default SuccessModal;
