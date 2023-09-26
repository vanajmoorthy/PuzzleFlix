// Libraries 
import React from 'react';
import { useNavigate } from "react-router-dom"

//styling
import LoggedOut from "./../../../assets/loggedout.svg"
import "./LoggedOutPage.css"
import "./../../Nav/nav.css"
import { useEffect } from 'react';



function LoggedOutPage(props){
    const navigate = useNavigate()

    const {setLoginState} = props;

    const home = () => {
        navigate("/")
    }

    const login = () => {
        navigate("/Login")
    }

    useEffect(() => {
        localStorage.clear()
        setLoginState(0)
    })

    return (
        <div className='loggedout-wrapper'>
            <h1 className='loggedout-title'>You session has expired.</h1>
            <img className='loggedout-img' src={LoggedOut}/>
            <button className='login-btn btn' onClick={login}>Login</button>
            <br/>
            <button className='login-btn btn' onClick={home}>Return Home</button>
        </div>
    )
}

export default LoggedOutPage;